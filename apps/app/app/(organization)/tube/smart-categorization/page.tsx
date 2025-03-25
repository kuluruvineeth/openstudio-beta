import { CategorizeWithAiButton } from '@/modules/tube/smart-categories/ui/components/categorize-with-ai-button';
import { CreateCategoryButton } from '@/modules/tube/smart-categories/ui/components/create-category-button';
import { currentUser } from '@repo/backend/auth/utils';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/tabs';
import { TopBar } from '@repo/design-system/components/top-bar';
import { Button } from '@repo/design-system/components/ui/button';
import { PenIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export default async function CategoriesPage() {
  const user = await currentUser();

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="no-scrollbar mb-8 flex-1 overflow-auto px-4 pb-8">
        <Suspense>
          <Tabs defaultValue="commenter-categories">
            <TopBar className="items-center">
              <TabsList>
                <TabsTrigger value="commenter-categories">
                  Commenter Categories
                </TabsTrigger>
                <TabsTrigger value="comment-categories">
                  Comment Categories
                </TabsTrigger>
                <TabsTrigger value="uncategorized">Uncategorized</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <CategorizeWithAiButton
                  buttonProps={{
                    children: (
                      <>
                        <SparklesIcon className="mr-2 size-4" />
                        Bulk Categorize Comments
                      </>
                    ),
                    variant: 'outline',
                    size: 'sm',
                  }}
                  content="Categorize thousands of comments. This will take a few minutes."
                />
                <CategorizeWithAiButton
                  buttonProps={{
                    children: (
                      <>
                        <SparklesIcon className="mr-2 size-4" />
                        Bulk Categorize Commenters
                      </>
                    ),
                    variant: 'outline',
                    size: 'sm',
                  }}
                  content="Categorize thousands of commenters. This will take a few minutes."
                />

                <Button variant="outline" prefixIcon={PenIcon}>
                  <Link href="/smart-categories/setup">Edit</Link>
                </Button>
                <CreateCategoryButton type="comment" />
              </div>
            </TopBar>
          </Tabs>
        </Suspense>
      </div>
    </div>
  );
}
