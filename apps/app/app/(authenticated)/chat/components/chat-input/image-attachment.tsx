import type { TAttachment } from '@/types';
import { Cancel01Icon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import Image from 'next/image';
import type { FC } from 'react';

export type TImageAttachment = {
  attachment?: TAttachment;
  clearAttachment: () => void;
};

export const ImageAttachment: FC<TImageAttachment> = ({
  attachment,
  clearAttachment,
}) => {
  if (!attachment?.base64) return null;
  return (
    <Flex className="pt-2 pr-2 pl-2 md:pl-3" gap="sm">
      <div className="relative h-[60px] min-w-[60px] rounded-lg border border-black/10 shadow-md dark:border-white/10">
        <Image
          src={attachment.base64}
          alt="uploaded image"
          className="h-full w-full overflow-hidden rounded-lg object-cover"
          width={0}
          height={0}
        />
        <Button
          size={'iconXS'}
          variant="default"
          onClick={clearAttachment}
          className="absolute top-[-4px] right-[-4px] z-10 h-4 w-4 flex-shrink-0"
        >
          <Cancel01Icon size={12} strokeWidth={2} />
        </Button>
      </div>
    </Flex>
  );
};
