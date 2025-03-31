import { WorkInProgress } from '@repo/design-system/components/ui/work-in-progress';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open Studio Minime',
  description: 'Minime - A Simple way to present yourself.',
};

export default async function MinimeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const user = await currentUser();
  // return (
  //   <div className="mx-auto flex min-h-screen w-[700px] flex-col pb-10 max-md:w-full max-md:px-4">
  //     <header className="w-full py-4">
  //       <AppNav links={appConfig.mainNav} user={user} />
  //     </header>
  //     <main className="w-full">{children}</main>
  //     <AppCommand user={user!} />
  //   </div>
  // );
  return <WorkInProgress />;
}
