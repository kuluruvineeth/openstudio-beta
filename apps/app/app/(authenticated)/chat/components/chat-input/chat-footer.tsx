import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';

export const ChatFooter = () => {
  return (
    <Flex
      className="absolute bottom-0 z-10 w-full px-4 py-2"
      justify="center"
      gap="xs"
    >
      <Type size="xxs" textColor="tertiary">
        OpenStudio ChatHub is open source{' '}
      </Type>
      <Type size="xxs" textColor="tertiary">
        project by{' '}
        <a
          href="https://kuluruvineeth.com"
          target="_blank"
          className="ml-1 text-purple-500 underline decoration-zinc-500/20 underline-offset-2"
          rel="noreferrer"
        >
          kuluruvineeth
        </a>
      </Type>
    </Flex>
  );
};
