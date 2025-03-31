'use client';

import type * as navigation from '@/lib/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@repo/design-system/components/ui/sidebar';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
export const SidebarItem = ({
  active,
  href,
  icon: Icon,
  items,
  label,
  badge,
}: navigation.SidebarPage) => {
  const pathname = usePathname();

  return (
    <Collapsible asChild defaultOpen>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className={
            !items?.length && active(pathname) ? 'bg-sidebar-accent' : ''
          }
        >
          {items?.length ? (
            <div className="flex items-center gap-2">
              <Icon className="opacity-70" />
              <span>{label}</span>
              {badge && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    background:
                      badge === 'Free'
                        ? 'linear-gradient(to right, #22c55e, #10b981, #059669)' // green gradients
                        : 'linear-gradient(to right, #ef4444, #f97316, #f59e0b)', // red to orange gradients
                    color: badge === 'Free' ? 'white' : '#334155',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {badge}
                </motion.span>
              )}
            </div>
          ) : (
            <a href={href} className="flex items-center gap-2">
              <Icon className="opacity-70" />
              <span>{label}</span>
              {badge && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    background:
                      badge === 'Free'
                        ? 'linear-gradient(to right, #22c55e, #10b981, #059669)' // green gradients
                        : 'linear-gradient(to right, #ef4444, #f97316, #f59e0b)', // red to orange gradients
                    color: badge === 'Free' ? 'white' : '#334155',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {badge}
                </motion.span>
              )}
            </a>
          )}
        </SidebarMenuButton>
        {items?.length ? (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRight size={16} className="opacity-70" />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.label}>
                    <SidebarMenuSubButton
                      asChild
                      className={
                        subItem.active(pathname)
                          ? 'bg-primary text-primary-foreground'
                          : ''
                      }
                    >
                      <a href={subItem.href}>
                        <span>{subItem.label}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  );
};
