import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import { type VariantProps, cn, cva } from '@repo/design-system/lib/utils';

const avatarVariants = cva('', {
  variants: {
    size: {
      default: 'h-9 w-9',
      xs: 'h-4 w-4',
      sm: 'h-6 w-6',
      lg: 'h-10 w-10',
      xl: 'h-[160px] w-[160px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
  imageUrl: string;
  name: string;
  className?: string;
  onClick?: () => void;
}

export const UserAvatar = ({
  imageUrl,
  name,
  size,
  className,
  onClick,
}: UserAvatarProps) => {
  return (
    <Avatar
      className={cn(avatarVariants({ size, className }))}
      onClick={onClick}
    >
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      <AvatarImage src={imageUrl} alt={name} />
    </Avatar>
  );
};
