export type ActionError<E extends object = Record<string, unknown>> = {
  error: string;
} & E;
export type ServerActionResponse<
  T,
  E extends object = Record<string, unknown>,
> = ActionError<E> | T;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function isActionError(error: any): error is ActionError {
  return error && typeof error === 'object' && 'error' in error && error.error;
}
