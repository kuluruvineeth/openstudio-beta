'use client';
//TODO: add this later
// import { parseError } from '@repo/lib/parse-error';
import { toast } from './toast';

export const handleError = (error: unknown): void => {
  //   const message = parseError(error);

  toast.error('An error occurred');
};
