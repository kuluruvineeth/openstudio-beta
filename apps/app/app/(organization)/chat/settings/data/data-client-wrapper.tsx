'use client';
import { SettingCard } from '@/app/(organization)/chat/components/settings/setting-card';
import { SettingsContainer } from '@/app/(organization)/chat/components/settings/settings-container';
import { defaultPreferences } from '@/config';
import { useSessions } from '@/context';
import { usePreferenceContext } from '@/context/preferences';
import { generateAndDownloadJson } from '@/helper/utils';
import { processExport, processImport } from '@/services/export/client';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Input } from '@repo/design-system/components/ui/input';
import { Type } from '@repo/design-system/components/ui/text';
import { PopOverConfirmProvider } from '@repo/design-system/components/ui/use-confirmation-popover';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { FileDown, Paperclip } from 'lucide-react';
import type { ChangeEvent } from 'react';

export default function DataClientWrapper() {
  const { toast } = useToast();

  const { clearSessionsMutation, createSession } = useSessions();

  const { updatePreferences } = usePreferenceContext();

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        try {
          processImport(content);

          toast({
            title: 'Data Imported',
            description: 'The JSON file you uploaded has been imported',
            variant: 'default',
          });
          // window.location.reload();
        } catch (e) {
          console.error(e);
          toast({
            title: 'Invalid JSON',
            description: 'The JSON file you uploaded is invalid',
            variant: 'destructive',
          });
          return;
        }
      };
      reader.readAsText(file);
    }
  }

  return (
    <Flex direction="col" gap="xl" className="w-full">
      <SettingsContainer title="Manage your Data">
        <Flex direction="col" gap="md" className="w-full">
          <SettingCard className="py-5">
            <Flex items="center" justify="between">
              <Type textColor="primary" weight="medium">
                Clear Chat History
              </Type>
              <PopOverConfirmProvider
                title="Are you sure you want to clear entire chat history? This action cannot be undone."
                confimBtnText="Clear"
                onConfirm={() => {
                  clearSessionsMutation.mutate(undefined, {
                    onSuccess: () => {
                      toast({
                        title: 'Data Cleared',
                        description: 'All chat data has been cleared',
                        variant: 'default',
                      });
                      createSession();
                    },
                  });
                }}
              >
                <Button variant="destructive" size="sm">
                  Clear
                </Button>
              </PopOverConfirmProvider>
            </Flex>
            <div className="my-4 h-[1px] w-full bg-zinc-500/10" />
            <Flex items="center" justify="between">
              <Type textColor="primary" weight="medium">
                Reset Preferences
              </Type>
              <PopOverConfirmProvider
                title="Are you sure you want to reset all preferences? This action cannot be undone."
                confimBtnText="Reset All"
                onConfirm={(dismiss) => {
                  updatePreferences(defaultPreferences);
                  toast({
                    title: 'Reset successful',
                    description: 'All preferences have been reset',
                    variant: 'default',
                  });
                }}
              >
                <Button variant="destructive" size="sm">
                  Reset All
                </Button>
              </PopOverConfirmProvider>
            </Flex>
          </SettingCard>

          <SettingCard className="py-5">
            <Flex items="center" justify="between">
              <Flex direction="col">
                <Type textColor="primary" weight="medium">
                  Import Data
                </Type>
                <Type textColor="secondary" size="xs">
                  Import your chat data from a JSON file
                </Type>
              </Flex>
              <Input
                type="file"
                onChange={handleFileSelect}
                hidden
                className="invisible w-0"
                id="import-config"
              />
              <PopOverConfirmProvider
                title="This action will overwrite your current data. Are you sure you want to import?"
                confimBtnText="Import Data"
                confimBtnVariant="default"
                confirmIcon={Paperclip}
                onConfirm={(dismiss) => {
                  document?.getElementById('import-config')?.click();
                  dismiss();
                }}
              >
                <Button variant="outlined" size="sm">
                  <FileDown size={16} strokeWidth={2} /> Import
                </Button>
              </PopOverConfirmProvider>
            </Flex>
            <div className="my-4 h-[1px] w-full bg-zinc-500/10" />

            <Flex items="center" justify="between" className="w-full">
              <Flex direction="col">
                <Type textColor="primary" weight="medium">
                  Export Data
                </Type>
                <Type textColor="secondary" size="xs">
                  Export your chat data to a JSON file
                </Type>
              </Flex>
              <Button
                variant="outlined"
                size="sm"
                onClick={() => {
                  processExport().then((data) => {
                    generateAndDownloadJson(data, 'chathub.json');
                  });
                }}
              >
                <FileDown size={16} strokeWidth={2} /> Export
              </Button>
            </Flex>
          </SettingCard>
        </Flex>
      </SettingsContainer>
    </Flex>
  );
}
