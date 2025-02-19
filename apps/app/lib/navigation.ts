import {
  type ActivityIcon,
  CogIcon,
  HomeIcon,
  MessageCircleCodeIcon,
  MessageCircleIcon,
  UserIcon,
} from 'lucide-react';

export type SidebarPage = {
  readonly icon: typeof ActivityIcon;
  readonly label: string;
  readonly href: string;
  readonly active: (pathname: string) => boolean;
  readonly items?: Omit<SidebarPage, 'items' | 'icon'>[];
};

export const home: SidebarPage = {
  icon: HomeIcon,
  label: 'Home',
  href: '/',
  active: (pathname) => pathname === '/',
};

export const minime: SidebarPage = {
  icon: UserIcon,
  label: 'Minime',
  href: '/minime',
  active: (pathname) => pathname === '/minime',
};

export const chat: SidebarPage = {
  icon: MessageCircleIcon,
  label: 'ChatHub Deprecated',
  href: '/chat',
  active: (pathname) => pathname === '/chat',
};

export const chatv2: SidebarPage = {
  icon: MessageCircleCodeIcon,
  label: 'ChatHub v2',
  href: '/chatv2',
  active: (pathname) => pathname === '/chatv2',
};

export const settings: SidebarPage = {
  icon: CogIcon,
  label: 'Settings',
  href: '/settings',
  active: (pathname) => pathname.startsWith('/settings'),
};
