'use client';

import { addTextToResume } from '@/actions/ai';
import type { Resume } from '@/types';
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
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { toast } from '@repo/design-system/hooks/use-toast';
import { cn } from '@repo/design-system/lib/utils';
import { Loader2, Upload } from 'lucide-react';
import { useState } from 'react';
import pdfToText from 'react-pdftotext';

interface TextImportDialogProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  trigger: React.ReactNode;
}

export function TextImportDialog({
  resume,
  onResumeChange,
  trigger,
}: TextImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
        setContent((prev) => prev + (prev ? '\n\n' : '') + text);
      } catch (err) {
        console.error('PDF processing error:', err);
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
        setContent((prev) => prev + (prev ? '\n\n' : '') + text);
      } catch (err) {
        console.error('PDF processing error:', err);
        toast({
          title: 'PDF Processing Error',
          description:
            'Failed to extract text from the PDF. Please try again or paste the content manually.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleImport = async () => {
    if (!content.trim()) {
      toast({
        title: 'No content',
        description: 'Please enter some text to import.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const updatedResume = await addTextToResume(content, resume, '');

      // Update each field of the resume
      // biome-ignore lint/complexity/noForEach: <explanation>
      (Object.keys(updatedResume) as Array<keyof Resume>).forEach((key) => {
        onResumeChange(key, updatedResume[key] as Resume[keyof Resume]);
      });

      toast({
        title: 'Import successful',
        description: 'Your resume has been updated with the imported content.',
      });
      setOpen(false);
      setContent('');
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import failed',
        description: 'Failed to process the text. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-white/40 bg-white/95 shadow-2xl backdrop-blur-xl sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-2xl text-transparent">
            Import Resume Content
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2 text-base text-muted-foreground/80">
              <p className="font-medium text-foreground">
                Choose one of these options:
              </p>
              <ol className="ml-1 list-inside list-decimal space-y-1">
                <li>
                  Upload your PDF resume by dropping it below or clicking to
                  browse
                </li>
                <li>Paste your resume text directly into the text area</li>
              </ol>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <label
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors duration-200',
              isDragging
                ? 'border-violet-500 bg-violet-50/50'
                : 'border-violet-500/80 hover:border-violet-500 hover:bg-violet-50/10'
            )}
          >
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileInput}
            />
            <Upload className="h-10 w-10 text-violet-500 transition-transform duration-200 group-hover:scale-110" />
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
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start pasting your resume content here..."
              className="min-h-[100px] border-black/40 bg-white/50 pt-4 transition-all duration-300 focus:border-violet-500/40 focus:ring-violet-500/20"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={isProcessing || !content.trim()}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Import'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
