'use client';

import { createBaseResume } from '@/actions/resume';
import type {
  Education,
  Profile,
  Project,
  Resume,
  Skill,
  WorkExperience,
} from '@/types';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { toast } from '@repo/design-system/hooks/use-toast';
import { cn } from '@repo/design-system/lib/utils';
import { Copy, FileText, Loader2, Plus, Upload, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import pdfToText from 'react-pdftotext';

import { convertTextToResume } from '@/actions/ai';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import { Textarea } from '@repo/design-system/components/ui/textarea';

interface CreateBaseResumeDialogProps {
  children: React.ReactNode;
  profile: Profile;
}

export function CreateBaseResumeDialog({
  children,
  profile,
}: CreateBaseResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [importOption, setImportOption] = useState<
    'import-profile' | 'scratch' | 'import-resume'
  >('import-profile');
  const [isTargetRoleInvalid, setIsTargetRoleInvalid] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{
    workExperience: string[];
    education: string[];
    skills: string[];
    projects: string[];
  }>({
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
  });
  const [resumeText, setResumeText] = useState('');
  const router = useRouter();
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{
    title: string;
    description: string;
  }>({
    title: '',
    description: '',
  });
  const [isDragging, setIsDragging] = useState(false);

  const getItemId = (
    type: keyof typeof selectedItems,
    item: WorkExperience | Education | Skill | Project
  ): string => {
    switch (type) {
      case 'workExperience':
        return `${(item as WorkExperience).company}-${(item as WorkExperience).position}-${(item as WorkExperience).date}`;
      case 'projects':
        return (item as Project).name;
      case 'education':
        return `${(item as Education).school}-${(item as Education).degree}-${(item as Education).field}`;
      case 'skills':
        return (item as Skill).category;
      default:
        return '';
    }
  };

  const handleItemSelection = (
    section: keyof typeof selectedItems,
    id: string
  ) => {
    setSelectedItems((prev) => ({
      ...prev,
      [section]: prev[section].includes(id)
        ? prev[section].filter((x) => x !== id)
        : [...prev[section], id],
    }));
  };

  const handleSectionSelection = (
    section: keyof typeof selectedItems,
    checked: boolean
  ) => {
    setSelectedItems((prev) => ({
      ...prev,
      [section]: checked
        ? (
            profile[section] as (WorkExperience | Education | Skill | Project)[]
          ).map((item: WorkExperience | Education | Skill | Project) =>
            getItemId(section, item)
          )
        : [],
    }));
  };

  const isSectionSelected = (section: keyof typeof selectedItems): boolean => {
    const sectionItems = (
      profile[section] as (WorkExperience | Education | Skill | Project)[]
    ).map((item: WorkExperience | Education | Skill | Project) =>
      getItemId(section, item)
    );
    return (
      sectionItems.length > 0 &&
      sectionItems.every((id: string) => selectedItems[section].includes(id))
    );
  };

  const isSectionPartiallySelected = (
    section: keyof typeof selectedItems
  ): boolean => {
    const sectionItems = (
      profile[section] as (WorkExperience | Education | Skill | Project)[]
    ).map((item: WorkExperience | Education | Skill | Project) =>
      getItemId(section, item)
    );
    const selectedCount = sectionItems.filter((id: string) =>
      selectedItems[section].includes(id)
    ).length;
    return selectedCount > 0 && selectedCount < sectionItems.length;
  };

  const handleCreate = async () => {
    if (!targetRole.trim()) {
      setIsTargetRoleInvalid(true);
      setTimeout(() => setIsTargetRoleInvalid(false), 820);
      toast({
        title: 'Required Field Missing',
        description:
          'Target role is a required field. Please enter your target role.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCreating(true);

      if (importOption === 'import-resume') {
        if (!resumeText.trim()) {
          return;
        }

        // Create an empty resume to pass to convertTextToResume
        const emptyResume: Resume = {
          id: '',
          userId: '',
          name: targetRole,
          targetRole: targetRole,
          isBaseResume: true,
          firstName: '',
          lastName: '',
          email: '',
          workExperience: [],
          education: [],
          skills: [],
          projects: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          hasCoverLetter: false,
        };

        try {
          const convertedResume = await convertTextToResume(
            resumeText,
            emptyResume,
            targetRole,
            profile.email ?? ''
          );

          // Extract content sections and basic info for createBaseResume
          const selectedContent = {
            // Basic Info
            firstName: convertedResume.firstName || '',
            lastName: convertedResume.lastName || '',
            email: convertedResume.email || '',
            phoneNumber: convertedResume.phoneNumber,
            location: convertedResume.location,
            websiteUrl: convertedResume.websiteUrl,
            linkedinUrl: convertedResume.linkedinUrl,
            githubUrl: convertedResume.githubUrl,

            // Content Sections
            workExperience: convertedResume.workExperience || [],
            education: convertedResume.education || [],
            skills: convertedResume.skills || [],
            projects: convertedResume.projects || [],
          };

          const resume = await createBaseResume(
            targetRole,
            'import-resume',
            selectedContent as Resume
          );

          toast({
            title: 'Success',
            description: 'Resume created successfully',
          });

          router.push(`/resume/resumes/${resume.id}`);
          setOpen(false);
          return;
        } catch (error: unknown) {
          setErrorMessage({
            title: 'Error',
            description: 'Failed to convert resume text. Please try again.',
          });
          setShowErrorDialog(true);
          setIsCreating(false);
          return;
        }
      }

      const selectedContent = {
        workExperience: (profile.workExperience as WorkExperience[]).filter(
          (exp: WorkExperience) =>
            selectedItems.workExperience.includes(
              getItemId('workExperience', exp)
            )
        ),
        education: (profile.education as Education[]).filter((edu: Education) =>
          selectedItems.education.includes(getItemId('education', edu))
        ),
        skills: (profile.skills as Skill[]).filter((skill: Skill) =>
          selectedItems.skills.includes(getItemId('skills', skill))
        ),
        projects: (profile.projects as Project[]).filter((project: Project) =>
          selectedItems.projects.includes(getItemId('projects', project))
        ),
      };

      const resume = await createBaseResume(
        targetRole,
        importOption === 'scratch' ? 'fresh' : importOption,
        selectedContent
      );

      toast({
        title: 'Success',
        description: 'Resume created successfully',
      });

      router.push(`/resume/resumes/${resume.id}`);
      setOpen(false);
    } catch (error) {
      console.error('Create resume error:', error);
      setErrorMessage({
        title: 'Error',
        description: 'Failed to create resume. Please try again.',
      });
      setShowErrorDialog(true);
    } finally {
      setIsCreating(false);
    }
  };

  // Initialize all items as selected when dialog opens
  const initializeSelectedItems = () => {
    setSelectedItems({
      workExperience: (profile.workExperience as WorkExperience[]).map(
        (exp: WorkExperience) => getItemId('workExperience', exp)
      ),
      education: (profile.education as Education[]).map((edu: Education) =>
        getItemId('education', edu)
      ),
      skills: (profile.skills as Skill[]).map((skill: Skill) =>
        getItemId('skills', skill)
      ),
      projects: (profile.projects as Project[]).map((project: Project) =>
        getItemId('projects', project)
      ),
    });
  };

  // Reset form and initialize selected items when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Move focus back to the trigger when closing
      const trigger = document.querySelector('[data-state="open"]');
      if (trigger) {
        (trigger as HTMLElement).focus();
      }
    }
    setOpen(newOpen);
    if (newOpen) {
      setTargetRole('');
      setImportOption('import-profile');
      initializeSelectedItems();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === 'application/pdf');

    if (pdfFile) {
      try {
        const text = await pdfToText(pdfFile);
        setResumeText((prev) => prev + (prev ? '\n\n' : '') + text);
      } catch {
        toast({
          title: 'PDF Processing Error',
          description:
            'Failed to extract text from the PDF. Please try again or paste the content manually.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Invalid File',
        description: 'Please drop a PDF file.',
        variant: 'destructive',
      });
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      try {
        const text = await pdfToText(file);
        setResumeText((prev) => prev + (prev ? '\n\n' : '') + text);
      } catch {
        toast({
          title: 'PDF Processing Error',
          description:
            'Failed to extract text from the PDF. Please try again or paste the content manually.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          'max-h-[90vh] overflow-y-auto p-0 sm:max-w-[800px]',
          'border-white/40 bg-gradient-to-b shadow-2xl backdrop-blur-2xl',
          'border-purple-200/40 from-purple-50/95 to-indigo-50/90',
          'rounded-xl'
        )}
      >
        <style jsx global>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
          .shake {
            animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
          }
        `}</style>
        {/* Header Section with Icon */}
        <div
          className={cn(
            'relative top-0 z-10 border-b bg-white/50 px-8 pt-6 pb-4 backdrop-blur-xl',
            'border-purple-200/20'
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'rounded-xl p-3 transition-all duration-300',
                'border border-purple-200/60 bg-gradient-to-br from-purple-100/80 to-indigo-100/80'
              )}
            >
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <DialogTitle className="font-semibold text-purple-950 text-xl">
                Create Base Resume
              </DialogTitle>
              <DialogDescription className="mt-1 text-muted-foreground text-sm">
                Create a new base resume template that you can use for multiple
                job applications
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6 bg-gradient-to-b from-purple-50/30 to-indigo-50/30 px-8 py-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="target-role"
                className="font-medium text-lg text-purple-950"
              >
                Target Role <span className="text-red-500">*</span>
              </Label>
              <Input
                id="target-role"
                placeholder="e.g., Senior Software Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className={cn(
                  'h-12 border-gray-200 bg-white/80 text-base placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20',
                  isTargetRoleInvalid && 'shake border-red-500'
                )}
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="font-medium text-base text-purple-950">
                Resume Content
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="radio"
                    id="import-profile"
                    name="importOption"
                    value="import-profile"
                    checked={importOption === 'import-profile'}
                    onChange={(e) =>
                      setImportOption(
                        e.target.value as
                          | 'import-profile'
                          | 'scratch'
                          | 'import-resume'
                      )
                    }
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="import-profile"
                    className={cn(
                      'flex h-[88px] items-center rounded-lg p-3',
                      'border bg-white shadow-sm',
                      'hover:border-purple-200 hover:bg-purple-50/50',
                      'cursor-pointer transition-all duration-300',
                      'peer-checked:border-purple-500 peer-checked:bg-purple-50',
                      'peer-checked:shadow-md peer-checked:shadow-purple-100'
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50">
                      <Copy className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <div className="font-medium text-purple-950 text-sm">
                        Import from Profile
                      </div>
                      <span className="line-clamp-2 text-gray-600 text-xs">
                        Import your experience and skills
                      </span>
                    </div>
                  </Label>
                </div>

                <div>
                  <input
                    type="radio"
                    id="import-resume"
                    name="importOption"
                    value="import-resume"
                    checked={importOption === 'import-resume'}
                    onChange={(e) =>
                      setImportOption(
                        e.target.value as
                          | 'import-profile'
                          | 'scratch'
                          | 'import-resume'
                      )
                    }
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="import-resume"
                    className={cn(
                      'flex h-[88px] items-center rounded-lg p-3',
                      'border bg-white shadow-sm',
                      'hover:border-purple-200 hover:bg-purple-50/50',
                      'cursor-pointer transition-all duration-300',
                      'peer-checked:border-purple-500 peer-checked:bg-purple-50',
                      'peer-checked:shadow-md peer-checked:shadow-purple-100'
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50">
                      <Plus className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <div className="font-medium text-purple-950 text-sm">
                        Import from Resume
                      </div>
                      <span className="line-clamp-2 text-gray-600 text-xs">
                        Paste your existing resume
                      </span>
                    </div>
                  </Label>
                </div>

                <div>
                  <input
                    type="radio"
                    id="scratch"
                    name="importOption"
                    value="scratch"
                    checked={importOption === 'scratch'}
                    onChange={(e) =>
                      setImportOption(
                        e.target.value as
                          | 'import-profile'
                          | 'scratch'
                          | 'import-resume'
                      )
                    }
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="scratch"
                    className={cn(
                      'flex h-[88px] items-center rounded-lg p-3',
                      'border bg-white shadow-sm',
                      'hover:border-purple-200 hover:bg-purple-50/50',
                      'cursor-pointer transition-all duration-300',
                      'peer-checked:border-purple-500 peer-checked:bg-purple-50',
                      'peer-checked:shadow-md peer-checked:shadow-purple-100'
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50">
                      <Wand2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3 flex flex-col">
                      <div className="font-medium text-purple-950 text-sm">
                        Start Fresh
                      </div>
                      <span className="line-clamp-2 text-gray-600 text-xs">
                        Create a blank resume
                      </span>
                    </div>
                  </Label>
                </div>
              </div>

              {importOption === 'import-profile' && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="space-y-4">
                      {/* Work Experience */}
                      <AccordionItem
                        value="work-experience"
                        className="border-black/30 border-b shadow-2xl"
                      >
                        <div className="flex w-full items-center gap-2">
                          <Checkbox
                            id="work-experience-section"
                            checked={isSectionSelected('workExperience')}
                            onCheckedChange={(checked) =>
                              handleSectionSelection(
                                'workExperience',
                                checked as boolean
                              )
                            }
                            className={cn(
                              'mt-0.5 ml-2',
                              isSectionPartiallySelected('workExperience') &&
                                'data-[state=checked]:bg-purple-600/50'
                            )}
                          />
                          <AccordionTrigger className="group w-full py-2 hover:no-underline ">
                            <div className="flex w-full flex-col items-start">
                              <span className="font-semibold text-purple-950 text-sm group-hover:text-purple-950">
                                Work Experience
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {
                                  (profile.workExperience as WorkExperience[])
                                    .length
                                }{' '}
                                {(profile.workExperience as WorkExperience[])
                                  .length === 1
                                  ? 'position'
                                  : 'positions'}
                              </span>
                            </div>
                          </AccordionTrigger>
                        </div>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {(profile.workExperience as WorkExperience[]).map(
                              (exp: WorkExperience) => {
                                const id = getItemId('workExperience', exp);
                                return (
                                  <div
                                    key={id}
                                    className="flex items-start space-x-2 rounded-md border border-gray-200 bg-white/50 p-2.5 transition-colors hover:bg-white/80"
                                  >
                                    <Checkbox
                                      id={id}
                                      checked={selectedItems.workExperience.includes(
                                        id
                                      )}
                                      onCheckedChange={() =>
                                        handleItemSelection(
                                          'workExperience',
                                          id
                                        )
                                      }
                                      className="mt-0.5 ml-2"
                                    />
                                    {/* biome-ignore lint/nursery/noStaticElementInteractions: <explanation> */}
                                    {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                                    <div
                                      className="flex-1 cursor-pointer"
                                      onClick={() =>
                                        handleItemSelection(
                                          'workExperience',
                                          id
                                        )
                                      }
                                    >
                                      <div className="flex items-baseline justify-between">
                                        <div className="font-medium text-sm">
                                          {exp.position}
                                        </div>
                                        <div className="text-muted-foreground text-xs">
                                          {exp.date}
                                        </div>
                                      </div>
                                      <div className="text-muted-foreground text-xs">
                                        {exp.company}
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Skills */}
                      <AccordionItem
                        value="skills"
                        className="border-black/30 border-b shadow-2xl"
                      >
                        <div className="flex w-full items-center gap-2">
                          <Checkbox
                            id="skills-section"
                            checked={isSectionSelected('skills')}
                            onCheckedChange={(checked) =>
                              handleSectionSelection(
                                'skills',
                                checked as boolean
                              )
                            }
                            className={cn(
                              'mt-0.5 ml-2',
                              isSectionPartiallySelected('skills') &&
                                'data-[state=checked]:bg-purple-600/50'
                            )}
                          />
                          <AccordionTrigger className="group w-full py-2 hover:no-underline">
                            <div className="flex w-full flex-col items-start">
                              <span className="font-semibold text-purple-950 text-sm group-hover:text-purple-950">
                                Skills
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {(profile.skills as Skill[]).length}{' '}
                                {(profile.skills as Skill[]).length === 1
                                  ? 'category'
                                  : 'categories'}
                              </span>
                            </div>
                          </AccordionTrigger>
                        </div>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {(profile.skills as Skill[]).map((skill: Skill) => {
                              const id = getItemId('skills', skill);
                              return (
                                <div
                                  key={id}
                                  className="flex items-start space-x-2 rounded-md border border-gray-200 bg-white/50 p-2.5 transition-colors hover:bg-white/80"
                                >
                                  <Checkbox
                                    id={id}
                                    checked={selectedItems.skills.includes(id)}
                                    onCheckedChange={() =>
                                      handleItemSelection('skills', id)
                                    }
                                    className="mt-0.5 ml-2"
                                  />
                                  {/* biome-ignore lint/nursery/noStaticElementInteractions: <explanation> */}
                                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                                  <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() =>
                                      handleItemSelection('skills', id)
                                    }
                                  >
                                    <div className="mb-1 font-medium text-sm">
                                      {skill.category}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {skill.items.map(
                                        (item: string, index: number) => (
                                          <Badge
                                            key={index}
                                            variant="secondary"
                                            className="border border-purple-200 bg-white/60 px-1.5 py-0 text-[10px] text-purple-700"
                                          >
                                            {item}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="space-y-4">
                      {/* Projects */}
                      <AccordionItem
                        value="projects"
                        className="border-black/30 border-b shadow-2xl"
                      >
                        <div className="flex w-full items-center gap-2">
                          <Checkbox
                            id="projects-section"
                            checked={isSectionSelected('projects')}
                            onCheckedChange={(checked) =>
                              handleSectionSelection(
                                'projects',
                                checked as boolean
                              )
                            }
                            className={cn(
                              'mt-0.5 ml-2',
                              isSectionPartiallySelected('projects') &&
                                'data-[state=checked]:bg-purple-600/50'
                            )}
                          />
                          <AccordionTrigger className="group w-full py-2 hover:no-underline">
                            <div className="flex w-full flex-col items-start">
                              <span className="font-semibold text-purple-950 text-sm group-hover:text-purple-950">
                                Projects
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {(profile.projects as Project[]).length}{' '}
                                {(profile.projects as Project[]).length === 1
                                  ? 'project'
                                  : 'projects'}
                              </span>
                            </div>
                          </AccordionTrigger>
                        </div>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {(profile.projects as Project[]).map(
                              (project: Project) => {
                                const id = getItemId('projects', project);
                                return (
                                  <div
                                    key={id}
                                    className="flex items-start space-x-2 rounded-md border border-gray-200 bg-white/50 p-2.5 transition-colors hover:bg-white/80"
                                  >
                                    <Checkbox
                                      id={id}
                                      checked={selectedItems.projects.includes(
                                        id
                                      )}
                                      onCheckedChange={() =>
                                        handleItemSelection('projects', id)
                                      }
                                      className="mt-0.5 ml-2"
                                    />
                                    {/* biome-ignore lint/nursery/noStaticElementInteractions: <explanation> */}
                                    {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                                    <div
                                      className="flex-1 cursor-pointer"
                                      onClick={() =>
                                        handleItemSelection('projects', id)
                                      }
                                    >
                                      <div className="flex items-baseline justify-between">
                                        <div className="font-medium text-sm">
                                          {project.name}
                                        </div>
                                        {project.date && (
                                          <div className="text-muted-foreground text-xs">
                                            {project.date}
                                          </div>
                                        )}
                                      </div>
                                      {project.technologies && (
                                        <div className="line-clamp-1 text-muted-foreground text-xs">
                                          {project.technologies.join(', ')}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Education */}
                      <AccordionItem
                        value="education"
                        className="border-black/30 border-b shadow-2xl"
                      >
                        <div className="flex w-full items-center gap-2">
                          <Checkbox
                            id="education-section"
                            checked={isSectionSelected('education')}
                            onCheckedChange={(checked) =>
                              handleSectionSelection(
                                'education',
                                checked as boolean
                              )
                            }
                            className={cn(
                              'mt-0.5 ml-2',
                              isSectionPartiallySelected('education') &&
                                'data-[state=checked]:bg-purple-600/50'
                            )}
                          />
                          <AccordionTrigger className="group w-full py-2 hover:no-underline">
                            <div className="flex w-full flex-col items-start">
                              <span className="font-semibold text-purple-950 text-sm group-hover:text-purple-950">
                                Education
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {(profile.education as Education[]).length}{' '}
                                {(profile.education as Education[]).length === 1
                                  ? 'institution'
                                  : 'institutions'}
                              </span>
                            </div>
                          </AccordionTrigger>
                        </div>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {(profile.education as Education[]).map(
                              (edu: Education) => {
                                const id = getItemId('education', edu);
                                return (
                                  <div
                                    key={id}
                                    className="flex items-start space-x-2 rounded-md border border-gray-200 bg-white/50 p-2.5 transition-colors hover:bg-white/80"
                                  >
                                    <Checkbox
                                      id={id}
                                      checked={selectedItems.education.includes(
                                        id
                                      )}
                                      onCheckedChange={() =>
                                        handleItemSelection('education', id)
                                      }
                                      className="mt-0.5 ml-2"
                                    />
                                    {/* biome-ignore lint/nursery/noStaticElementInteractions: <explanation> */}
                                    {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                                    <div
                                      className="flex-1 cursor-pointer"
                                      onClick={() =>
                                        handleItemSelection('education', id)
                                      }
                                    >
                                      <div className="flex items-baseline justify-between">
                                        <div className="font-medium text-sm">{`${edu.degree} in ${edu.field}`}</div>
                                        <div className="text-muted-foreground text-xs">
                                          {edu.date}
                                        </div>
                                      </div>
                                      <div className="text-muted-foreground text-xs">
                                        {edu.school}
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              )}

              {importOption === 'import-resume' && (
                <div className="space-y-4">
                  <label
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                      'group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors duration-200',
                      isDragging
                        ? 'border-purple-500 bg-purple-50/50'
                        : 'border-gray-200 hover:border-purple-500/50 hover:bg-purple-50/10'
                    )}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={handleFileInput}
                    />
                    <Upload className="h-10 w-10 text-purple-500 transition-transform duration-200 group-hover:scale-110" />
                    <div className="text-center">
                      <p className="font-medium text-foreground text-sm">
                        Drop your PDF resume here
                      </p>
                      <p className="text-muted-foreground text-sm">
                        or click to browse files
                      </p>
                    </div>
                  </label>
                  <div className="relative">
                    <div className="-top-3 absolute left-3 bg-white px-2 text-muted-foreground text-sm">
                      Or paste your resume text here
                    </div>
                    <Textarea
                      id="resume-text"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Start pasting your resume content here..."
                      className="min-h-[200px] border-gray-200 bg-white/80 pt-4 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div
          className={cn(
            'sticky bottom-0 z-10 border-t bg-white/50 px-8 py-4 backdrop-blur-xl',
            'border-purple-200/20 bg-white/40'
          )}
        >
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className={cn(
                'border-gray-200 text-gray-600',
                'hover:bg-white/60',
                'hover:border-purple-200'
              )}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className={cn(
                'text-white shadow-lg transition-all duration-500 hover:shadow-xl',
                'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              )}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Resume'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
