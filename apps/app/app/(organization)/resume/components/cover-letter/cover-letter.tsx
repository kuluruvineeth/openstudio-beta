import { useResumeContext } from '@/app/(organization)/resume/components/resume/editor/resume-editor-context';
import { Button } from '@repo/design-system/components/ui/button';
import { Plus } from 'lucide-react';
import { useCallback, useRef } from 'react';
import CoverLetterEditor from './cover-letter-editor';

interface CoverLetterProps {
  containerWidth: number;
}

export default function CoverLetter({ containerWidth }: CoverLetterProps) {
  const { state, dispatch } = useResumeContext();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleContentChange = useCallback(
    (data: Record<string, unknown>) => {
      dispatch({
        type: 'UPDATE_FIELD',
        field: 'coverLetter',
        value: {
          content: data.content,
          lastUpdated: new Date().toISOString(),
        },
      });
    },
    [dispatch]
  );

  if (!state.resume.hasCoverLetter) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-emerald-600/50 text-emerald-700 hover:bg-emerald-50"
          onClick={() =>
            dispatch({
              type: 'UPDATE_FIELD',
              field: 'hasCoverLetter',
              value: true,
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Cover Letter
        </Button>
      </div>
    );
  }

  console.log('state.resume.coverLetter', state.resume.coverLetter);

  return (
    <div className="">
      {/* Print version */}
      <div
        ref={contentRef}
        id="cover-letter-content"
        className="-left-[9999px] absolute w-[816px]"
      >
        <div
          className="prose prose-sm !max-w-none p-16"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html: state.resume.coverLetter?.content || '',
          }}
        />
      </div>

      {/* Interactive editor */}
      <div className="[&_.print-hidden]:hidden">
        <CoverLetterEditor
          initialData={{ content: state.resume.coverLetter?.content || '' }}
          onChange={handleContentChange}
          containerWidth={containerWidth}
        />
      </div>

      {/* <Button
        variant="outline"
        size="sm"
        className="w-full border-blue-600/50 text-blue-700 hover:bg-blue-50"
        onClick={handleExportPDF}
      >
        <Download className="h-4 w-4 mr-2" />
        Export as PDF
      </Button> */}
    </div>
  );
}
