import { Mdx } from '@/app/(authenticated)/chat/components/mdx';
import { usePreferenceContext } from '@/context/preferences';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FormLabel } from '@repo/design-system/components/ui/form-label';
import { Input } from '@repo/design-system/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { useToast } from '@repo/design-system/hooks/use-toast';
import { useEffect, useState } from 'react';

export const OllamaSettings = () => {
  const [url, setURL] = useState<string>('');
  const { preferences, updatePreferences } = usePreferenceContext();
  const { toast } = useToast();

  useEffect(() => {
    setURL(preferences.ollamaBaseUrl);
  }, [preferences]);

  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setURL(e.target.value);
  };

  const verifyAndSaveURL = async () => {
    try {
      const response = await fetch(url + '/api/tags');
      if (response.status === 200) {
        console.log(response);
        toast({
          title: 'Success',
          description: 'Ollama server endpoint is valid',
        });
        updatePreferences({ ollamaBaseUrl: url });
      } else {
        throw new Error('Response status is not 200');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Invalid Ollama server endpoint',
        variant: 'destructive',
      });
    }
  };

  const macosOllamaConfig = `
#### Step 1: Install and Launch Ollama Locally

Ensure you have Ollama installed on your machine. If you haven't downloaded it yet, please visit the [official website](#) to get started.

#### Step 2: Set Up Cross-Origin Access for Ollama

To ensure proper functionality, you'll need to configure cross-origin settings due to browser security policies.

1. Open the **Terminal** application.
2. Enter the following command and press **Enter**:

   \`\`\`bash
   launchctl setenv OLLAMA_ORIGINS "*"
   \`\`\`
  `;

  const windowsOllamaConfig = `
  #### Step 1: Install and Start Ollama Locally

  Please make sure you have enabled Ollama. If you haven't downloaded Ollama yet, please visit the [official website](https://ollama.com/download) to download.
  
  #### Step 2: Configure Ollama for Cross-Origin Access
  
  Due to browser security restrictions, you need to configure cross-origin settings for Ollama to function properly.
  
  1. On Windows, go to **Control Panel** and edit system environment variables.
  2. Create a new environment variable named \`OLLAMA_ORIGINS\` for your user account.
  3. Set the value to \`*\`, and click **OK/Apply** to save.
  
  Please restart the Ollama service after completion.
  `;

  const tabConfigs = [
    { value: 'macos', label: 'Macos', message: macosOllamaConfig },
    { value: 'windows', label: 'Windows', message: windowsOllamaConfig },
  ];

  return (
    <Flex direction="col" gap="sm">
      <FormLabel label="Ollama local server URL" />
      <Input
        placeholder="http://localhost:11434"
        value={url}
        autoComplete="off"
        onChange={handleURLChange}
      />

      <Button size="sm" variant="default" onClick={verifyAndSaveURL}>
        Check Connection
      </Button>

      <Tabs defaultValue="macos" className="mt-2 w-full">
        <TabsList className="grid w-full grid-cols-2">
          {tabConfigs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabConfigs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="pb-4">
            <Mdx
              message={tab.message}
              animate={false}
              messageId="ollama-config"
              size="sm"
            />
          </TabsContent>
        ))}
      </Tabs>
    </Flex>
  );
};
