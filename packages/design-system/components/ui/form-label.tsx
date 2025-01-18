import {Flex} from "@repo/design-system/components/ui/flex";
import {cn} from "@repo/design-system/lib/utils";
import { Type } from "@repo/design-system/components/ui/text";

export type TFormLabel = {
  children?: React.ReactNode;
  className?: string;
  link?: string;
  linkText?: string;
  label: string;
  extra?: () => React.ReactNode;
  isOptional?: boolean;
};

export const FormLabel = ({
  children,
  label,
  extra,
  isOptional,
  className,
  link,
  linkText,
}: TFormLabel) => {
  return (
     <Flex
      direction="col"
      gap="none"
      items="start"
      className={cn("w-full", className)}
    >
      <Flex items="center" gap="sm" className="w-full">
         <Flex items="center" gap="xs">
          <Type size="sm" weight="medium">
            {label}
          </Type>
          {isOptional && (
            <Type size="xs" textColor="secondary">
              (Optional)
            </Type>
          )}
        </Flex>
         {link && (
          <a
            href={link}
            target="_blank"
            className="py-0.5 text-sm font-medium text-violet-500 underline decoration-zinc-500/20 underline-offset-4 hover:opacity-90"
          >
            {linkText}
          </a>
        )}
        {extra && extra()}
      </Flex>
      {children && (
        <Type size="xs" textColor="secondary">
          {children}
        </Type>
      )}
    </Flex>
  );
};