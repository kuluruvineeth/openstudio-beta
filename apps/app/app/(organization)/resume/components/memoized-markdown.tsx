import { marked } from 'marked';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

function parseMarkdownIntoBlocks(markdown: string): string[] {
  // First, normalize newlines to ensure consistent handling
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n');

  // Preserve double spaces at end of lines (markdown line breaks)
  const preservedSpaces = normalizedMarkdown.replace(/(\s\s)$/gm, '  \n');

  // Split the content by double newlines before parsing
  const sections = preservedSpaces.split(/\n\n+/);

  // Parse each section separately to maintain spacing
  const blocks: string[] = [];

  for (const section of sections) {
    if (!section.trim()) {
      continue; // Skip empty sections
    }

    const tokens = marked.lexer(section);
    let currentBlock = '';

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      currentBlock += token.raw;
    }

    if (currentBlock.trim()) {
      blocks.push(currentBlock);
    }
  }

  return blocks;
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <div className="">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            // Ensure lists are properly styled
            ul: ({ children }) => (
              <ul className="mb-0 ml-3 list-disc">{children}</ul>
            ),
            ol: ({ start, children }) => (
              <ol className="mb-0 ml-3 list-decimal" start={start}>
                {children}
              </ol>
            ),
            //@ts-ignore
            li: ({ ordered, index, children }) => (
              <li className="py-2" value={ordered ? index + 1 : undefined}>
                {children}
              </li>
            ),
            // Handle line breaks explicitly
            br: () => <br className="block h-4" />,
            // Proper paragraph styling with spacing
            p: ({ children }) => (
              <p className="mb-2 whitespace-pre-line text-sm">{children}</p>
            ),
            // Proper heading styles
            h1: ({ children }) => (
              <h1 className="mt-4 mb-2 font-bold text-2xl">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="mt-3 mb-1.5 font-bold text-xl">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-2.5 mb-1.5 font-bold text-lg">{children}</h3>
            ),
            h4: ({ children }) => (
              <h4 className="mt-2 mb-1 font-bold text-base">{children}</h4>
            ),
            h5: ({ children }) => (
              <h5 className="mt-1.5 mb-1 font-bold text-sm">{children}</h5>
            ),
            h6: ({ children }) => (
              <h6 className="mt-1 mb-0.5 font-bold text-xs">{children}</h6>
            ),
            // Code block styling
            //@ts-ignore
            code: ({ inline, className, children }) => {
              // If it's an inline code block
              if (inline) {
                return (
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    {children}
                  </code>
                );
              }

              // For code blocks, we return a div wrapper instead of pre directly
              return (
                <div className="not-prose">
                  {/* <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs"> */}
                  <code className={className}>{children}</code>
                  {/* </pre> */}
                </div>
              );
            },
            // Proper blockquote styling
            blockquote: ({ children }) => (
              <blockquote className="border-muted border-l-4 pl-3 text-sm italic">
                {children}
              </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.content === nextProps.content
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
    ));
  }
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';
