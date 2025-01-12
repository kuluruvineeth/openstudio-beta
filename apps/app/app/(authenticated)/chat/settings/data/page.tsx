'use client';
import { SettingCard } from '@/app/(authenticated)/chat/components/settings/setting-card';
import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { defaultPreferences } from '@/config';
import { useSessions } from '@/context';
import { usePreferenceContext } from '@/context/preferences';
import { generateAndDownloadJson } from '@/helper/utils';
import { exportService } from '@/services/export/client';
import {
  AttachmentIcon,
  FileExportIcon,
  FileImportIcon,
} from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Input } from '@repo/design-system/components/ui/input';
import { Type } from '@repo/design-system/components/ui/text';
import { PopOverConfirmProvider } from '@repo/design-system/components/ui/use-confirmation-popover';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import type { ChangeEvent } from 'react';

export default function DataSettings() {
  const { toast } = useToast();

  const { clearSessionsMutation, createSession } = useSessions();

  const {
    preferences,
    apiKeys,
    updatePreferences,
    updateApiKey,
    updateApiKeys,
  } = usePreferenceContext();

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        console.log(content);
        try {
          exportService.processImport(content);

          toast({
            title: 'Data Imported',
            description: 'The JSON file you uploaded has been imported',
            variant: 'default',
          });
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
    <SettingsContainer title="Manage your Data">
      <Flex direction="col" gap="md" className="w-full">
        <SettingCard className="p-5">
          <Flex items="center" justify="between">
            <Type textColor="primary" weight="medium">
              Clear all chat sessions
            </Type>
            <PopOverConfirmProvider
              title="Are you sure you want to clear all chat sessions? This action cannot be undone."
              confimBtnText="Clear All"
              onConfirm={() => {
                clearSessionsMutation.mutate(undefined, {
                  onSuccess: () => {
                    toast({
                      title: 'Data Cleared',
                      description: 'All chat data has been cleared',
                      variant: 'default',
                    });
                    createSession({
                      redirect: true,
                    });
                    //     dismiss();
                  },
                });
              }}
            >
              <Button variant="destructive" size="sm">
                Clear All
              </Button>
            </PopOverConfirmProvider>
          </Flex>
          <div className="my-4 h-[1px] w-full bg-zinc-500/10" />
          <Flex items="center" justify="between">
            <Type textColor="primary" weight="medium">
              Clear all chat sessions and preferences
            </Type>
            <PopOverConfirmProvider
              title="Are you sure you want to reset all chat sessions and preferences? This action cannot be undone."
              confimBtnText="Reset All"
              onConfirm={(dismiss) => {
                clearSessionsMutation.mutate(undefined, {
                  onSuccess: () => {
                    updatePreferences(defaultPreferences);
                    toast({
                      title: 'Reset successful',
                      description: 'All chat data has been reseted',
                      variant: 'default',
                    });
                    createSession({
                      redirect: true,
                    });
                    dismiss();
                  },
                });
              }}
            >
              <Button variant="destructive" size="sm">
                Reset All
              </Button>
            </PopOverConfirmProvider>
          </Flex>
        </SettingCard>

        <SettingCard className="p-5">
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
              confirmIcon={AttachmentIcon}
              onConfirm={(dismiss) => {
                document?.getElementById('import-config')?.click();
                dismiss();
              }}
            >
              <Button variant="outlined" size="sm">
                <FileImportIcon size={16} variant="solid" /> Import
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
                exportService.processExport().then((data) => {
                  generateAndDownloadJson(data, 'chats.so.json');
                });
              }}
            >
              <FileExportIcon size={16} variant="solid" /> Export
            </Button>
          </Flex>
        </SettingCard>
      </Flex>
    </SettingsContainer>
  );
}
