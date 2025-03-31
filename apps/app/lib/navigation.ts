import {
  type ActivityIcon,
  ClapperboardIcon,
  CogIcon,
  FileIcon,
  HomeIcon,
  MessageCircleCodeIcon,
  MessageCircleIcon,
  MicVocalIcon,
  SparklesIcon,
  UserIcon,
  VideoIcon,
  WandSparkles,
} from 'lucide-react';

export type SidebarPage = {
  readonly icon: typeof ActivityIcon;
  readonly label: string;
  readonly href: string;
  readonly active: (pathname: string) => boolean;
  readonly items?: Omit<SidebarPage, 'items' | 'icon'>[];
  readonly badge?: string;
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
  label: 'ChatHub',
  href: '/chat',
  active: (pathname) => pathname === '/chat',
  badge: 'Free',
};

export const chatv2: SidebarPage = {
  icon: MessageCircleCodeIcon,
  label: 'Artifacts',
  href: '/artifacts',
  active: (pathname) => pathname === '/artifacts',
  badge: 'Pro (WIP)',
};

export const settings: SidebarPage = {
  icon: CogIcon,
  label: 'Settings',
  href: '/settings',
  active: (pathname) => pathname.startsWith('/settings'),
};

export const tube: SidebarPage = {
  icon: VideoIcon,
  label: 'Tube',
  href: '/tube/studio',
  active: (pathname) => pathname === '/tube/studio',
  badge: 'Pro (WIP)',
};

export const tubeStudio: SidebarPage = {
  icon: ClapperboardIcon,
  label: 'Tube Studio',
  href: '/tube/studio',
  active: (pathname) => pathname === '/tube/studio',
};

export const tubeAIAutomation: SidebarPage = {
  icon: SparklesIcon,
  label: 'AI Automation',
  href: '/tube/automation',
  active: (pathname) => pathname === '/tube/automation',
};

export const youtubeComments: SidebarPage = {
  icon: MessageCircleIcon,
  label: 'Youtube Comments',
  href: '/tube/comments',
  active: (pathname) => pathname === '/tube/comments',
};

export const smartCategorization: SidebarPage = {
  icon: WandSparkles,
  label: 'Smart Categorization',
  href: '/tube/smart-categorization',
  active: (pathname) => pathname === '/tube/smart-categorization',
};

export const voice: SidebarPage = {
  icon: MicVocalIcon,
  label: 'Voice',
  href: '/voice',
  active: (pathname) => pathname === '/voice',
  badge: 'Pro (WIP)',
};

export const resume: SidebarPage = {
  icon: FileIcon,
  label: 'Resume',
  href: '/resume',
  active: (pathname) => pathname === '/resume',
  badge: 'Free',
};
