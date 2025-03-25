'use client';

import { personas } from '@/modules/tube/automation/examples';
import { ButtonList } from '@repo/design-system/components/button-list';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';

export function PersonaDialog({
  isOpen,
  setIsOpen,
  onSelect,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSelect: (persona: string) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogTitle className="font-medium text-lg">
          Choose a persona
        </DialogTitle>

        <ButtonList
          items={Object.entries(personas).map(([id, persona]) => ({
            id,
            name: persona.label,
          }))}
          onSelect={(id) => {
            onSelect(id);
            setIsOpen(false);
          }}
          emptyMessage=""
          columns={3}
        />
      </DialogContent>
    </Dialog>
  );
}
