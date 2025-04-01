import { countResumes, getResumeDashboardData } from '@/actions/resume';
import { ProfileRow } from '@/app/(organization)/resume/components/profile-row';
import type {
  SortDirection,
  SortOption,
} from '@/app/(organization)/resume/components/resume/management/resume-sort-controls';
import { ResumesSection } from '@/app/(organization)/resume/components/resume/resumes-section';
import { WelcomeDialog } from '@/app/(organization)/resume/components/welcome-dialog';
import { getGreeting } from '@/lib/utils';
import type { Profile, Resume } from '@/types';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Open Studio | Resume',
  description: 'Open Studio | Resume',
};

export default async function ResumePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const data = await getResumeDashboardData();

  const {
    profile,
    baseResumes: unsortedBaseResumes,
    tailoredResumes: unsortedTailoredResumes,
  } = data;

  // Get sort parameters for both sections
  const baseSort = (params.baseSort as SortOption) || 'createdAt';
  const baseDirection = (params.baseDirection as SortDirection) || 'asc';
  const tailoredSort = (params.tailoredSort as SortOption) || 'createdAt';
  const tailoredDirection =
    (params.tailoredDirection as SortDirection) || 'asc';

  // Sort function
  function sortResumes(
    resumes: Resume[],
    sort: SortOption,
    direction: SortDirection
  ) {
    return [...resumes].sort((a, b) => {
      const modifier = direction === 'asc' ? 1 : -1;
      switch (sort) {
        case 'name':
          return modifier * a.name.localeCompare(b.name);
        case 'jobTitle':
          return (
            modifier *
            ((a.targetRole || '').localeCompare(b.targetRole || '') || 0)
          );
        default:
          return (
            modifier *
            (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          );
      }
    });
  }

  // Sort both resume lists
  const baseResumes = sortResumes(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    unsortedBaseResumes as any,
    baseSort,
    baseDirection
  );
  const tailoredResumes = sortResumes(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    unsortedTailoredResumes as any,
    tailoredSort,
    tailoredDirection
  );

  // Count resumes for base and tailored sections
  const baseResumesCount = await countResumes('base');
  const tailoredResumesCount = await countResumes('tailored');

  const canCreateBase = baseResumesCount < 10;
  const canCreateTailored = tailoredResumesCount < 10;

  return (
    <main className="relative min-h-screen pb-40 sm:pb-12">
      <WelcomeDialog isOpen={true} />
      {/* Gradient Background */}
      <div className="-z-10 fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-sky-50/50 to-violet-50/50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]" />
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-float-slow rounded-full bg-gradient-to-br from-teal-200/20 to-cyan-200/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-float-slower rounded-full bg-gradient-to-br from-purple-200/20 to-indigo-200/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Profile Row Component */}
        <ProfileRow profile={profile as Profile} />
        <div className="sm:max-none mx-auto max-w-7xl pt-4 pl-2 sm:container sm:px-6 sm:pl-0 md:px-8 lg:px-8 ">
          {/* Profile Overview */}
          <div className="mb-6 space-y-4">
            {/* Greeting & Edit Button */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text font-semibold text-2xl text-transparent">
                  {getGreeting()}, {profile.firstName}
                </h1>
                <p className="mt-0.5 text-muted-foreground text-sm">
                  Welcome to your open studio resume
                </p>
              </div>
            </div>

            {/* Resume Bookshelf */}
            <div className="">
              {/* Base Resumes Section */}
              <ResumesSection
                type="base"
                resumes={baseResumes}
                profile={profile as Profile}
                sortParam="baseSort"
                directionParam="baseDirection"
                currentSort={baseSort}
                currentDirection={baseDirection}
                canCreateMore={canCreateBase}
              />

              {/* Thin Divider */}
              <div className="relative py-2">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent" />
              </div>

              {/* Tailored Resumes Section */}
              <ResumesSection
                type="tailored"
                resumes={tailoredResumes}
                profile={profile as Profile}
                sortParam="tailoredSort"
                directionParam="tailoredDirection"
                currentSort={tailoredSort}
                currentDirection={tailoredDirection}
                baseResumes={baseResumes}
                canCreateMore={canCreateTailored}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
