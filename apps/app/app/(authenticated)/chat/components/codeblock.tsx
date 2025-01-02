import { useClipboard } from '@/app/hooks/use-clipboard';
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import hljs from 'highlight.js';
import { useEffect, useRef } from 'react';

export type codeBlockProps = {
  lang?: string;
  code?: string;
};

export const CodeBlock = ({ lang, code }: codeBlockProps) => {
  const ref = useRef<HTMLElement>(null);
  const { copiedText, copy, showCopied } = useClipboard();
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  useEffect(() => {
    if (ref?.current && code) {
      const highlightedCode = hljs.highlight(language, code).value;
      ref.current.innerHTML = highlightedCode;
    }
  }, [code, language]);
  return (
    <div className="w-full flex-shrink-0 rounded-2xl bg-black/20 p-4">
      <div className="flex w-full items-center justify-between pl-2">
        <p className="text-xs">{language}</p>
        <Tooltip>
          <TooltipTrigger>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                code && copy(code);
              }}
            >
              {showCopied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent collisionPadding={4}>
            {showCopied ? 'copied' : 'copy'}
          </TooltipContent>
        </Tooltip>
      </div>
      <pre className="w-full">
        <code
          className={`hljs language-${language} inline-block w-full overflow-x-auto whitespace-pre-wrap break-words pr-[100%] text-sm`}
          ref={ref}
        ></code>
      </pre>
    </div>
  );
};
