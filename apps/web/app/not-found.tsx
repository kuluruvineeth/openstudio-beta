import { EmptyState } from '@repo/design-system/components/empty-state';
import { Link } from '@repo/design-system/components/link';
import { Button } from '@repo/design-system/components/ui/button';
import { SearchIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

const NotFound = () => (
  <main className="flex min-h-screen w-screen items-center justify-center bg-backdrop">
    <EmptyState
      icon={SearchIcon}
      title="Not Found"
      description="Sorry, we couldn't find the page you were looking for! Please check the URL and try again."
    >
      <Button>
        <Link href="/">Return Home</Link>
      </Button>
    </EmptyState>
  </main>
);

export default NotFound;
