'use client';

import { formatProfileWithAI } from '@/actions/ai';
import { importResume, updateResumeProfile } from '@/actions/resume';
import type {
  Education,
  Profile,
  Project,
  Skill,
  WorkExperience,
} from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/design-system/components/ui/alert-dialog';
import { Button } from '@repo/design-system/components/ui/button';
import { Card } from '@repo/design-system/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import {
  Briefcase,
  FolderGit2,
  GraduationCap,
  Linkedin,
  Loader2,
  Save,
  Trash2,
  Upload,
  User,
  Wrench,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ProfileBasicInfoForm } from './profile-basic-info-form';
import { ProfileEducationForm } from './profile-education-form';
import { ProfileProjectsForm } from './profile-projects-form';
import { ProfileWorkExperienceForm } from './profile-work-experience-form';
import { ProfileSkillsForm } from './project-skills-form';
interface ProfileEditFormProps {
  profile: Profile;
}

export function ProfileEditForm({
  profile: initialProfile,
}: ProfileEditFormProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [isTextImportDialogOpen, setIsTextImportDialogOpen] = useState(false);
  const [resumeContent, setResumeContent] = useState('');
  const [textImportContent, setTextImportContent] = useState('');
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const router = useRouter();

  // Sync with server state when initialProfile changes
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateResumeProfile(profile);
      toast.success('Changes saved successfully', {
        position: 'bottom-right',
        className:
          'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none',
      });
      // Force a server revalidation
      router.refresh();
    } catch (error) {
      void error;
      toast.error('Unable to save your changes. Please try again.', {
        position: 'bottom-right',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);

      const resetProfile = {
        id: profile.id,
        firstName: '',
        lastName: '',
        email: '',
        rulesPrompt: '',
        aiProvider: '',
        aiModel: '',
        aiApiKey: '',
        phoneNumber: '',
        location: '',
        websiteUrl: '',
        linkedinUrl: '',
        githubUrl: '',
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
      };

      //@ts-ignore
      setProfile(resetProfile);

      await updateResumeProfile(resetProfile);
      toast.success('Profile reset successfully', {
        position: 'bottom-right',
        className:
          'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none',
      });

      // Force a server revalidation
      router.refresh();
    } catch (error) {
      void error;
      toast.error('Failed to reset profile. Please try again.', {
        position: 'bottom-right',
      });
    } finally {
      setIsResetting(false);
    }
  };
  const updateField = (field: keyof Profile, value: unknown) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // biome-ignore lint/suspicious/useAwait: <explanation>
  const handleResumeUpload = async (content: string) => {
    try {
      setIsProcessingResume(true);
      const result = await formatProfileWithAI(content, profile.email ?? '');

      if (result) {
        // Clean and transform the data to match our database schema
        const cleanedProfile: Partial<Profile> = {
          firstName: result.content.firstName,
          lastName: result.content.lastName,
          email: result.content.email,
          phoneNumber: result.content.phoneNumber,
          location: result.content.location,
          websiteUrl: result.content.websiteUrl,
          linkedinUrl: result.content.linkedinUrl,
          githubUrl: result.content.githubUrl,
          workExperience: Array.isArray(result.content.workExperience)
            ? result.content.workExperience.map(
                (exp: Partial<WorkExperience>) => ({
                  company: exp.company ?? '',
                  position: exp.position ?? '',
                  location: exp.location ?? '',
                  date: exp.date ?? '',
                  description: Array.isArray(exp.description)
                    ? exp.description
                    : [exp.description || ''],
                  technologies: Array.isArray(exp.technologies)
                    ? exp.technologies
                    : [exp.technologies || ''],
                })
              )
            : [],
          education: Array.isArray(result.content.education)
            ? result.content.education.map((edu: Partial<Education>) => ({
                school: edu.school ?? '',
                degree: edu.degree ?? '',
                field: edu.field ?? '',
                location: edu.location ?? '',
                date: edu.date ?? '',
                gpa: edu.gpa
                  ? Number.parseFloat(edu.gpa.toString())
                  : undefined,
                achievements: Array.isArray(edu.achievements)
                  ? edu.achievements
                  : [edu.achievements || ''],
              }))
            : [],
          skills: Array.isArray(result.content.skills)
            ? result.content.skills.map((skill: Partial<Skill>) => ({
                category: skill.category ?? '',
                items: Array.isArray(skill.items)
                  ? skill.items
                  : [skill.items || ''],
              }))
            : [],
          projects: Array.isArray(result.content.projects)
            ? result.content.projects.map((proj: Partial<Project>) => ({
                name: proj.name ?? '',
                description: Array.isArray(proj.description)
                  ? proj.description
                  : [proj.description || ''],
                date: proj.date ?? '',
                technologies: Array.isArray(proj.technologies)
                  ? proj.technologies
                  : [proj.technologies || ''],
                url: proj.url ?? '',
                github_url: proj.github_url ?? '',
              }))
            : [],
        };

        await importResume(cleanedProfile);

        setProfile((prev) => ({
          ...prev,
          ...cleanedProfile,
        }));

        toast.success(
          "Content imported successfully - Don't forget to save your changes",
          {
            position: 'bottom-right',
            className:
              'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none',
          }
        );
        setIsResumeDialogOpen(false);
        setIsTextImportDialogOpen(false);
        setResumeContent('');
        setTextImportContent('');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Resume upload error:', error);
        toast.error(`Failed to process content: ${error.message}`, {
          position: 'bottom-right',
        });
      }
    } finally {
      setIsProcessingResume(false);
    }
  };

  const handleLinkedInImport = () => {
    toast.info('LinkedIn import feature coming soon!', {
      position: 'bottom-right',
      className:
        'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none',
    });
  };
  return (
    <div className="relative mx-auto">
      {/* Action Bar */}
      {/* Action Bar */}
      <div className="z'mx-auto 50 mt-4">
        <div className="mx-auto max-w-[2000px]">
          <div className="mx-6 mb-6">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-lg backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600" />
                <span className="font-medium text-muted-foreground text-sm">
                  Profile Editor
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Reset Profile Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="group relative h-9 border-rose-500/20 bg-white/50 px-4 text-rose-600 shadow-sm transition-all duration-500 hover:border-rose-500/30 hover:bg-white/60 hover:shadow-md"
                      disabled={isResetting}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/5 to-rose-500/0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
                      {isResetting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Reset
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset Profile</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reset your profile? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isResetting}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleReset}
                        disabled={isResetting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isResetting ? 'Resetting...' : 'Reset Profile'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Save Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="sm"
                  className="group relative h-9 bg-gradient-to-r from-teal-500 to-cyan-600 px-4 text-white shadow-md transition-all duration-500 hover:from-teal-600 hover:to-cyan-700 hover:shadow-lg hover:shadow-teal-500/20"
                >
                  <div className="absolute inset-0 translate-x-[-100%] bg-[linear-gradient(to_right,transparent_0%,#ffffff20_50%,transparent_100%)] transition-transform duration-1000 group-hover:translate-x-[100%]" />
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content container with consistent styling */}
      <div className="relative px-6 pb-10 md:px-8 lg:px-10">
        {/* Import Actions Row */}
        <div className="relative mb-6">
          <div className="rounded-2xl border border-white/40 bg-white/40 p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col gap-4">
              {/* Import Options Text */}
              <div className="flex items-center gap-2 text-purple-600/60 text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-purple-500/20 shadow-sm" />
                  <span className="font-medium">Import Options</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* LinkedIn Import Button */}
                <Button
                  variant="outline"
                  onClick={handleLinkedInImport}
                  className="group relative h-auto border-[#0077b5]/20 bg-[#0077b5]/5 py-4 text-[#0077b5] transition-all duration-500 hover:scale-[1.02] hover:border-[#0077b5]/30 hover:bg-[#0077b5]/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0077b5]/0 via-[#0077b5]/5 to-[#0077b5]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0077b5]/10 transition-transform duration-500 group-hover:scale-110">
                      <Linkedin className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-[#0077b5]">
                        LinkedIn Import
                      </div>
                      <div className="text-[#0077b5]/70 text-sm">
                        Sync with your LinkedIn profile
                      </div>
                    </div>
                  </div>
                </Button>

                {/* Resume Upload Button */}
                <Dialog
                  open={isResumeDialogOpen}
                  onOpenChange={setIsResumeDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="group relative h-auto border-violet-500/20 bg-violet-500/5 py-4 text-violet-600 transition-all duration-500 hover:scale-[1.02] hover:border-violet-500/30 hover:bg-violet-500/10"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10 transition-transform duration-500 group-hover:scale-110">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-violet-600">
                            Resume Upload
                          </div>
                          <div className="text-sm text-violet-600/70">
                            Import from existing resume
                          </div>
                        </div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-white/40 bg-white/95 shadow-2xl backdrop-blur-xl sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-2xl text-transparent">
                        Upload Resume Content
                      </DialogTitle>
                      <DialogDescription asChild>
                        <div className="space-y-2 text-base text-muted-foreground/80">
                          <span className="block">
                            Let our AI analyze your resume and enhance your
                            profile by adding new information.
                          </span>
                          <span className="block text-sm">
                            Your existing profile information will be preserved.
                            New entries will be added alongside your current
                            data. Want to start fresh instead? Use the
                            &quot;Reset Profile&quot; option before uploading.
                          </span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Textarea
                        value={resumeContent}
                        onChange={(e) => setResumeContent(e.target.value)}
                        placeholder="Paste your resume content here..."
                        className="min-h-[100px] border-white/40 bg-white/50 transition-all duration-300 focus:border-violet-500/40 focus:ring-violet-500/20"
                      />
                    </div>
                    <DialogFooter className="gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsResumeDialogOpen(false)}
                        className="bg-white/50 transition-all duration-300 hover:bg-white/60"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleResumeUpload(resumeContent)}
                        disabled={isProcessingResume || !resumeContent.trim()}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white transition-all duration-500 hover:scale-[1.02] hover:opacity-90 disabled:hover:scale-100"
                      >
                        {isProcessingResume ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span>Process with AI</span>
                          </div>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Import From Text Button */}
                <Dialog
                  open={isTextImportDialogOpen}
                  onOpenChange={setIsTextImportDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="group relative h-auto border-violet-500/20 bg-violet-500/5 py-4 text-violet-600 transition-all duration-500 hover:scale-[1.02] hover:border-violet-500/30 hover:bg-violet-500/10"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10 transition-transform duration-500 group-hover:scale-110">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-violet-600">
                            Import From Text
                          </div>
                          <div className="text-sm text-violet-600/70">
                            Import from any text content
                          </div>
                        </div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-white/40 bg-white/95 shadow-2xl backdrop-blur-xl sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-2xl text-transparent">
                        Import From Text
                      </DialogTitle>
                      <DialogDescription asChild>
                        <div className="space-y-2 text-base text-muted-foreground/80">
                          <span className="block">
                            Paste any text content below (resume, job
                            description, achievements, etc.). Our AI will
                            analyze it and enhance your profile by adding
                            relevant information.
                          </span>
                          <span className="block text-sm">
                            Your existing profile information will be preserved.
                            New entries will be added alongside your current
                            data.
                          </span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Textarea
                        value={textImportContent}
                        onChange={(e) => setTextImportContent(e.target.value)}
                        placeholder="Paste your text content here..."
                        className="min-h-[100px] border-white/40 bg-white/50 transition-all duration-300 focus:border-violet-500/40 focus:ring-violet-500/20"
                      />
                    </div>
                    <DialogFooter className="gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsTextImportDialogOpen(false)}
                        className="bg-white/50 transition-all duration-300 hover:bg-white/60"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleResumeUpload(textImportContent)}
                        disabled={
                          isProcessingResume || !textImportContent.trim()
                        }
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white transition-all duration-500 hover:scale-[1.02] hover:opacity-90 disabled:hover:scale-100"
                      >
                        {isProcessingResume ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span>Process with AI</span>
                          </div>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Tabs with smooth transitions and connected design */}
        <div className="relative ">
          {/* <div className="absolute inset-x-0 -top-3 h-8 bg-gradient-to-b from-white/60 to-transparent pointer-events-none"></div> */}
          <div className="relative ">
            <Tabs defaultValue="basic" className="w-full ">
              <TabsList className=" relative flex h-full gap-2 overflow-x-auto whitespace-nowrap rounded-xl border border-white/40 bg-white/80 shadow-lg backdrop-blur-xl">
                <TabsTrigger
                  value="basic"
                  className=" group relative flex items-center gap-2.5 rounded-xl px-5 py-3 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-teal-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/10 data-[state=active]:to-cyan-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-lg data-[state=inactive]:hover:text-gray-900"
                >
                  <div className="rounded-full bg-teal-100/80 p-1.5 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-teal-100">
                    <User className="h-4 w-4 text-teal-600 transition-colors group-data-[state=inactive]:text-teal-500/70" />
                  </div>
                  <span className="relative">
                    Basic Info
                    <div className="-bottom-2 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-teal-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="group relative flex items-center gap-2.5 rounded-xl px-5 py-3 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-cyan-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/10 data-[state=active]:to-blue-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-lg data-[state=inactive]:hover:text-gray-900"
                >
                  <div className="rounded-full bg-cyan-100/80 p-1.5 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-cyan-100">
                    <Briefcase className="h-4 w-4 text-cyan-600 transition-colors group-data-[state=inactive]:text-cyan-500/70" />
                  </div>
                  <span className="relative">
                    Work Experience
                    <div className="-bottom-2 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-cyan-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="group relative flex items-center gap-2.5 rounded-xl px-5 py-3 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-violet-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/10 data-[state=active]:to-purple-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-lg data-[state=inactive]:hover:text-gray-900"
                >
                  <div className="rounded-full bg-violet-100/80 p-1.5 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-violet-100">
                    <FolderGit2 className="h-4 w-4 text-violet-600 transition-colors group-data-[state=inactive]:text-violet-500/70" />
                  </div>
                  <span className="relative">
                    Projects
                    <div className="-bottom-2 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-violet-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="group relative flex items-center gap-2.5 rounded-xl px-5 py-3 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-indigo-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/10 data-[state=active]:to-blue-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-lg data-[state=inactive]:hover:text-gray-900"
                >
                  <div className="rounded-full bg-indigo-100/80 p-1.5 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-indigo-100">
                    <GraduationCap className="h-4 w-4 text-indigo-600 transition-colors group-data-[state=inactive]:text-indigo-500/70" />
                  </div>
                  <span className="relative">
                    Education
                    <div className="-bottom-2 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-indigo-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className="group relative flex items-center gap-2.5 rounded-xl px-5 py-3 font-medium transition-all duration-300 hover:bg-white/60 data-[state=active]:border-rose-500/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500/10 data-[state=active]:to-pink-500/10 data-[state=inactive]:text-gray-500 data-[state=active]:shadow-lg data-[state=inactive]:hover:text-gray-900"
                >
                  <div className="rounded-full bg-rose-100/80 p-1.5 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-rose-100">
                    <Wrench className="h-4 w-4 text-rose-600 transition-colors group-data-[state=inactive]:text-rose-500/70" />
                  </div>
                  <span className="relative">
                    Skills
                    <div className="-bottom-2 absolute right-0 left-0 h-0.5 scale-x-0 rounded-full bg-rose-500 transition-transform duration-300 group-data-[state=active]:scale-x-100" />
                  </span>
                </TabsTrigger>
              </TabsList>
              <div className="relative">
                {/* Content gradient overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 via-white/10 to-white/20" />

                {/* Tab content with consistent card styling */}
                <div className="relative space-y-6">
                  <TabsContent
                    value="basic"
                    className="fade-in-50 slide-in-from-bottom-2 mt-6 animate-in duration-500"
                  >
                    <Card className="group overflow-hidden rounded-xl border-white/40 bg-gradient-to-br from-white/50 via-white/40 to-white/50 shadow-xl backdrop-blur-xl transition-all duration-500 hover:shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-cyan-500/0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
                      <div className="relative p-6">
                        <ProfileBasicInfoForm
                          profile={profile}
                          onChange={(field, value) => {
                            if (field in profile) {
                              updateField(field as keyof Profile, value);
                            }
                          }}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent
                    value="experience"
                    className="fade-in-50 slide-in-from-bottom-2 mt-6 animate-in duration-500"
                  >
                    <Card className="group overflow-hidden rounded-2xl border-white/40 bg-gradient-to-br from-white/50 via-white/40 to-white/50 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-3xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
                      <div className="relative p-8">
                        <ProfileWorkExperienceForm
                          experiences={
                            profile.workExperience as WorkExperience[]
                          }
                          onChange={(experiences) =>
                            updateField('workExperience', experiences)
                          }
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent
                    value="projects"
                    className="fade-in-50 slide-in-from-bottom-2 mt-6 animate-in duration-500"
                  >
                    <Card className="group overflow-hidden rounded-2xl border-white/40 bg-gradient-to-br from-white/50 via-white/40 to-white/50 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-3xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-purple-500/0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
                      <div className="relative p-8">
                        <ProfileProjectsForm
                          projects={profile.projects as Project[]}
                          onChange={(projects) =>
                            updateField('projects', projects)
                          }
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent
                    value="education"
                    className="fade-in-50 slide-in-from-bottom-2 mt-6 animate-in duration-500"
                  >
                    <Card className="group overflow-hidden rounded-2xl border-white/40 bg-gradient-to-br from-white/50 via-white/40 to-white/50 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-3xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-blue-500/0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
                      <div className="relative p-8">
                        <ProfileEducationForm
                          education={profile.education as Education[]}
                          onChange={(education) =>
                            updateField('education', education)
                          }
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent
                    value="skills"
                    className="fade-in-50 slide-in-from-bottom-2 mt-6 animate-in duration-500"
                  >
                    <Card className="group overflow-hidden rounded-2xl border-white/40 bg-gradient-to-br from-white/50 via-white/40 to-white/50 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-3xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/5 to-pink-500/0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
                      <div className="relative p-8">
                        <ProfileSkillsForm
                          skills={profile.skills as Skill[]}
                          onChange={(skills) => updateField('skills', skills)}
                        />
                      </div>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
          <div className="-bottom-3 pointer-events-none absolute inset-x-0 h-8 bg-gradient-to-t from-white/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}
