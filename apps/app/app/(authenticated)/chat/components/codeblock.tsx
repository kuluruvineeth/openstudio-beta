import { useClipboard } from '@/app/hooks/use-clipboard';
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/design-system/components/ui/button';
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
    <div className="bg-black/20 rounded-2xl p-4">
      <div className="pl-2 w-full flex justify-between items-center">
        <p className="text-xs">{language}</p>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            code && copy(code);
          }}
        >
          {showCopied ? <CheckIcon /> : <CopyIcon />}
          {showCopied ? 'copied' : 'copy'}
        </Button>
      </div>
      <pre className=" ">
        <code
          className={`hljs language-${language} whitespace-pre-wrap break-words overflow-x-auto w-full inline-block pr-[100%] text-sm`}
          ref={ref}
        ></code>
      </pre>
    </div>
  );
};
