import {} from '@/actions/categories';
import { ClientOnly } from '@/components/client-only';
import { SmartCategoriesOnboarding } from '@/modules/tube/smart-categories/ui/components/smart-categories-onboarding';
import { currentUser } from '@repo/backend/auth/utils';

export default async function SmartCategorizationSetupPage() {
  const user = await currentUser();
  if (!user) {
    throw new Error('Not Authenticated');
  }

  //   const [commenterCategories, commentCategories] = await Promise.all([
  //     getUserCommenterCategories(user.id),
  //     getUserCommentCategories(user.id),
  //   ]);

  return (
    <>
      {/* <SetUpCategories
        existingCommenterCategories={commenterCategories}
        existingCommentCategories={commentCategories}
      /> */}
      <ClientOnly>
        <SmartCategoriesOnboarding />
      </ClientOnly>
    </>
  );
}
