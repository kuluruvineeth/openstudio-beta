import { WorkInProgress } from '@repo/design-system/components/ui/work-in-progress';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const user = await currentUser();
  // const cookieStore = await cookies();
  // const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';
  // void trpc.user.getPremium.prefetch();
  // return (
  //   <>
  //     <Script
  //       src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
  //       strategy="beforeInteractive"
  //     />
  //     <PreferenceProvider>
  //       <SidebarProvider defaultOpen={!isCollapsed}>
  //         <AppSidebar user={user!} />
  //         <SidebarInset>{children}</SidebarInset>
  //       </SidebarProvider>
  //     </PreferenceProvider>
  //   </>
  return <WorkInProgress />;
}
