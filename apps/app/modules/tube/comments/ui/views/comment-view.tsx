import { CommentSection } from '@/modules/tube/comments/ui/sections/comment-section';

export const CommentView = ({
  organizationId,
}: {
  organizationId: string;
}) => {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex-1 overflow-auto px-4 pb-8">
        <CommentSection organizationId={organizationId} />
      </div>
    </div>
  );
};
