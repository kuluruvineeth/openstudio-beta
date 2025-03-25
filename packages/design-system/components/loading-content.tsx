import type React from 'react';
import { ErrorDisplay } from './error-display';
import { Loading } from './loading';

interface LoadingContentProps {
  loading: boolean;
  loadingComponent?: React.ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error?: { info?: { error: string }; error?: string } | any;
  errorComponent?: React.ReactNode;
  children: React.ReactNode;
}

export function LoadingContent(props: LoadingContentProps) {
  if (props.error) {
    return props.errorComponent ? (
      <>{props.errorComponent}</>
    ) : (
      <div className="mt-4">
        <ErrorDisplay error={props.error} />
      </div>
    );
  }

  // biome-ignore lint/style/useBlockStatements: <explanation>
  if (props.loading) return <>{props.loadingComponent || <Loading />}</>;

  return <>{props.children}</>;
}
