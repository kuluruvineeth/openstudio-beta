import { Spinner } from '@repo/design-system/components/ui/loading-spinner';
import { Type } from '@repo/design-system/components/ui/text';

export type FullPageLoaderProps = {
  label?: string;
};

export const FullPageLoader = ({ label }: FullPageLoaderProps) => {
  return (
    <div className="z-20 flex min-h-[90vh] w-full flex-1 flex-col items-center justify-center gap-1">
      <Spinner />
       {label && (
        <Type size="xs" textColor="secondary">
          {label}
        </Type>
      )}
    </div>
  );
};