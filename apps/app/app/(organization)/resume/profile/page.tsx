import { getResumeDashboardData } from '@/actions/resume';
import { ProfileEditForm } from '@/app/(organization)/resume/components/profile/profile-edit-form';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
// Force dynamic behavior and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditProfilePage() {
  // Fetch profile data and handle authentication
  const { profile } = await getResumeDashboardData();

  // Display a friendly message if no profile exists
  if (!profile) {
    redirect('/');
  }

  return (
    <main className="relative min-h-screen">
      {/* Background Layer */}
      <div className="-z-10 fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-sky-50/50 to-violet-50/50" />
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] animate-float rounded-full bg-gradient-to-r from-pink-200/20 to-violet-200/20 blur-3xl" />
        <div className="absolute right-1/3 bottom-1/4 h-[400px] w-[400px] animate-float-delayed rounded-full bg-gradient-to-r from-blue-200/20 to-teal-200/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10">
        <Suspense fallback={<div>Loading...</div>}>
          <ProfileEditForm profile={profile} />
        </Suspense>
      </div>
    </main>
  );
}
