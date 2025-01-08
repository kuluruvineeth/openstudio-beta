import { getTestModelKey } from '@/helper/models';
import { useModelList } from '@/hooks/use-model-list';
import { modelService } from '@/services/models';
import type { TProvider } from '@/types';
import { useToast } from '@repo/design-system/hooks/use-toast';
import { useState } from 'react';

export const useLLMTest = () => {
  const { getModelByKey } = useModelList();
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(false);
  const { toast } = useToast();
  const testLLM = async (model: TProvider, apiKey?: string) => {
    try {
      const modelKey = getTestModelKey(model);

      if (!apiKey) {
        return false;
      }

      const selectedModelKey = getModelByKey(modelKey);

      if (!selectedModelKey) {
        return false;
      }

      const selectedModel = await modelService.createInstance({
        model: selectedModelKey,
        apiKey,
      });

      const data = await selectedModel
        .withListeners({
          onError: (error) => {
            console.error('error', error);
          },
        })
        .withConfig({
          recursionLimit: 2,
        })
        .invoke('This is Test Message', {
          callbacks: [
            {
              handleLLMError: (error) => {
                console.error('lll', error);
                throw new Error(error);
              },
            },
          ],
        });

      console.log(data);

      if (data) {
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const checkApiKey = async ({
    model,
    key,
    onValidated,
    onError,
  }: {
    model: TProvider;
    key: string;
    onValidated: () => void;
    onError: () => void;
  }) => {
    setIsCheckingApiKey(true);
    const isWorking = await testLLM(model, key);
    if (isWorking) {
      onValidated();
      toast({
        title: 'API Key saved successfully',
        description: 'Model is working as expected',
        variant: 'default',
      });
    } else {
      onError();
      toast({
        title: 'API Key Invalid',
        description: 'Please check your API key and try again.',
        variant: 'destructive',
      });
    }
    setIsCheckingApiKey(false);
  };

  return { testLLM, checkApiKey, isCheckingApiKey };
};
