import type { TAssistant } from '@/app/hooks/use-chat-session';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { get, set } from 'idb-keyval';
import { v4 } from 'uuid';

export const useAssistants = () => {
  const getAssistants = async (): Promise<TAssistant[]> => {
    return (await get('assistants')) || [];
  };

  const createAssistant = async (assistant: Omit<TAssistant, 'key'>) => {
    const assistants = await getAssistants();
    const newAssistants = [...assistants, { ...assistant, key: v4() }];
    set('assistants', newAssistants);
  };

  const deleteAssistant = async (key: string) => {
    const assistants = await getAssistants();
    const newAssistants =
      assistants?.filter((assistant) => assistant.key !== key) || [];
    set('assistants', newAssistants);
  };

  const updateAssistant = async (
    assistantKey: string,
    newAssistant: Omit<TAssistant, 'key'>
  ) => {
    const assistants = await getAssistants();
    const newAssistants = assistants.map((assistant) => {
      if (assistant.key === assistantKey) {
        return { ...assistant, ...newAssistant };
      }
      return assistant;
    });
    set('assistants', newAssistants);
  };

  const assistantsQuery = useQuery({
    queryKey: ['assistants'],
    queryFn: getAssistants,
  });

  const createAssistantMutation = useMutation({
    mutationFn: createAssistant,
    onSuccess: () => {
      assistantsQuery.refetch();
    },
  });

  const deleteAssistantMutation = useMutation({
    mutationFn: deleteAssistant,
    onSuccess: () => {
      assistantsQuery.refetch();
    },
  });

  const updateAssistantMutation = useMutation({
    mutationFn: ({
      assistantKey,
      newAssistant,
    }: {
      assistantKey: string;
      newAssistant: Omit<TAssistant, 'key'>;
    }) => updateAssistant(assistantKey, newAssistant),
    onSuccess: () => {
      assistantsQuery.refetch();
    },
  });
  return {
    getAssistants,
    createAssistant,
    updateAssistant,
    assistantsQuery,
    createAssistantMutation,
    updateAssistantMutation,
    deleteAssistantMutation,
  };
};
