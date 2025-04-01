import { getResumeDashboardData } from '@/actions/resume';
import type {
  SortDirection,
  SortOption,
} from '@/app/(organization)/resume/components/resume/management/resume-sort-controls';
import { ResumeSortControls } from '@/app/(organization)/resume/components/resume/management/resume-sort-controls';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { cn } from '@repo/design-system/lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';
import { MiniResumePreview } from '../components/resume/shared/mini-resume-preview';

const RESUMES_PER_PAGE = 12;

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function ResumesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const { baseResumes, tailoredResumes } = await getResumeDashboardData();

  // Combine and sort resumes
  const allResumes = [...baseResumes, ...tailoredResumes];
  const currentPage = Number(params.page) || 1;
  const sort = (params.sort as SortOption) || 'createdAt';
  const direction = (params.direction as SortDirection) || 'desc';

  // Sort resumes
  const sortedResumes = allResumes.sort((a, b) => {
    const modifier = direction === 'asc' ? 1 : -1;
    switch (sort) {
      case 'name':
        return modifier * a.name.localeCompare(b.name);
      case 'jobTitle':
        return (
          modifier * (a.targetRole?.localeCompare(b.targetRole || '') || 0)
        );
      default:
        return (
          modifier *
          (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
    }
  });

  // Paginate resumes
  const totalPages = Math.ceil(sortedResumes.length / RESUMES_PER_PAGE);
  const paginatedResumes = sortedResumes.slice(
    (currentPage - 1) * RESUMES_PER_PAGE,
    currentPage * RESUMES_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-sky-50/50 to-violet-50/50">
      <div className="container mx-auto max-w-7xl space-y-8 p-6">
        {/* Header with controls */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-semibold text-3xl text-transparent tracking-tight">
              My Resumes
            </h1>
            <p className="text-muted-foreground">
              Manage all your resumes in one place
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Suspense>
              <ResumeSortControls />
            </Suspense>
            <Link
              href="/resumes/new"
              className={cn(
                'inline-flex items-center justify-center',
                'rounded-full font-medium text-sm',
                'transition-all duration-500',
                'bg-gradient-to-r from-purple-600 to-pink-600',
                'text-white hover:shadow-lg hover:shadow-purple-500/25',
                'hover:-translate-y-0.5',
                'h-10 px-6'
              )}
            >
              Create Resume
            </Link>
          </div>
        </div>

        {/* Resumes Grid */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-200/50 bg-white/40 shadow-xl backdrop-blur-xl">
          <Suspense fallback={<ResumesLoadingSkeleton />}>
            <div className="grid grid-cols-2 gap-6 p-6 md:grid-cols-3 lg:grid-cols-4">
              {paginatedResumes.map((resume) => (
                <Link href={`/resume/resumes/${resume.id}`} key={resume.id}>
                  <MiniResumePreview
                    name={resume.name}
                    type={resume.isBaseResume ? 'base' : 'tailored'}
                    targetRole={resume.targetRole || undefined}
                    updatedAt={resume.updatedAt.toISOString()}
                    className="hover:-translate-y-1 transition-transform duration-300"
                  />
                </Link>
              ))}
            </div>
          </Suspense>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Link
                key={i}
                href={`?page=${i + 1}&sort=${sort}&direction=${direction}`}
                className={cn(
                  'rounded-lg px-4 py-2 transition-colors',
                  currentPage === i + 1
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/40 hover:bg-white/60'
                )}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResumesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 p-6 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton
          key={i}
          className="aspect-[8.5/11] w-full rounded-lg bg-gradient-to-r from-gray-200/50 to-gray-100/50"
        />
      ))}
    </div>
  );
}
