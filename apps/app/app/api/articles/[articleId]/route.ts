import { deleteArticle, updateArticle } from "@/actions/articles";
import { guard } from "@/lib/auth";
import { articlePatchSchema } from "@/lib/validations/article";
import * as z from "zod";

const routeContextSchema = z.object({
  params: z.object({
    articleId: z.string(),
  }),
});

export const PATCH = guard(
  async ({ user,body, ctx }) => {
    try {
      const { articleId } = await ctx.params;
      await updateArticle(articleId, user, body);

      return new Response(null, { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify(err), { status: 500 });
    }
  },
  {
    schemas: {
      contextSchema: routeContextSchema,
      bodySchema: articlePatchSchema,
    },
  },
);

export const DELETE = guard(
  async ({ user, ctx }) => {
    try {
      const { articleId } = await ctx.params;

      await deleteArticle(articleId, user.id);

      return new Response(null, { status: 204 });
    } catch (err) {
      return new Response(JSON.stringify(err), { status: 500 });
    }
  },
  {
    schemas: {
      contextSchema: routeContextSchema,
    },
  },
);
