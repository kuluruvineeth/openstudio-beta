import { Globe02Icon } from '@hugeicons/react';
import Image from 'next/image';
import { type FC, useState } from 'react';

export type TSeachFavicon = {
  link: string;
};

export const SearchFavicon: FC<TSeachFavicon> = ({ link }) => {
  const [error, setError] = useState<boolean>(false);
  if (error) {
    return (
      <Globe02Icon size={14} strokeWidth={1.5} className="text-gray-500" />
    );
  }
  return (
    <Image
      src={`https://www.google.com/s2/favicons?domain=${link}&sz=${256}`}
      alt="favicon"
      onError={(e) => {
        setError(true);
      }}
      width={0}
      height={0}
      className="h-4 w-4 rounded-sm object-cover"
      sizes="70vw"
    />
  );
};
