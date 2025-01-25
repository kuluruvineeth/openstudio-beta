import { getBlurDataURL } from '@/lib/sharp';
import { cn } from '@repo/design-system/lib/utils';
import '@repo/design-system/styles/prose.css';
import type {
  MDXComponents,
  MDXRemoteOptions,
} from 'next-mdx-remote-client/rsc';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';

const mdxRemoteOptions: MDXRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
};

const mdxComponents: MDXComponents = {
  img: async (props) => {
    const blurDataURL = await getBlurDataURL(undefined, props.src!);
    return (
      <Image
        src={props.src!}
        alt={props.alt!}
        width={0}
        height={0}
        sizes="100vw"
        className="h-auto w-full"
        blurDataURL={blurDataURL}
        placeholder="blur"
        quality={80}
        priority
      />
    );
  },
  a: (props) => {
    return (
      <a target="_blank" {...props}>
        {props.children}
      </a>
    );
  },
};

const ErrorComponent = ({ error }: { error: Error }) => {
  return <MDX source={error.message} />;
};

export default async function MDX({
  source,
  className,
}: {
  source: any;
  className?: string;
}) {
  return (
    <div className={cn('prose dark:prose-invert', className)}>
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={mdxRemoteOptions}
        onError={ErrorComponent}
      />
    </div>
  );
}
