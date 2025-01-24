import * as z from "zod";

export const articleCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
});

export const articlePatchSchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1).max(70),
    content: z.string(),
    seoTitle: z.string().max(60).nullable(),
    seoDescription: z.string().max(160).nullable(),
    ogImage: z.string().url().nullable(),
    published: z.boolean(),
    publishedAt: z.string().date(),
    canonicalURL: z.string().url().nullable(),
  })
  .partial();
