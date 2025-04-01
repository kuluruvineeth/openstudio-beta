'use client';

import type { Profile, Resume } from '@/types';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent } from '@repo/design-system/components/ui/card';
import { Input } from '@repo/design-system/components/ui/input';
import {
  Github,
  Globe,
  Linkedin,
  type LucideIcon,
  Mail,
  MapPin,
  Phone,
  User,
  UserCircle2,
} from 'lucide-react';
import { memo, useCallback } from 'react';
import { useResumeContext } from '../resume-editor-context';

interface BasicInfoFormProps {
  profile: Omit<Profile, 'rulesPrompt' | 'aiProvider' | 'aiModel' | 'aiApiKey'>;
}

function areBasicInfoPropsEqual(
  prevProps: BasicInfoFormProps,
  nextProps: BasicInfoFormProps
) {
  return prevProps.profile.id === nextProps.profile.id;
}

// Create memoized field component
const BasicInfoField = memo(function BasicInfoField({
  field,
  value,
  label,
  icon: Icon,
  placeholder,
  type = 'text',
}: {
  field: keyof Omit<Resume, 'rulesPrompt'>;
  value: string;
  label: string;
  icon: LucideIcon;
  placeholder: string;
  type?: string;
}) {
  const { dispatch } = useResumeContext();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: 'UPDATE_FIELD', field, value: e.target.value });
    },
    [dispatch, field]
  );

  return (
    <div className="group relative">
      <div className="-translate-y-1/2 absolute top-1/2 right-2.5">
        <div className="rounded-full bg-teal-100/80 p-1 transition-transform duration-300 group-focus-within:scale-110">
          <Icon className="h-3.5 w-3.5 text-teal-600" />
        </div>
      </div>
      <Input
        type={type}
        value={value || ''}
        onChange={handleChange}
        className="h-9 rounded-lg border-gray-200 bg-white/50 pr-10 text-sm transition-colors placeholder:text-gray-400 hover:border-teal-500/30 hover:bg-white/60 focus:border-teal-500/40 focus:ring-2 focus:ring-teal-500/20"
        placeholder={placeholder}
      />
      <div className="-top-2 absolute left-2 bg-white/80 px-1 font-medium text-[9px] text-teal-700">
        {label}
      </div>
    </div>
  );
});

export const BasicInfoForm = memo(function BasicInfoFormComponent({
  profile,
}: BasicInfoFormProps) {
  const { state, dispatch } = useResumeContext();
  const { resume } = state;

  const updateField = (field: keyof typeof resume, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const handleFillFromProfile = () => {
    if (!profile) return;

    // List of fields to copy from profile
    const fieldsToFill: (keyof Omit<
      Profile,
      'rulesPrompt' | 'aiProvider' | 'aiModel' | 'aiApiKey'
    >)[] = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'location',
      'websiteUrl',
      'linkedinUrl',
      'githubUrl',
    ];

    // Copy each field if it exists in the profile
    // biome-ignore lint/complexity/noForEach: <explanation>
    fieldsToFill.forEach((field) => {
      if (profile[field]) {
        updateField(field, profile[field] as string);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="group relative border border-teal-500/30 bg-gradient-to-r from-teal-500/5 via-teal-500/10 to-cyan-500/5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-teal-500/40 hover:shadow-lg">
        <CardContent className="p-3 sm:p-4">
          {profile && (
            <div className="mb-3 sm:mb-4">
              <Button
                onClick={handleFillFromProfile}
                className="hover:-translate-y-0.5 w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-sm text-white shadow-md transition-all duration-500 hover:from-teal-700 hover:to-cyan-700 hover:shadow-lg hover:shadow-teal-500/20"
              >
                <UserCircle2 className="mr-2 h-3.5 w-3.5" />
                Fill from Profile
              </Button>
            </div>
          )}

          <div className="space-y-2 sm:space-y-3">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <BasicInfoField
                field="firstName"
                value={resume.firstName}
                label="FIRST NAME"
                icon={User}
                placeholder="First Name"
              />
              <BasicInfoField
                field="lastName"
                value={resume.lastName}
                label="LAST NAME"
                icon={User}
                placeholder="Last Name"
              />
            </div>

            <BasicInfoField
              field="email"
              value={resume.email}
              label="EMAIL"
              icon={Mail}
              placeholder="email@example.com"
              type="email"
            />

            <BasicInfoField
              field="phoneNumber"
              value={resume.phoneNumber || ''}
              label="PHONE"
              icon={Phone}
              placeholder="+91 9876543210"
              type="tel"
            />

            <BasicInfoField
              field="location"
              value={resume.location || ''}
              label="LOCATION"
              icon={MapPin}
              placeholder="City, State, Country"
            />

            <div className="space-y-2 sm:space-y-3">
              <BasicInfoField
                field="websiteUrl"
                value={resume.websiteUrl || ''}
                label="WEBSITE"
                icon={Globe}
                placeholder="https://your-website.com"
                type="url"
              />

              <BasicInfoField
                field="linkedinUrl"
                value={resume.linkedinUrl || ''}
                label="LINKEDIN"
                icon={Linkedin}
                placeholder="https://linkedin.com/in/username"
                type="url"
              />

              <BasicInfoField
                field="githubUrl"
                value={resume.githubUrl || ''}
                label="GITHUB"
                icon={Github}
                placeholder="https://github.com/username"
                type="url"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}, areBasicInfoPropsEqual);
