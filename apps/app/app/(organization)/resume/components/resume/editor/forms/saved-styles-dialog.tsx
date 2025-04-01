import type { DocumentSettings } from '@/types';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';
import { Check, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SavedStylesDialogProps {
  currentSettings: DocumentSettings;
  onApplyStyle: (settings: DocumentSettings) => void;
}

interface SavedStyle {
  name: string;
  settings: DocumentSettings;
  timestamp: number;
}

export function SavedStylesDialog({
  currentSettings,
  onApplyStyle,
}: SavedStylesDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [savedStyles, setSavedStyles] = useState<SavedStyle[]>([]);
  const [newStyleName, setNewStyleName] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Load saved styles from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('openstudioresume-saved-styles');
    if (saved) {
      setSavedStyles(JSON.parse(saved));
    }
  }, []);

  // Save current settings with name
  const handleSaveStyle = () => {
    if (!newStyleName.trim()) return;

    const newStyle: SavedStyle = {
      name: newStyleName,
      settings: currentSettings,
      timestamp: Date.now(),
    };

    const updatedStyles = [...savedStyles, newStyle];
    setSavedStyles(updatedStyles);
    localStorage.setItem(
      'openstudioresume-saved-styles',
      JSON.stringify(updatedStyles)
    );
    setNewStyleName('');
    setIsAddingNew(false);
  };

  // Delete a saved style
  const handleDeleteStyle = (timestamp: number) => {
    const updatedStyles = savedStyles.filter(
      (style) => style.timestamp !== timestamp
    );
    setSavedStyles(updatedStyles);
    localStorage.setItem(
      'openstudioresume-saved-styles',
      JSON.stringify(updatedStyles)
    );
  };

  // Apply a saved style
  const handleApplyStyle = (settings: DocumentSettings) => {
    onApplyStyle(settings);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:-translate-y-[1px] w-full border-teal-600 bg-white/80 from-teal-500/10 to-cyan-500/10 text-teal-700 text-xs shadow-sm backdrop-blur-sm transition-all duration-500 hover:border-teal-800 hover:bg-gradient-to-r hover:text-teal-800 hover:shadow-md"
        >
          <Save className="mr-1 h-3 w-3" />
          Saved Styles
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/60 bg-gradient-to-b from-white/95 to-white/90 pt-12 shadow-2xl backdrop-blur-2xl sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text font-semibold text-transparent text-xl">
              Saved Document Styles
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingNew(true)}
              className="hover:-translate-y-[1px] border-teal-600/40 bg-gradient-to-r text-teal-700 text-xs transition-all duration-500 hover:border-teal-600 hover:from-teal-500/10 hover:to-cyan-500/10 hover:text-teal-800"
            >
              <Plus className="mr-1 h-3 w-3" />
              Save Current
            </Button>
          </div>
          <DialogDescription className="text-slate-600">
            Save current document settings or apply saved styles to your resume.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isAddingNew && (
            <div className="flex items-center gap-2 rounded-xl border border-teal-200/30 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 p-4 shadow-sm">
              <Input
                placeholder="Enter style name..."
                value={newStyleName}
                onChange={(e) => setNewStyleName(e.target.value)}
                className="flex-1 border-teal-200/40 bg-white/80 focus:border-teal-400"
                autoFocus
              />
              <Button
                onClick={handleSaveStyle}
                disabled={!newStyleName.trim()}
                size="sm"
                className="hover:-translate-y-[1px] whitespace-nowrap bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm transition-all duration-500 hover:from-teal-700 hover:to-cyan-700 hover:shadow-md"
              >
                Save Style
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingNew(false);
                  setNewStyleName('');
                }}
                className="text-slate-600 hover:text-slate-800"
              >
                Cancel
              </Button>
            </div>
          )}
          <div className={isAddingNew ? '' : 'border-teal-100 border-t pt-4'}>
            <Label className="mb-2 block font-medium text-slate-700 text-sm">
              Saved Styles
            </Label>
            <ScrollArea className="h-[300px] rounded-xl border border-teal-200/30 bg-gradient-to-b from-white/50 to-white/30 backdrop-blur-sm">
              <div className="space-y-3 p-4">
                {savedStyles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <Save className="mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">No saved styles yet</p>
                  </div>
                ) : (
                  savedStyles.map((style) => (
                    <div
                      key={style.timestamp}
                      className="group hover:-translate-y-[1px] flex items-center justify-between rounded-xl border border-teal-600 p-3 transition-all duration-500 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/50 hover:shadow-sm"
                    >
                      <span className="font-medium text-slate-700 text-sm">
                        {style.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApplyStyle(style.settings)}
                          className="text-teal-600 opacity-0 transition-all duration-300 hover:bg-teal-50 hover:text-teal-700 group-hover:opacity-100"
                          title="Apply Style"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteStyle(style.timestamp)}
                          className="text-rose-500 opacity-0 transition-all duration-300 hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                          title="Delete Style"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="hover:-translate-y-[1px] border-teal-200/40 text-teal-700 transition-all duration-500 hover:border-teal-400 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 hover:text-teal-800"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
