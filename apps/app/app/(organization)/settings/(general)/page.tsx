import { currentOrganizationId } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { schema } from '@repo/backend/schema';
import { Prose } from '@repo/design-system/components/prose';
import { StackCard } from '@repo/design-system/components/stack-card';
import { createMetadata } from '@repo/seo/metadata';
import { eq } from 'drizzle-orm';
import { BookIcon, BuildingIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { OrganizationDetailsForm } from './components/organization-details-form';
import { OrganizationLogoForm } from './components/organization-logo-form';
import { ProductDescriptionForm } from './components/product-description-form';

export const metadata: Metadata = createMetadata({
  title: 'General Settings',
  description: 'General settings for your organization.',
});

const GeneralSettings = async () => {
  const organizationId = await currentOrganizationId();

  if (!organizationId) {
    notFound();
  }

  const organization = await database
    .select({
      name: schema.organization.name,
      slug: schema.organization.slug,
      productDescription: schema.organization.productDescription,
      logoUrl: schema.organization.logoUrl,
    })
    .from(schema.organization)
    .where(eq(schema.organization.id, organizationId));

  if (!organization) {
    notFound();
  }

  return (
    <div className="px-6 py-16">
      <Prose className="mx-auto grid w-full max-w-3xl gap-6">
        <div>
          <h1 className="m-0 font-semibold text-4xl">Settings</h1>
          <p className="mt-2 mb-0 text-muted-foreground">
            Manage your organization&apos;s settings.
          </p>
        </div>
        <StackCard
          title="Organization Details"
          icon={BuildingIcon}
          className="flex items-start gap-8"
        >
          <OrganizationDetailsForm
            defaultName={organization[0].name}
            defaultSlug={organization[0].slug}
          />
          <div>
            <div className="relative aspect-square overflow-hidden overflow-hidden rounded-xl">
              <OrganizationLogoForm organizationId={organizationId} />
              {organization[0].logoUrl && (
                <Image
                  src={organization[0].logoUrl}
                  alt="Organization Logo"
                  width={100}
                  height={100}
                  className="pointer-events-none absolute inset-0 m-0 h-full w-full object-cover"
                />
              )}
            </div>
            {organization[0].logoUrl && (
              <p className="mt-1 text-center text-muted-foreground text-xs">
                Click or drag-and-drop to change
              </p>
            )}
          </div>
        </StackCard>
        <StackCard title="Product Description" icon={BookIcon}>
          <p className="text-muted-foreground text-sm">
            By telling us about your product and its users, our AI can help you
            triage and prioritize your feedback.
          </p>
          <ProductDescriptionForm
            defaultValue={organization[0].productDescription ?? ''}
          />
        </StackCard>
      </Prose>
    </div>
  );
};

export default GeneralSettings;
