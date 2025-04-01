'use client';

import { MemoizedMarkdown } from '@/app/(organization)/resume/components/memoized-markdown';
import ChatInput from '@/app/(organization)/resume/components/resume/assistant/chat-input';
import { QuickSuggestions } from '@/app/(organization)/resume/components/resume/assistant/quick-suggestions';
import { SuggestionSkeleton } from '@/app/(organization)/resume/components/resume/assistant/suggestion-skeleton';
import { Suggestion } from '@/app/(organization)/resume/components/resume/assistant/suggestions';
import { WholeResumeSuggestion } from '@/app/(organization)/resume/components/resume/assistant/suggestions';
import type {
  Education,
  Job,
  Project,
  Resume,
  Skill,
  WorkExperience,
} from '@/types';
import type { Message } from '@repo/ai';
import type { ToolInvocation } from '@repo/ai';
import { useChat } from '@repo/ai/lib/react';
import { Logo } from '@repo/design-system/components/logo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
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
import { LoadingDots } from '@repo/design-system/components/ui/loading-dots';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { cn } from '@repo/design-system/lib/utils';
import { Bot, ChevronDown, Pencil, RefreshCw, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';

interface ChatBotProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[typeof field]) => void;
  job?: Job | null;
}

function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      // biome-ignore lint/a11y/useButtonType: <explanation>
      <button
        className={cn(
          'absolute z-50 rounded-full p-2',
          'bg-white/80 hover:bg-white',
          'border border-purple-200/60 hover:border-purple-300/60',
          'shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10',
          'transition-all duration-300',
          'bottom-4 left-[50%] translate-x-[-50%]'
        )}
        onClick={() => scrollToBottom()}
      >
        <ChevronDown className="h-4 w-4 text-purple-600" />
      </button>
    )
  );
}

export default function ChatBot({ resume, onResumeChange, job }: ChatBotProps) {
  const router = useRouter();
  const [accordionValue, setAccordionValue] = React.useState<string>('');
  const [defaultModel, setDefaultModel] = React.useState<string>('gpt-4o-mini');
  const [originalResume, setOriginalResume] = React.useState<Resume | null>(
    null
  );
  const [isInitialLoading, setIsInitialLoading] = React.useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const {
    messages,
    error,
    append,
    isLoading,
    addToolResult,
    stop,
    setMessages,
  } = useChat({
    api: '/api/chatv2',
    body: {
      targetRole: resume.targetRole,
      resume: resume,
      model: 'gpt-4o-mini',
      job: job,
    },
    maxSteps: 5,
    onResponse() {
      setIsInitialLoading(false);
    },
    onError() {
      setIsInitialLoading(false);
    },
    async onToolCall({ toolCall }) {
      // setIsStreaming(false);

      if (toolCall.toolName === 'getResume') {
        const params = toolCall.args as { sections: string[] };

        const personalInfo = {
          firstName: resume.firstName,
          lastName: resume.lastName,
          email: resume.email,
          phoneNumber: resume.phoneNumber,
          location: resume.location,
          websiteUrl: resume.websiteUrl,
          linkedinUrl: resume.linkedinUrl,
          githubUrl: resume.githubUrl,
        };

        const sectionMap = {
          personalInfo,
          workExperience: resume.workExperience,
          education: resume.education,
          skills: resume.skills,
          projects: resume.projects,
        };

        const result = params.sections.includes('all')
          ? { ...sectionMap, targetRole: resume.targetRole }
          : params.sections.reduce(
              (acc, section) => ({
                // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
                ...acc,
                [section]: sectionMap[section as keyof typeof sectionMap],
              }),
              {}
            );

        addToolResult({ toolCallId: toolCall.toolCallId, result });
        return result;
      }

      if (toolCall.toolName === 'suggest_work_experience_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'suggest_project_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'suggest_skill_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'suggest_education_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'modifyWholeResume') {
        const updates = toolCall.args as {
          basicInfo?: Partial<{
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            location: string;
            website: string;
            linkedinUrl: string;
            githubUrl: string;
          }>;
          workExperience?: WorkExperience[];
          education?: Education[];
          skills?: Skill[];
          projects?: Project[];
        };

        // Store the current resume state before applying updates
        setOriginalResume({ ...resume });

        // Apply updates as before
        if (updates.basicInfo) {
          for (const [key, value] of Object.entries(updates.basicInfo)) {
            if (value !== undefined) {
              onResumeChange(key as keyof Resume, value);
            }
          }
        }

        const sections = {
          workExperience: updates.workExperience,
          education: updates.education,
          skills: updates.skills,
          projects: updates.projects,
        };

        // biome-ignore lint/complexity/noForEach: <explanation>
        Object.entries(sections).forEach(([key, value]) => {
          if (value !== undefined) {
            onResumeChange(key as keyof Resume, value);
          }
        });

        return (
          <div key={toolCall.toolCallId} className="mt-2 w-[90%]">
            <WholeResumeSuggestion
              onReject={() => {
                // Restore the original resume state
                if (originalResume) {
                  // Restore basic info
                  // biome-ignore lint/complexity/noForEach: <explanation>
                  Object.keys(originalResume).forEach((key) => {
                    if (
                      key !== 'id' &&
                      key !== 'createdAt' &&
                      key !== 'updatedAt'
                    ) {
                      onResumeChange(
                        key as keyof Resume,
                        originalResume[key as keyof Resume]
                      );
                    }
                  });

                  // Clear the stored original state
                  setOriginalResume(null);
                }
              }}
            />
          </div>
        );
      }
    },
    onFinish() {
      setIsInitialLoading(false);
    },
    // onResponse(response) {
    //   setIsStreaming(true);
    // },
  });

  // Memoize the submit handler
  const handleSubmit = useCallback(
    (message: string) => {
      setIsInitialLoading(true);
      append({
        content: message.replace(/\s+$/, ''), // Extra safety: trim trailing whitespace
        role: 'user',
      });

      setAccordionValue('chat');
    },
    [append]
  );

  // Add delete handler
  const handleDelete = (id: string) => {
    setMessages(messages.filter((message) => message.id !== id));
  };

  // Add edit handler
  const handleEdit = (id: string, content: string) => {
    setEditingMessageId(id);
    setEditContent(content);
  };

  // Add save handler
  const handleSaveEdit = (id: string) => {
    setMessages(
      messages.map((message) =>
        message.id === id ? { ...message, content: editContent } : message
      )
    );
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setOriginalResume(null);
    setEditingMessageId(null);
    setEditContent('');
  }, [setMessages]);

  return (
    <Card
      className={cn(
        'l mx-auto flex w-full flex-col',
        'bg-gradient-to-br from-purple-400/20 via-purple-400/50 to-indigo-400/50',
        'border-2 border-purple-200/60',
        'shadow-lg shadow-purple-500/5',
        'transition-all duration-500',
        'hover:shadow-purple-500/10 hover:shadow-xl',
        'overflow-hidden',
        'relative',
        'data-[state=closed]:border data-[state=closed]:border-purple-200/40 data-[state=closed]:shadow-md '
      )}
    >
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={setAccordionValue}
        className="relative z-10 "
      >
        <AccordionItem value="chat" className="my-0 border-none py-0">
          {/* Accordion Trigger */}
          <div className="relative">
            <AccordionTrigger
              className={cn(
                'px-2 py-2',
                'hover:no-underline',
                'group',
                'transition-all duration-300',
                'border-purple-200/60 data-[state=open]:border-b',
                'data-[state=closed]:opacity-80 data-[state=closed]:hover:opacity-100',
                'data-[state=closed]:py-1'
              )}
            >
              <div
                className={cn(
                  'flex w-full items-center',
                  'transition-transform duration-300',
                  'group-hover:scale-[0.99]',
                  'group-data-[state=closed]:scale-95'
                )}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      'rounded-lg p-1',
                      'bg-purple-100/80 text-purple-600',
                      'group-hover:bg-purple-200/80',
                      'transition-colors duration-300',
                      'group-data-[state=closed]:bg-white/60',
                      'group-data-[state=closed]:p-0.5'
                    )}
                  >
                    <Bot className="h-3 w-3" />
                  </div>
                  <Logo className="text-xs" />
                </div>
              </div>
            </AccordionTrigger>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  className={cn(
                    '-translate-y-1/2 absolute top-1/2 right-8',
                    'rounded-lg px-3 py-1',
                    'border border-purple-500 bg-purple-100/40 text-purple-500/80',
                    'hover:bg-purple-200/60 hover:text-purple-600',
                    'transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-purple-400/40',
                    'disabled:opacity-50',
                    'flex items-center gap-2',
                    (accordionValue !== 'chat' || isAlertOpen) && 'hidden'
                  )}
                  disabled={messages.length === 0}
                  aria-label="Clear chat history"
                  variant="ghost"
                  size="sm"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span className="font-medium text-xs">
                    Clear Chat History
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                className={cn(
                  'bg-white/95 backdrop-blur-xl',
                  'border-purple-200/60',
                  'shadow-lg shadow-purple-500/5'
                )}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Chat History</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all messages and reset the chat. This
                    action can&apos;t be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className={cn(
                      'border-purple-200/60',
                      'hover:bg-purple-50/50',
                      'hover:text-purple-700'
                    )}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearChat}
                    className={cn(
                      'bg-purple-500 text-white',
                      'hover:bg-purple-600',
                      'focus:ring-purple-400'
                    )}
                  >
                    Clear Chat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Accordion Content */}
          <AccordionContent className="space-y-4">
            <StickToBottom
              className="custom-scrollbar relative h-[60vh] px-4"
              resize="smooth"
              initial="smooth"
            >
              <StickToBottom.Content className="custom-scrollbar flex flex-col">
                {messages.length === 0 ? (
                  <QuickSuggestions onSuggestionClick={handleSubmit} />
                ) : (
                  <>
                    {/* Messages */}
                    {messages.map((m: Message, index) => (
                      <React.Fragment key={index}>
                        {/* Regular Message Content */}
                        {m.content && (
                          <div className="my-2">
                            <div
                              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={cn(
                                  'group relative max-w-[90%] items-center rounded-2xl px-4 py-2 text-sm',
                                  m.role === 'user'
                                    ? [
                                        'bg-gradient-to-br from-purple-500 to-indigo-500',
                                        'text-white',
                                        'shadow-md shadow-purple-500/10',
                                        'ml-auto pb-0 text-white',
                                      ]
                                    : [
                                        'bg-white/60',
                                        'border border-purple-200/60',
                                        'shadow-sm',
                                        'pb-0 backdrop-blur-sm',
                                      ]
                                )}
                              >
                                {/* Edit Message */}
                                {editingMessageId === m.id ? (
                                  <div className="flex flex-col gap-2">
                                    <Textarea
                                      value={editContent}
                                      onChange={(e) =>
                                        setEditContent(e.target.value)
                                      }
                                      className={cn(
                                        'min-h-[100px] w-full rounded-lg p-2',
                                        'bg-white/80 backdrop-blur-sm',
                                        m.role === 'user'
                                          ? 'text-purple-900 placeholder-purple-400'
                                          : 'text-gray-900 placeholder-gray-400',
                                        'border border-purple-200/60 focus:border-purple-400/60',
                                        'focus:outline-none focus:ring-1 focus:ring-purple-400/60'
                                      )}
                                    />
                                    {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                                    <button
                                      onClick={() => handleSaveEdit(m.id)}
                                      className={cn(
                                        'self-end rounded-lg px-3 py-1 text-xs',
                                        'bg-purple-500 text-white',
                                        'hover:bg-purple-600',
                                        'transition-colors duration-200'
                                      )}
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <MemoizedMarkdown
                                    id={m.id}
                                    content={m.content}
                                  />
                                )}

                                {/* Message Actions */}
                                <div className="-bottom-4 absolute left-2 flex gap-2">
                                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                                  <button
                                    onClick={() => handleDelete(m.id)}
                                    className={cn(
                                      'transition-colors duration-200',
                                      m.role === 'user'
                                        ? 'text-purple-500/60 hover:text-purple-600'
                                        : 'text-purple-400/60 hover:text-purple-500'
                                    )}
                                    aria-label="Delete message"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                                  <button
                                    onClick={() => handleEdit(m.id, m.content)}
                                    className={cn(
                                      'transition-colors duration-200',
                                      m.role === 'user'
                                        ? 'text-purple-500/60 hover:text-purple-600'
                                        : 'text-purple-400/60 hover:text-purple-500'
                                    )}
                                    aria-label="Edit message"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Tool Invocations as Separate Bubbles */}
                        {m.toolInvocations?.map(
                          (toolInvocation: ToolInvocation) => {
                            const { toolName, toolCallId, state, args } =
                              toolInvocation;
                            switch (state) {
                              case 'partial-call':
                              case 'call':
                                return (
                                  <div
                                    key={toolCallId}
                                    className="mt-2 max-w-[90%]"
                                  >
                                    <div className="flex max-w-[90%] justify-start">
                                      {toolName === 'getResume' ? (
                                        <div
                                          className={cn(
                                            'max-w-[90%] rounded-2xl px-4 py-2 text-sm',
                                            'border border-purple-200/60 bg-white/60',
                                            'shadow-sm backdrop-blur-sm'
                                          )}
                                        >
                                          Reading Resume...
                                        </div>
                                        // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                      ) : toolName === 'modifyWholeResume' ? (
                                        <div
                                          className={cn(
                                            'w-full rounded-2xl px-4 py-2',
                                            'border border-purple-200/60 bg-white/60',
                                            'shadow-sm backdrop-blur-sm'
                                          )}
                                        >
                                          Preparing resume modifications...
                                        </div>
                                        // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                      ) : toolName.startsWith('suggest_') ? (
                                        <SuggestionSkeleton />
                                      ) : null}
                                      {toolName === 'displayWeather' ? (
                                        <div>Loading weather...</div>
                                      ) : null}
                                    </div>
                                  </div>
                                );

                              case 'result':
                                // Map tool names to resume sections and handle suggestions
                                // biome-ignore lint/style/useSingleCaseStatement: <explanation>
                                // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
                                const toolConfig = {
                                  suggest_work_experience_improvement: {
                                    type: 'workExperience' as const,
                                    field: 'workExperience',
                                    content: 'improvedExperience',
                                  },
                                  suggest_project_improvement: {
                                    type: 'project' as const,
                                    field: 'projects',
                                    content: 'improvedProject',
                                  },
                                  suggest_skill_improvement: {
                                    type: 'skill' as const,
                                    field: 'skills',
                                    content: 'improvedSkill',
                                  },
                                  suggest_education_improvement: {
                                    type: 'education' as const,
                                    field: 'education',
                                    content: 'improvedEducation',
                                  },
                                  modifyWholeResume: {
                                    type: 'whole_resume' as const,
                                    field: 'all',
                                    content: null,
                                  },
                                } as const;
                                // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
                                const config =
                                  toolConfig[
                                    toolName as keyof typeof toolConfig
                                  ];

                                if (!config) return null;

                                // Handle specific tool results
                                if (toolName === 'getResume') {
                                  return (
                                    <div
                                      key={toolCallId}
                                      className="mt-2 w-[90%]"
                                    >
                                      <div className="flex justify-start">
                                        <div
                                          className={cn(
                                            'max-w-[90%] rounded-2xl px-4 py-2 text-sm',
                                            'border border-purple-200/60 bg-white/60',
                                            'shadow-sm backdrop-blur-sm'
                                          )}
                                        >
                                          {args.message}
                                          <p>Read Resume ✅</p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                if (config.type === 'whole_resume') {
                                  // Store original state before applying updates
                                  if (!originalResume) {
                                    setOriginalResume({ ...resume });
                                  }

                                  return (
                                    <div
                                      key={toolCallId}
                                      className="mt-2 w-[90%]"
                                    >
                                      <WholeResumeSuggestion
                                        onReject={() => {
                                          if (originalResume) {
                                            // biome-ignore lint/complexity/noForEach: <explanation>
                                            Object.keys(originalResume).forEach(
                                              (key) => {
                                                if (
                                                  key !== 'id' &&
                                                  key !== 'created_at' &&
                                                  key !== 'updated_at'
                                                ) {
                                                  onResumeChange(
                                                    key as keyof Resume,
                                                    originalResume[
                                                      key as keyof Resume
                                                    ]
                                                  );
                                                }
                                              }
                                            );
                                            setOriginalResume(null);
                                          }
                                        }}
                                      />
                                    </div>
                                  );
                                }

                                return (
                                  <div
                                    key={toolCallId}
                                    className="mt-2 w-[90%]"
                                  >
                                    <div className="">
                                      <Suggestion
                                        type={config.type}
                                        content={args[config.content]}
                                        currentContent={
                                          resume[config.field][args.index]
                                        }
                                        onAccept={() =>
                                          onResumeChange(
                                            config.field,
                                            resume[config.field].map(
                                              (
                                                item:
                                                  | WorkExperience
                                                  | Education
                                                  | Project
                                                  | Skill,
                                                i: number
                                              ) =>
                                                i === args.index
                                                  ? args[config.content]
                                                  : item
                                            )
                                          )
                                        }
                                        onReject={() => {}}
                                      />
                                    </div>
                                  </div>
                                );

                              default:
                                return null;
                            }
                          }
                        )}

                        {/* Loading Dots Message - Modified condition */}
                        {((isInitialLoading &&
                          index === messages.length - 1 &&
                          m.role === 'user') ||
                          (isLoading &&
                            index === messages.length - 1 &&
                            m.role === 'assistant')) && (
                          <div className="mt-2">
                            <div className="flex justify-start">
                              <div
                                className={cn(
                                  'min-w-[60px] rounded-2xl px-4 py-2.5',
                                  'bg-white/60',
                                  'border border-purple-200/60',
                                  'shadow-sm',
                                  'backdrop-blur-sm'
                                )}
                              >
                                <LoadingDots className="text-purple-600" />
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}

                {error &&
                  (error.message === 'Rate limit exceeded. Try again later.' ? (
                    <div
                      className={cn(
                        'rounded-lg p-4 text-sm',
                        'border border-pink-200 bg-pink-50',
                        'text-pink-700'
                      )}
                    >
                      <p>
                        You&apos;ve used all your available messages. Please try
                        again after:
                      </p>
                      <p className="mt-2 font-medium">
                        {new Date(
                          Date.now() + 5 * 60 * 60 * 1000
                        ).toLocaleString()}{' '}
                        {/* 5 hours from now */}
                      </p>
                    </div>
                  ) : (
                    <></>
                  ))}
              </StickToBottom.Content>

              <ScrollToBottom />
            </StickToBottom>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Input Bar */}
      <ChatInput isLoading={isLoading} onSubmit={handleSubmit} onStop={stop} />
    </Card>
  );
}
