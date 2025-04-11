'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  IoChatboxOutline,
  IoMicOutline,
  IoMusicalNotesOutline,
  IoPinOutline,
} from 'react-icons/io5';

export default function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const isExpanded = isMobile || isPinned || isHovered;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setShowAccountMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`${isExpanded ? 'w-64' : 'w-16'} flex h-full flex-col border-gray-200 border-r bg-white px-3 py-4 transition-all duration-300`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      gray-200r
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <h1 className={`font-bold text-xl ${!isExpanded && 'hidden'}`}>
          OpenStudio Voice
        </h1>
        {!isMobile && (
          // biome-ignore lint/a11y/useButtonType: <explanation>
          <button
            onClick={() => setIsPinned(!isPinned)}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-gray-100"
            title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center transition-all ${isPinned ? 'rounded-lg bg-gray-200' : 'text-gray-500'}`}
            >
              {isExpanded ? (
                <IoPinOutline className="h-5 w-5" />
              ) : (
                <div className="flex h-fit w-fit items-center justify-center rounded-lg bg-white px-3 py-2 shadow">
                  <span className="font-bold text-black text-md">OS</span>
                </div>
              )}
            </div>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex flex-1 flex-col">
        <SectionHeader isExpanded={isExpanded}>Playground</SectionHeader>
        <SidebarButton
          icon={<IoChatboxOutline />}
          isExpanded={isExpanded}
          isActive={pathname.includes('/app/speech-synthesis/text-to-speech')}
          href="/voice/text-to-speech"
        >
          Text to Speech
        </SidebarButton>
        <SidebarButton
          icon={<IoMicOutline />}
          isExpanded={isExpanded}
          isActive={pathname.includes('/app/speech-synthesis/speech-to-speech')}
          href="/voice/speech-to-speech"
        >
          Voice Changer
        </SidebarButton>
        <SidebarButton
          icon={<IoMusicalNotesOutline />}
          isExpanded={isExpanded}
          isActive={pathname.includes('/app/sound-effects')}
          href="/voice/sound-effects/generate"
        >
          Sound Effects
        </SidebarButton>
      </nav>
    </div>
  );
}

function SectionHeader({
  children,
  isExpanded,
}: {
  children: ReactNode;
  isExpanded: boolean;
}) {
  return (
    <div className="mt-4 mb-2 h-6 pl-4">
      <span
        className={`text-gray-500 text-sm transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
      >
        {children}
      </span>
    </div>
  );
}

function SidebarButton({
  icon,
  children,
  isExpanded,
  isActive,
  href,
}: {
  icon: ReactNode;
  children: ReactNode;
  isExpanded: boolean;
  isActive: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center rounded-lg px-2.5 py-2 text-sm transition-colors ${isActive ? 'bg-gray-100 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
    >
      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
        {icon}
      </div>
      <div
        className={`ml-3 overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}
        style={{ whiteSpace: 'nowrap' }}
      >
        {children}
      </div>
    </Link>
  );
}
