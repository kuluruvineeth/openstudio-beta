'use client';

import { useModal } from '@/hooks/use-modal';
import { examplePrompts } from '@/modules/tube/automation/examples';
import { personas } from '@/modules/tube/automation/examples';
import { trpc } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@repo/design-system/components/input';
import { AlertBasic } from '@repo/design-system/components/ui/alert';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-explanation';
import { SectionHeader } from '@repo/design-system/components/ui/typography';
import { SparklesIcon, UserPenIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';
import { z } from 'zod';
import { PersonaDialog } from './persona-dialog';

export const saveRulesPromptBody = z.object({ rulesPrompt: z.string().trim() });
export type SaveRulesPromptBody = z.infer<typeof saveRulesPromptBody>;

export function RulesPrompt() {
  const [data] = trpc.profile.getOne.useSuspenseQuery();

  const { isModalOpen, setIsModalOpen } = useModal();
  const onOpenPersonaDialog = useCallback(
    () => setIsModalOpen(true),
    [setIsModalOpen]
  );

  const [persona, setPersona] = useState<string | null>(null);

  const personaPrompt = persona
    ? personas[persona as keyof typeof personas]?.prompt
    : undefined;

  return (
    <>
      <RulesPromptForm
        rulesPrompt={data.rulesPrompt || undefined}
        personaPrompt={personaPrompt}
        onOpenPersonaDialog={onOpenPersonaDialog}
      />
      <PersonaDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSelect={setPersona}
      />
    </>
  );
}

function RulesPromptForm({
  rulesPrompt,
  personaPrompt,
  // mutate,
  onOpenPersonaDialog,
}: {
  rulesPrompt?: string;
  personaPrompt?: string;
  // mutate: () => void;
  onOpenPersonaDialog: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [result, setResult] = useState<{
    createdRules: boolean;
    editedRules: boolean;
    removedRules: boolean;
  }>();
  const [showClearWarning, setShowClearWarning] = useState(false);

  const [
    viewedProcessingPromptFileDialog,
    setViewedProcessingPromptFileDialog,
  ] = useLocalStorage('viewedProcessingPromptFileDialog', false);

  const update = trpc.profile.update.useMutation({
    onSuccess: () => {
      toast.success('Profile updated');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<SaveRulesPromptBody>({
    resolver: zodResolver(saveRulesPromptBody),
    defaultValues: {
      rulesPrompt: rulesPrompt,
    },
  });

  const currentPrompt = watch('rulesPrompt');

  useEffect(() => {
    setShowClearWarning(!!rulesPrompt && currentPrompt === '');
  }, [rulesPrompt, currentPrompt]);

  const router = useRouter();

  useEffect(() => {
    // biome-ignore lint/style/useBlockStatements: <explanation>
    if (!personaPrompt) return;

    const currentPrompt = getValues('rulesPrompt') || '';
    const updatedPrompt = `${currentPrompt}\n\n${personaPrompt}`.trim();

    setValue('rulesPrompt', updatedPrompt);
  }, [personaPrompt, getValues, setValue]);

  const addExamplePrompt = useCallback(
    (example: string) => {
      setValue(
        'rulesPrompt',
        `${getValues('rulesPrompt')}\n* ${example.trim()}`.trim()
      );
    },
    [setValue, getValues]
  );

  const onSubmit = useCallback(
    async (data: SaveRulesPromptBody) => {
      setIsSubmitting(true);

      const saveRulesPromise = async (data: SaveRulesPromptBody) => {
        setIsSubmitting(true);
        await update.mutate({ rulesPrompt: data.rulesPrompt });

        if (viewedProcessingPromptFileDialog) {
          router.push('/automation?tab=test');
        }
        setIsSubmitting(false);
      };

      if (!viewedProcessingPromptFileDialog) {
        setIsDialogOpen(true);
      }
      setResult(undefined);

      toast.promise(() => saveRulesPromise(data), {
        loading: 'Saving rules...This may take a while to process...',
        success: 'Rules saved',
        error: 'Failed to save rules',
      });
    },
    [update.mutate, viewedProcessingPromptFileDialog, router]
  );

  return (
    <div>
      <Card className="grid grid-cols-1 md:grid-cols-3 dark:bg-zinc-800/50">
        <div className="col-span-2">
          <CardHeader>
            <CardTitle>
              How your AI Personal Assistant should handle incoming comments
            </CardTitle>
            <CardDescription>
              These are the instructions that your AI Personal Assistant will
              follow when handling incoming comments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showClearWarning && (
              <AlertBasic
                className="mb-2"
                variant="default"
                title="Warning: Deleting text will remove or disable rules"
                description="Add new rules at the end to keep your existing rules."
              />
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4 sm:col-span-2">
                <Input
                  className="min-h-[300px] dark:bg-zinc-800/50"
                  registerProps={register('rulesPrompt', { required: true })}
                  name="rulesPrompt"
                  type="text"
                  autosizeTextarea
                  rows={25}
                  maxRows={50}
                  error={errors.rulesPrompt}
                  placeholder="Enter your rules here..."
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting || isGenerating}
                    loading={isSubmitting}
                  >
                    Save
                  </Button>

                  <Tooltip content="Our AI will analyze your Youtube Comments and create a customized prompt for your AI Personal Assistant.">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting || isGenerating}
                      loading={isGenerating}
                    >
                      <SparklesIcon className="mr-2 size-4" />
                      Create for me
                    </Button>
                  </Tooltip>

                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenPersonaDialog();
                    }}
                  >
                    <UserPenIcon className="mr-2 size-4" />
                    Choose Persona
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </div>
        <div className="px-4 pb-4 sm:mt-8 sm:px-0 sm:py-0 xl:px-4">
          <SectionHeader>Examples</SectionHeader>
          <div className="no-scrollbar mt-2 h-[600px] max-h-[600px] overflow-y-auto pr-3">
            <div className="grid grid-cols-1 gap-2">
              {examplePrompts.map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  className="h-auto w-full justify-start py-2 text-left"
                  onClick={() => addExamplePrompt(example)}
                  style={{
                    textWrap: 'wrap',
                  }}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
