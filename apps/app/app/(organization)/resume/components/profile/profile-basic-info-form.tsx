'use client';

import type { Profile } from '@/types';
import { Card, CardContent } from '@repo/design-system/components/ui/card';
import { Input } from '@repo/design-system/components/ui/input-v2';
import {
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';

interface ProfileBasicInfoFormProps {
  profile: Profile;
  onChange: (field: keyof Profile, value: string) => void;
}

export function ProfileBasicInfoForm({
  profile,
  onChange,
}: ProfileBasicInfoFormProps) {
  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <Card className="group relative border-2 border-teal-500/30 bg-gradient-to-r from-teal-500/5 via-teal-500/10 to-cyan-500/5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-teal-500/40 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Name Row */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="group relative flex-1">
                <div className="-translate-y-1/2 absolute top-1/2 right-3">
                  <div className="rounded-full bg-teal-100/80 p-1.5 transition-transform duration-300 group-focus-within:scale-110">
                    <User className="h-4 w-4 text-teal-600" />
                  </div>
                </div>
                <Input
                  value={profile.firstName || ''}
                  onChange={(e) => onChange('firstName', e.target.value)}
                  className="rounded-lg border-gray-200 bg-white/50 pr-12 font-semibold text-lg transition-colors placeholder:text-gray-400 hover:border-teal-500/30 hover:bg-white/60 focus:border-teal-500/40 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="First Name"
                />
                <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[10px] text-teal-700">
                  FIRST NAME
                </div>
              </div>
              <div className="group relative flex-1">
                <div className="-translate-y-1/2 absolute top-1/2 right-3">
                  <div className="rounded-full bg-teal-100/80 p-1.5 transition-transform duration-300 group-focus-within:scale-110">
                    <User className="h-4 w-4 text-teal-600" />
                  </div>
                </div>
                <Input
                  value={profile.lastName || ''}
                  onChange={(e) => onChange('lastName', e.target.value)}
                  className="rounded-lg border-gray-200 bg-white/50 pr-12 font-semibold text-lg transition-colors placeholder:text-gray-400 hover:border-teal-500/30 hover:bg-white/60 focus:border-teal-500/40 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Last Name"
                />
                <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[10px] text-teal-700">
                  LAST NAME
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="group relative flex-1">
                <div className="-translate-y-1/2 absolute top-1/2 right-3">
                  <div className="rounded-full bg-teal-100/80 p-1.5 transition-transform duration-300 group-focus-within:scale-110">
                    <Mail className="h-4 w-4 text-teal-600" />
                  </div>
                </div>
                <Input
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => onChange('email', e.target.value)}
                  className="rounded-lg border-gray-200 bg-white/50 pr-12 transition-colors placeholder:text-gray-400 hover:border-teal-500/30 hover:bg-white/60 focus:border-teal-500/40 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="email@example.com"
                />
                <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[10px] text-teal-700">
                  EMAIL
                </div>
              </div>
              <div className="group relative flex-1">
                <div className="-translate-y-1/2 absolute top-1/2 right-3">
                  <div className="rounded-full bg-teal-100/80 p-1.5 transition-transform duration-300 group-focus-within:scale-110">
                    <Phone className="h-4 w-4 text-teal-600" />
                  </div>
                </div>
                <Input
                  type="tel"
                  value={profile.phoneNumber || ''}
                  onChange={(e) => onChange('phoneNumber', e.target.value)}
                  className="rounded-lg border-gray-200 bg-white/50 pr-12 transition-colors placeholder:text-gray-400 hover:border-teal-500/30 hover:bg-white/60 focus:border-teal-500/40 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="+1 (555) 000-0000"
                />
                <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[10px] text-teal-700">
                  PHONE
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="group relative">
              <div className="-translate-y-1/2 absolute top-1/2 right-3">
                <div className="rounded-full bg-teal-100/80 p-1.5 transition-transform duration-300 group-focus-within:scale-110">
                  <MapPin className="h-4 w-4 text-teal-600" />
                </div>
              </div>
              <Input
                value={profile.location || ''}
                onChange={(e) => onChange('location', e.target.value)}
                className="rounded-lg border-gray-200 bg-white/50 pr-12 transition-colors placeholder:text-gray-400 hover:border-teal-500/30 hover:bg-white/60 focus:border-teal-500/40 focus:ring-2 focus:ring-teal-500/20"
                placeholder="City, State, Country"
              />
              <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[10px] text-teal-700">
                LOCATION
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Online Presence */}
      <Card className="group relative border-2 border-teal-500/30 bg-gradient-to-r from-teal-500/5 via-teal-500/10 to-cyan-500/5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-teal-500/40 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Website and LinkedIn */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="group relative flex-1">
                <div className="-translate-y-1/2 absolute top-1/2 right-3">
                  <div className="rounded-full bg-teal-100/80 p-1.5 transition-transform duration-300 group-focus-within:scale-110">
                    <Globe className="h-4 w-4 text-teal-600" />
                  </div>
                </div>
                <Input
                  type="url"
                  value={profile.websiteUrl || ''}
                  onChange={(e) => onChange('websiteUrl', e.target.value)}
                  className="rounded-lg border-gray-200 bg-white/50 pr-12 transition-colors placeholder:text-gray-400 hover:border-teal-500/30 hover:bg-white/60 focus:border-teal-500/40 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="https://your-website.com"
                />
                <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[10px] text-teal-700">
                  WEBSITE
                </div>
              </div>
              <div className="group relative flex-1">
                <div className="-translate-y-1/2 absolute top-1/2 right-3">
                  <div className="rounded-full bg-teal-100/80 p-1.5 transition-transform duration-300 group-focus-within:scale-110">
                    <Linkedin className="h-4 w-4 text-teal-600" />
                  </div>
                </div>
                <Input
                  type="url"
                  value={profile.linkedinUrl || ''}
                  onChange={(e) => onChange('linkedinUrl', e.target.value)}
                  className="rounded-lg border-gray-200 bg-white/50 pr-12 transition-colors placeholder:text-gray-400 hover:border-teal-500/30 hover:bg-white/60 focus:border-teal-500/40 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="https://linkedin.com/in/username"
                />
                <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[10px] text-teal-700">
                  LINKEDIN
                </div>
              </div>
            </div>

            {/* GitHub */}
            <div className="group relative">
              <div className="-translate-y-1/2 absolute top-1/2 right-3">
                <div className="rounded-full bg-teal-100/80 p-1.5 transition-transform duration-300 group-focus-within:scale-110">
                  <Github className="h-4 w-4 text-teal-600" />
                </div>
              </div>
              <Input
                type="url"
                value={profile.githubUrl || ''}
                onChange={(e) => onChange('githubUrl', e.target.value)}
                className="rounded-lg border-gray-200 bg-white/50 pr-12 transition-colors placeholder:text-gray-400 hover:border-teal-500/30 hover:bg-white/60 focus:border-teal-500/40 focus:ring-2 focus:ring-teal-500/20"
                placeholder="https://github.com/username"
              />
              <div className="-top-2.5 absolute left-2 bg-white/80 px-1 font-medium text-[10px] text-teal-700">
                GITHUB
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
