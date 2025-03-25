import { z } from 'zod';

export const createCategoryBody = z.object({
  id: z.string().uuid().nullish(),
  name: z.string().max(30),
  description: z.string().max(300).nullish(),
});
export type CreateCategoryBody = z.infer<typeof createCategoryBody>;
