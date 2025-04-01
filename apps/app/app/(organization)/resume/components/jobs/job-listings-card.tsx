'use client';

import { deleteJob, getJobListings } from '@/actions/job';
import {} from '@repo/design-system/components/ui/select';
import { WorkInProgress } from '@repo/design-system/components/ui/work-in-progress';
import {} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

type WorkLocationType = 'remote' | 'in_person' | 'hybrid';
type EmploymentType = 'full_time' | 'part_time' | 'co_op' | 'internship';

interface Job {
  id: string;
  companyName: string | null;
  positionTitle: string | null;
  location: string | null;
  workLocation: string | null;
  employmentType: string | null;
  salaryRange: string | null;
  createdAt: Date;
  keywords: string[] | null;
}

export function JobListingsCard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [workLocation, setWorkLocation] = useState<
    WorkLocationType | undefined
  >();
  const [employmentType, setEmploymentType] = useState<
    EmploymentType | undefined
  >();

  // Fetch admin status
  //   useEffect(() => {
  //     async function checkAdminStatus() {
  //       const supabase = createClient();
  //       const {
  //         data: { user },
  //       } = await supabase.auth.getUser();

  //       if (user) {
  //         const { data: profile } = await supabase
  //           .from('profiles')
  //           .select('is_admin')
  //           .eq('user_id', user.id)
  //           .single();

  //         setIsAdmin(profile?.is_admin ?? false);
  //       }
  //     }

  //     checkAdminStatus();
  //   }, []);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getJobListings({
        page: currentPage,
        pageSize: 6,
        filters: {
          workLocation,
          employmentType,
        },
      });
      setJobs(
        result.jobs.map((job) => ({
          ...job,
          createdAt: job.createdAt,
        }))
      );
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, workLocation, employmentType]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const formatWorkLocation = (workLocation: Job['workLocation']) => {
    if (!workLocation) return 'Not specified';
    return workLocation.replace('_', ' ');
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      // Refetch jobs after deletion
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return <WorkInProgress />;

  //TODO: Remove this one once feature is completed
  //   return (
  //     <div className="relative">
  //       {/* Decorative background elements */}
  //       <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-50/30 via-teal-50/20 to-rose-50/30" />
  //       <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

  //       <Card className="relative overflow-hidden rounded-3xl border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-2xl">
  //         <div className="-translate-y-1/2 absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-gradient-to-br from-teal-400/10 via-purple-400/10 to-pink-400/10 blur-3xl" />
  //         <div className="-translate-x-1/2 absolute bottom-0 left-0 h-[500px] w-[500px] translate-y-1/2 rounded-full bg-gradient-to-tr from-rose-400/10 via-violet-400/10 to-cyan-400/10 blur-3xl" />

  //         <div className="relative flex flex-col space-y-8">
  //           <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
  //             <motion.h2
  //               initial={{ opacity: 0, y: 20 }}
  //               animate={{ opacity: 1, y: 0 }}
  //               className="bg-gradient-to-r from-teal-600 via-purple-600 to-rose-600 bg-clip-text font-bold text-4xl text-transparent"
  //             >
  //               Job Listings
  //             </motion.h2>

  //             <motion.div
  //               initial={{ opacity: 0, y: 20 }}
  //               animate={{ opacity: 1, y: 0 }}
  //               transition={{ delay: 0.2 }}
  //               className="flex flex-col gap-4 sm:flex-row"
  //             >
  //               <div className="group relative">
  //                 <Select
  //                   value={workLocation}
  //                   onValueChange={(value: WorkLocationType) =>
  //                     setWorkLocation(value)
  //                   }
  //                 >
  //                   <SelectTrigger className="w-full border-white/40 bg-white/80 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-teal-200 hover:shadow-xl sm:w-[180px]">
  //                     <MapPin className="mr-2 h-4 w-4 text-teal-500" />
  //                     <SelectValue placeholder="Work Location" />
  //                   </SelectTrigger>
  //                   <SelectContent className="border-white/40 bg-white/90 backdrop-blur-xl">
  //                     <SelectItem value="remote">🌍 Remote</SelectItem>
  //                     <SelectItem value="in_person">🏢 In Person</SelectItem>
  //                     <SelectItem value="hybrid">🔄 Hybrid</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //                 <div className="-z-10 absolute inset-0 bg-gradient-to-r from-teal-500/20 to-purple-500/20 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
  //               </div>

  //               <div className="group relative">
  //                 <Select
  //                   value={employmentType}
  //                   onValueChange={(value: EmploymentType) =>
  //                     setEmploymentType(value)
  //                   }
  //                 >
  //                   <SelectTrigger className="w-full border-white/40 bg-white/80 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-purple-200 hover:shadow-xl sm:w-[180px]">
  //                     <Briefcase className="mr-2 h-4 w-4 text-purple-500" />
  //                     <SelectValue placeholder="Job Type" />
  //                   </SelectTrigger>
  //                   <SelectContent className="border-white/40 bg-white/90 backdrop-blur-xl">
  //                     <SelectItem value="full_time">⭐ Full Time</SelectItem>
  //                     <SelectItem value="part_time">⌛ Part Time</SelectItem>
  //                     <SelectItem value="co_op">🤝 Co-op</SelectItem>
  //                     <SelectItem value="internship">🎓 Internship</SelectItem>
  //                   </SelectContent>
  //                 </Select>
  //                 <div className="-z-10 absolute inset-0 bg-gradient-to-r from-purple-500/20 to-rose-500/20 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
  //               </div>
  //             </motion.div>
  //           </div>

  //           <motion.div
  //             initial={{ opacity: 0 }}
  //             animate={{ opacity: 1 }}
  //             transition={{ delay: 0.4 }}
  //             className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
  //           >
  //             {isLoading
  //               ? Array(6)
  //                   .fill(0)
  //                   .map((_, i) => (
  //                     <motion.div
  //                       key={i}
  //                       initial={{ opacity: 0, y: 20 }}
  //                       animate={{ opacity: 1, y: 0 }}
  //                       transition={{ delay: i * 0.1 }}
  //                     >
  //                       <Card className="animate-pulse space-y-4 rounded-2xl border-white/20 bg-white/40 p-6">
  //                         <div className="h-6 w-3/4 rounded-full bg-gradient-to-r from-gray-200/50 to-gray-100/50" />
  //                         <div className="h-4 w-1/2 rounded-full bg-gradient-to-r from-gray-200/50 to-gray-100/50" />
  //                         <div className="h-4 w-2/3 rounded-full bg-gradient-to-r from-gray-200/50 to-gray-100/50" />
  //                       </Card>
  //                     </motion.div>
  //                   ))
  //               : jobs.map((job, idx) => (
  //                   <motion.div
  //                     key={job.id}
  //                     initial={{ opacity: 0, y: 20 }}
  //                     animate={{ opacity: 1, y: 0 }}
  //                     transition={{ delay: idx * 0.1 }}
  //                   >
  //                     <Card className="group hover:-translate-y-1 relative space-y-5 overflow-hidden rounded-2xl border-white/40 bg-gradient-to-br from-white/80 to-white/60 p-6 transition-all duration-500 ease-out hover:border-white/60 hover:from-white/90 hover:to-white/70 hover:shadow-2xl">
  //                       <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-purple-500/5 to-rose-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

  //                       <div className="flex items-start justify-between">
  //                         <div className="space-y-2.5">
  //                           <h3 className="line-clamp-1 font-semibold text-gray-800 text-lg transition-colors duration-300 group-hover:text-teal-700">
  //                             {job.positionTitle}
  //                           </h3>
  //                           <div className="flex items-center text-gray-600">
  //                             <Building2 className="mr-2 h-4 w-4 text-purple-500" />
  //                             <span className="line-clamp-1 transition-colors duration-300 group-hover:text-purple-700">
  //                               {job.companyName}
  //                             </span>
  //                           </div>
  //                         </div>
  //                         {isAdmin && (
  //                           <Button
  //                             variant="ghost"
  //                             size="icon"
  //                             className="text-gray-400 transition-all duration-300 hover:bg-red-50/50 hover:text-red-500"
  //                             onClick={() => handleDeleteJob(job.id)}
  //                           >
  //                             <Trash2 className="h-4 w-4" />
  //                           </Button>
  //                         )}
  //                       </div>

  //                       <div className="space-y-3 text-gray-600 text-sm">
  //                         <div className="flex items-center gap-2 transition-colors duration-300 group-hover:text-teal-600">
  //                           <MapPin className="h-4 w-4" />
  //                           <span>
  //                             {job.location || 'Location not specified'}
  //                           </span>
  //                         </div>
  //                         <div className="flex items-center gap-2 transition-colors duration-300 group-hover:text-purple-600">
  //                           <Briefcase className="h-4 w-4" />
  //                           <span className="capitalize">
  //                             {formatWorkLocation(job.workLocation)}
  //                           </span>
  //                         </div>
  //                         <div className="flex items-center gap-2 transition-colors duration-300 group-hover:text-rose-600">
  //                           <DollarSign className="h-4 w-4" />
  //                           <span>{job.salaryRange}</span>
  //                         </div>
  //                         <div className="flex items-center gap-2 transition-colors duration-300 group-hover:text-teal-600">
  //                           <Clock className="h-4 w-4" />
  //                           <span>{formatDate(job.createdAt.toISOString())}</span>
  //                         </div>
  //                       </div>

  //                       <div className="flex flex-wrap gap-2 pt-2">
  //                         {job.keywords?.slice(0, 3).map((keyword, index) => (
  //                           <Badge
  //                             key={index}
  //                             variant="secondary"
  //                             className="border border-teal-100/20 bg-gradient-to-r from-teal-50/50 to-purple-50/50 text-teal-700 text-xs transition-all duration-300 hover:from-teal-100/50 hover:to-purple-100/50"
  //                           >
  //                             {keyword}
  //                           </Badge>
  //                         ))}
  //                         {job.keywords && job.keywords.length > 3 && (
  //                           <Badge
  //                             variant="secondary"
  //                             className="border border-purple-100/20 bg-gradient-to-r from-purple-50/50 to-rose-50/50 text-purple-700 text-xs transition-all duration-300 hover:from-purple-100/50 hover:to-rose-100/50"
  //                           >
  //                             +{job.keywords.length - 3} more
  //                           </Badge>
  //                         )}
  //                       </div>
  //                     </Card>
  //                   </motion.div>
  //                 ))}
  //           </motion.div>

  //           <motion.div
  //             initial={{ opacity: 0 }}
  //             animate={{ opacity: 1 }}
  //             transition={{ delay: 0.6 }}
  //             className="mt-6 flex justify-center gap-4"
  //           >
  //             <Button
  //               variant="outline"
  //               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
  //               disabled={currentPage === 1 || isLoading}
  //               className="border-white/40 bg-white/70 px-6 transition-all duration-300 hover:border-teal-200 hover:bg-white/80 disabled:opacity-50"
  //             >
  //               Previous
  //             </Button>
  //             <Button
  //               variant="outline"
  //               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
  //               disabled={currentPage === totalPages || isLoading}
  //               className="border-white/40 bg-white/70 px-6 transition-all duration-300 hover:border-purple-200 hover:bg-white/80 disabled:opacity-50"
  //             >
  //               Next
  //             </Button>
  //           </motion.div>
  //         </div>
  //       </Card>
  //     </div>
  //   );
}
