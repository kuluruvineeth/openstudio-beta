import type { Metadata } from 'next';
import { JobListingsCard } from '../components/jobs/job-listings-card';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Open Studio | Jobs',
  description: 'Open Studio | Jobs',
};

export default function JobsPage() {
  return <JobListingsCard />;
}
