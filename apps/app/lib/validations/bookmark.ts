import { validDomainRegex } from '@/helper/utils';
import { URLRegex } from '@repo/design-system/lib/utils';
import * as z from 'zod';

export const collectionSchema = z.object({
  name: z.string().min(1).max(20),
});

export const bookmarkSchema = z.object({
  title: z.string().min(1).max(30),
  url: z.string().url(),
  collection: z.string().min(1).nullable().optional(),
});

export const bookmarkFormSchema = z.object({
  title: z.string().min(1).max(30),
  domain: z
    .string()
    .refine(
      (value) => validDomainRegex.test(value) || URLRegex.test(value),
      'Enter valid domain or URL'
    ),
  collection: z.string().min(1).nullable().optional(),
});
