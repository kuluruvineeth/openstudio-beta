import { currentUser } from '@repo/backend/auth/utils';
import type { Metadata } from 'next';
import { AppTabs } from './components/app-tabs';
import { Greeting } from './components/greeting';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Open Studio - AI Ecosystem',
  description:
    "Explore Open Studio's ecosystem of AI-powered tools for creators, developers, and professionals.",
};

const Home = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 md:px-6">
      {/* Gradient Background */}
      <div className="-z-10 fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-sky-50/50 to-violet-50/50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]" />
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-float-slow rounded-full bg-gradient-to-br from-teal-200/20 to-cyan-200/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-float-slower rounded-full bg-gradient-to-br from-purple-200/20 to-indigo-200/20 blur-3xl" />
      </div>
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <Greeting firstName={user.user_metadata?.first_name} />
        <h2 className="mt-2 text-2xl text-gray-700">Welcome to Open Studio</h2>
        <p className="mt-4 text-gray-600">
          Open Studio is an open-source ecosystem of verticalized AI agents,
          designed to empower individuals and teams with AI-driven tools for
          seamless building, creativity, and communication.
        </p>
      </div>

      <AppTabs />
    </div>
  );
};

export default Home;
