'use server';

import { formatDate, formatVerboseDate, jsonToFrontmatter } from '@/helper/utils';
import type {
  articleCreateSchema,
  articlePatchSchema,
} from '@/lib/validations/article';
import type { ExportResponse } from '@/types/minime';
import type { User } from '@repo/backend/auth';
import { currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { articles } from '@repo/backend/schema';
import { slugifyv2 } from '@repo/lib/src/slugify';
import { and, desc, eq } from 'drizzle-orm';
import type { z } from 'zod';
import { resend } from '@repo/email';
import Newsletter, { NewsletterProps } from '@repo/email/templates/newsletter';
import {Article} from "@/helper/utils";
import { getSubscribersByUserId } from '../subscribers';
import { rateLimit } from '@repo/rate-limit';
import { getUserName } from '@repo/backend/auth/format';
import { nanoid } from 'nanoid';

type ArticleCreateSchema = z.infer<typeof articleCreateSchema>;
type ArticlePatchSchema = z.infer<typeof articlePatchSchema>;

// get article
export async function getArticle({
  authorId,
  slug,
  published = true,
}: { authorId: string; slug: string; published?: boolean }) {
  return await database
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.authorId, authorId),
        eq(articles.slug, slug),
        eq(articles.published, published)
      )
    );
}

export async function getArticles({
  limit,
  published,
}: {
  limit?: number;
  published?: boolean;
} = {}) {
  const user = await currentUser();

  return await database
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.authorId, user?.id!),
        published !== undefined ? eq(articles.published, published) : undefined
      )
    )
    .orderBy(desc(articles.publishedAt))
    .limit(limit!);
}

export async function createArticle(
  authorId: string,
  data: z.infer<typeof articleCreateSchema>
) {
  const user = await currentUser();

  const article = await database
    .insert(articles)
    .values({
      organizationId: user!.user_metadata.organization_id,
      authorId,
      ...data,
    })
    .returning();

  return article;
}

export async function getArticleById(articleId: string) {
  const user = await currentUser();
  return await database
    .select()
    .from(articles)
    .where(and(eq(articles.id, articleId), eq(articles.authorId, user!.id!)));
}

export async function updateArticle(
  articleId: string,
  user: User,
  data: ArticlePatchSchema
) {
  const { slug, publishedAt, ...rest } = data;
  return await database
    .update(articles)
    .set({
      ...rest,
      slug: slug || slugifyv2(rest.title),
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
    })
    .where(and(eq(articles.id, articleId), eq(articles.authorId, user!.id!)))
    .returning();
}

export async function deleteArticle(articleId: string, authorId: string) {
  return await database
    .delete(articles)
    .where(and(eq(articles.id, articleId), eq(articles.authorId, authorId)));
}

// get articles by author
export async function getArticlesByAuthor(
  authorId: string,
  limit?: number,
  published = true
) {
  return await database
    .select()
    .from(articles)
    .where(
      and(eq(articles.authorId, authorId), eq(articles.published, published))
    )
    .orderBy(desc(articles.publishedAt))
    .limit(limit!);
}

export async function verifyArticleAccess(articleId: string, authorId: string) {
  const result = await database
    .select({ count: articles.id })
    .from(articles)
    .where(and(eq(articles.id, articleId), eq(articles.authorId, authorId)));

  return result.length > 0;
}

export async function getArticleExport(
  articleId: string,
  authorId: string
): Promise<ExportResponse> {
  const [article] = await database
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      content: articles.content,
      createdAt: articles.createdAt,
      updatedAt: articles.updatedAt,
      publishedAt: articles.publishedAt,
      published: articles.published,
      seoTitle: articles.seoTitle,
      seoDescription: articles.seoDescription,
      ogImage: articles.ogImage,
      canonicalURL: articles.canonicalURL,
    })
    .from(articles)
    .where(and(eq(articles.id, articleId), eq(articles.authorId, authorId)));

  if (!article) {
    throw new Error('Article not found');
  }

  if (!(await verifyArticleAccess(article.id, authorId))) {
    throw new Error('Permission denied');
  }

  const filename = `openstudio_minime_export_article_${article.slug}.md`;
  const {
    content: articleContent,
    createdAt,
    updatedAt,
    publishedAt,
    ...props
  } = article;
  const frontmatter = jsonToFrontmatter({
    ...props,
    createdAt: formatVerboseDate(createdAt),
    updatedAt: formatVerboseDate(updatedAt),
    publishedAt: formatVerboseDate(publishedAt),
  });
  const content = frontmatter + articleContent!;

  return { content, filename };
}

// get articles export
export async function getArticlesExport(authorId: string) {
  const articlesData = await database
    .select()
    .from(articles)
    .where(eq(articles.authorId, authorId));
  const data = await Promise.all(
    articlesData.map(async (article) => getArticleExport(article.id, authorId))
  );
  return data;
}

// get 
export async function getArticleByAuthor(articleId: string, authorId: string) {
  return await database
    .select()
    .from(articles)
    .where(and(eq(articles.id, articleId), eq(articles.authorId, authorId)));
}

export async function sendNewsletter(
  article: Article,
  user: User,
) {
  const { success } = await rateLimit.newsletter.limit(
    `newsletter:${user.id}:${article.id}`,
  );

  if (!success) {
    return new Response(
      "You can send newsletters a maximum of 2 times a day.",
      { status: 429 },
    );
  }

  const emails = await getSubscribersByUserId(user.id);

  if (emails.length) {
    await Promise.all([
      ...emails.map((e) => {
        sendNewsletterEmail({
          from: `${user?.user_metadata.username} from OpenStudio Minime <notify@openstudio.tech>`,
          to: e.email,
          subject: "I shared a new article.",
          newsletter: {
            title: article.title,
            author: user.user_metadata.username || getUserName(user),
            articleURL: user.user_metadata.domain
              ? `https://${user.user_metadata.domain}/articles/${article.slug}`
              : `https://${user.user_metadata.username}.openstudio.co.in/articles/${article.slug}`,
            published: formatDate(article.publishedAt),
            subId: e.id,
          },
        });
      }),
      database.update(articles).set({
        lastNewsletterSentAt: new Date(),
      }).where(eq(articles.id, article.id))
    ]);

    return new Response(null, { status: 200 });
  }
  return new Response("You don't have any subscribers", { status: 400 });
}


export async function sendNewsletterEmail({
  from,
  to,
  subject,
  newsletter,
}: {
  from: string;
  to: string;
  subject: string;
  newsletter: NewsletterProps;
}) {
  return await resend.emails.send({
    from,
    to,
    subject,
    react: Newsletter(newsletter),
    headers: {
      "X-Entity-Ref-ID": nanoid(),
    },
  });
}
