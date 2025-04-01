import type { DocumentSettings } from '@/types';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@repo/design-system/components/ui/card';
import { Label } from '@repo/design-system/components/ui/label';
import { Slider } from '@repo/design-system/components/ui/slider';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LayoutTemplate } from 'lucide-react';
import { SavedStylesDialog } from './saved-styles-dialog';

interface DocumentSettingsFormProps {
  // resume: Resume;
  documentSettings: DocumentSettings;
  onChange: (field: 'document_settings', value: DocumentSettings) => void;
}

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

function NumberInput({ value, onChange, min, max, step }: NumberInputProps) {
  const increment = () => {
    const newValue = Math.min(max, value + step);
    onChange(Number(newValue.toFixed(2)));
  };

  const decrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(Number(newValue.toFixed(2)));
  };

  const displayValue = Number(value.toFixed(2));

  return (
    <div className="flex items-center space-x-1">
      <span className="w-8 text-muted-foreground/60 text-xs">
        {displayValue}
      </span>
      <div className="flex flex-col">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-4 w-4 hover:bg-slate-100"
          onClick={increment}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-4 w-4 hover:bg-slate-100"
          onClick={decrement}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export function DocumentSettingsForm({
  documentSettings,
  onChange,
}: DocumentSettingsFormProps) {
  const defaultSettings = {
    // Global Settings
    document_font_size: 10,
    document_line_height: 1.5,
    document_margin_vertical: 36,
    document_margin_horizontal: 36,

    // Header Settings
    header_name_size: 24,
    header_name_bottom_spacing: 24,

    // Skills Section
    skills_margin_top: 2,
    skills_margin_bottom: 2,
    skills_margin_horizontal: 0,
    skills_item_spacing: 2,

    // Experience Section
    experience_margin_top: 2,
    experience_margin_bottom: 2,
    experience_margin_horizontal: 0,
    experience_item_spacing: 4,

    // Projects Section
    projects_margin_top: 2,
    projects_margin_bottom: 2,
    projects_margin_horizontal: 0,
    projects_item_spacing: 4,

    // Education Section
    education_margin_top: 2,
    education_margin_bottom: 2,
    education_margin_horizontal: 0,
    education_item_spacing: 4,
  };

  // Initialize document_settings if it doesn't exist
  if (!documentSettings) {
    onChange('document_settings', defaultSettings);
    return null; // Return null while initializing to prevent errors
  }

  const handleSettingsChange = (newSettings: DocumentSettings) => {
    onChange('document_settings', newSettings);
  };

  const handleFontSizeChange = (value: number) => {
    const newSettings: DocumentSettings = {
      ...documentSettings, // Don't spread defaultSettings here
      document_font_size: value,
    };
    handleSettingsChange(newSettings);
  };

  const SectionSettings = ({
    title,
    section,
  }: {
    title: string;
    section: 'skills' | 'experience' | 'projects' | 'education';
  }) => (
    <div className="space-y-4 rounded-lg border border-slate-200/50 bg-slate-50/50">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-medium text-muted-foreground text-sm">
            Space Above {title} Section
          </Label>
          <div className="flex items-center">
            <NumberInput
              value={documentSettings?.[`${section}_margin_top`] ?? 2}
              min={0}
              max={48}
              step={1}
              onChange={(value) =>
                handleSettingsChange({
                  ...documentSettings,
                  [`${section}_margin_top`]: value,
                })
              }
            />
            <span className="ml-1 text-muted-foreground/60 text-xs">pt</span>
          </div>
        </div>
        <Slider
          value={[Number(documentSettings?.[`${section}_margin_top`] ?? 2)]}
          min={0}
          max={48}
          step={1}
          onValueChange={([value]) =>
            handleSettingsChange({
              ...documentSettings,
              [`${section}_margin_top`]: value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-medium text-muted-foreground text-sm">
            Space Below {title} Section
          </Label>
          <div className="flex items-center">
            <NumberInput
              value={documentSettings?.[`${section}_margin_bottom`] ?? 2}
              min={0}
              max={48}
              step={1}
              onChange={(value) =>
                handleSettingsChange({
                  ...documentSettings,
                  [`${section}_margin_bottom`]: value,
                })
              }
            />
            <span className="ml-1 text-muted-foreground/60 text-xs">pt</span>
          </div>
        </div>
        <Slider
          value={[Number(documentSettings?.[`${section}_margin_bottom`] ?? 2)]}
          min={0}
          max={48}
          step={1}
          onValueChange={([value]) =>
            handleSettingsChange({
              ...documentSettings,
              [`${section}_margin_bottom`]: value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-medium text-muted-foreground text-sm">
            Horizontal Margins
          </Label>
          <div className="flex items-center">
            <NumberInput
              value={documentSettings?.[`${section}_margin_horizontal`] ?? 0}
              min={0}
              max={72}
              step={2}
              onChange={(value) =>
                handleSettingsChange({
                  ...documentSettings,
                  [`${section}_margin_horizontal`]: value,
                })
              }
            />
            <span className="ml-1 text-muted-foreground/60 text-xs">pt</span>
          </div>
        </div>
        <Slider
          value={[
            Number(documentSettings?.[`${section}_margin_horizontal`] ?? 0),
          ]}
          min={0}
          max={72}
          step={2}
          onValueChange={([value]) =>
            handleSettingsChange({
              ...documentSettings,
              [`${section}_margin_horizontal`]: value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-medium text-muted-foreground text-sm">
            Space Between Items
          </Label>
          <div className="flex items-center">
            <NumberInput
              value={documentSettings?.[`${section}_item_spacing`] ?? 4}
              min={0}
              max={16}
              step={0.5}
              onChange={(value) =>
                handleSettingsChange({
                  ...documentSettings,
                  [`${section}_item_spacing`]: value,
                })
              }
            />
            <span className="ml-1 text-muted-foreground/60 text-xs">pt</span>
          </div>
        </div>
        <Slider
          value={[Number(documentSettings?.[`${section}_item_spacing`] ?? 4)]}
          min={0}
          max={16}
          step={0.5}
          onValueChange={([value]) =>
            handleSettingsChange({
              ...documentSettings,
              [`${section}_item_spacing`]: value,
            })
          }
        />
      </div>
    </div>
  );

  return (
    <div className="">
      <Card className="">
        {/* Buttons */}
        <CardHeader className="flex flex-col space-y-4">
          <div className="flex w-full items-center space-x-2">
            <SavedStylesDialog
              currentSettings={documentSettings || defaultSettings}
              onApplyStyle={(settings) => handleSettingsChange(settings)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSettingsChange({ ...defaultSettings })}
              className="group relative h-60 overflow-hidden border-slate-200 p-0 transition-colors hover:border-teal-600/40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex h-full w-full flex-col items-center">
                <div className="w-full border-slate-200 border-b bg-slate-50/80 p-2 font-medium text-teal-600 text-xs">
                  <LayoutTemplate className="mr-1 inline-block h-3 w-3" />
                  Default Layout
                </div>
                <div className="flex w-full flex-1 flex-col justify-between p-2">
                  {/* Mock resume content - Default */}
                  <div>
                    <div className="mb-6 h-2 w-3/4 rounded bg-slate-300" />
                    <div className="mb-4 flex space-x-2">
                      <div className="h-1 w-1/3 rounded bg-slate-300" />
                      <div className="h-1 w-1/3 rounded bg-slate-300" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-1.5 w-1/3 rounded bg-slate-300" />
                      <div className="space-y-1.5">
                        <div className="h-1 w-full rounded bg-slate-300" />
                        <div className="h-1 w-11/12 rounded bg-slate-300" />
                        <div className="h-1 w-10/12 rounded bg-slate-300" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-1.5 w-1/3 rounded bg-slate-300" />
                      <div className="space-y-1.5">
                        <div className="h-1 w-full rounded bg-slate-300" />
                        <div className="h-1 w-11/12 rounded bg-slate-300" />
                        <div className="h-1 w-10/12 rounded bg-slate-300" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-1.5 w-1/3 rounded bg-slate-300" />
                      <div className="space-y-1.5">
                        <div className="h-1 w-full rounded bg-slate-300" />
                        <div className="h-1 w-11/12 rounded bg-slate-300" />
                        <div className="h-1 w-10/12 rounded bg-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleSettingsChange({
                  ...documentSettings,
                  footer_width: 0,
                  show_osr_footer: false,
                  header_name_size: 24,
                  skills_margin_top: 0,
                  document_font_size: 10,
                  projects_margin_top: 0,
                  skills_item_spacing: 0,
                  document_line_height: 1.2,
                  education_margin_top: 0,
                  skills_margin_bottom: 2,
                  experience_margin_top: 2,
                  projects_item_spacing: 0,
                  education_item_spacing: 0,
                  projects_margin_bottom: 0,
                  education_margin_bottom: 0,
                  experience_item_spacing: 1,
                  document_margin_vertical: 20,
                  experience_margin_bottom: 0,
                  skills_margin_horizontal: 0,
                  document_margin_horizontal: 28,
                  header_name_bottom_spacing: 16,
                  projects_margin_horizontal: 0,
                  education_margin_horizontal: 0,
                  experience_margin_horizontal: 0,
                })
              }
              className="group relative h-60 overflow-hidden border-slate-200 p-0 transition-colors hover:border-pink-600/40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-rose-50/50 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex h-full w-full flex-col items-center">
                <div className="w-full border-slate-200 border-b bg-slate-50/80 p-2 font-medium text-pink-600 text-xs">
                  <LayoutTemplate className="mr-1 inline-block h-3 w-3" />
                  Compact Layout
                </div>
                <div className="flex w-full flex-1 flex-col justify-start space-y-2 p-2">
                  {/* Mock resume content - Compact */}
                  <div>
                    <div className="mb-3 h-2 w-2/3 rounded bg-slate-300" />
                    <div className="mb-2 flex space-x-1.5">
                      <div className="h-1 w-1/4 rounded bg-slate-300" />
                      <div className="h-1 w-1/4 rounded bg-slate-300" />
                      <div className="h-1 w-1/4 rounded bg-slate-300" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="h-1.5 w-1/4 rounded bg-slate-300" />
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded bg-slate-300" />
                        <div className="h-1 w-11/12 rounded bg-slate-300" />
                        <div className="h-1 w-10/12 rounded bg-slate-300" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="h-1.5 w-1/4 rounded bg-slate-300" />
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded bg-slate-300" />
                        <div className="h-1 w-11/12 rounded bg-slate-300" />
                        <div className="h-1 w-10/12 rounded bg-slate-300" />
                        <div className="h-1 w-9/12 rounded bg-slate-300" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="h-1.5 w-1/4 rounded bg-slate-300" />
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded bg-slate-300" />
                        <div className="h-1 w-11/12 rounded bg-slate-300" />
                        <div className="h-1 w-9/12 rounded bg-slate-300" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="h-1.5 w-1/4 rounded bg-slate-300" />
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded bg-slate-300" />
                        <div className="h-1 w-11/12 rounded bg-slate-300" />
                        <div className="h-1 w-9/12 rounded bg-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Global Document Settings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text font-semibold text-base text-transparent">
                Document
              </Label>
              <div className="mx-4 h-[1px] flex-1 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>

            <div className="space-y-4 rounded-lg border border-slate-200/50 bg-slate-50/50 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-muted-foreground text-sm">
                    Font Size
                  </Label>
                  <div className="flex items-center">
                    <NumberInput
                      value={documentSettings?.document_font_size ?? 10}
                      min={8}
                      max={12}
                      step={0.5}
                      onChange={handleFontSizeChange}
                    />
                    <span className="ml-1 text-muted-foreground/60 text-xs">
                      pt
                    </span>
                  </div>
                </div>
                <Slider
                  value={[documentSettings?.document_font_size ?? 10]}
                  min={8}
                  max={12}
                  step={0.5}
                  onValueChange={([value]) =>
                    handleSettingsChange({
                      ...documentSettings,
                      document_font_size: value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-muted-foreground text-sm">
                    Line Height
                  </Label>
                  <div className="flex items-center">
                    <NumberInput
                      value={documentSettings?.document_line_height ?? 1.5}
                      min={1}
                      max={2}
                      step={0.1}
                      onChange={(value) =>
                        handleSettingsChange({
                          ...documentSettings,
                          document_line_height: value,
                        })
                      }
                    />
                    <span className="ml-1 text-muted-foreground/60 text-xs">
                      x
                    </span>
                  </div>
                </div>
                <Slider
                  value={[documentSettings?.document_line_height ?? 1.5]}
                  min={1}
                  max={2}
                  step={0.1}
                  onValueChange={([value]) =>
                    handleSettingsChange({
                      ...documentSettings,
                      document_line_height: value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-muted-foreground text-sm">
                    Vertical Margins
                  </Label>
                  <div className="flex items-center">
                    <NumberInput
                      value={documentSettings?.document_margin_vertical ?? 36}
                      min={18}
                      max={108}
                      step={2}
                      onChange={(value) =>
                        handleSettingsChange({
                          ...documentSettings,
                          document_margin_vertical: value,
                        })
                      }
                    />
                    <span className="ml-1 text-muted-foreground/60 text-xs">
                      pt
                    </span>
                  </div>
                </div>
                <Slider
                  value={[documentSettings?.document_margin_vertical ?? 36]}
                  min={18}
                  max={108}
                  step={2}
                  onValueChange={([value]) =>
                    handleSettingsChange({
                      ...documentSettings,
                      document_margin_vertical: value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-muted-foreground text-sm">
                    Horizontal Margins
                  </Label>
                  <div className="flex items-center">
                    <NumberInput
                      value={documentSettings?.document_margin_horizontal ?? 36}
                      min={18}
                      max={108}
                      step={2}
                      onChange={(value) =>
                        handleSettingsChange({
                          ...documentSettings,
                          document_margin_horizontal: value,
                        })
                      }
                    />
                    <span className="ml-1 text-muted-foreground/60 text-xs">
                      pt
                    </span>
                  </div>
                </div>
                <Slider
                  value={[documentSettings?.document_margin_horizontal ?? 36]}
                  min={18}
                  max={108}
                  step={2}
                  onValueChange={([value]) =>
                    handleSettingsChange({
                      ...documentSettings,
                      document_margin_horizontal: value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Header Settings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text font-semibold text-base text-transparent">
                Header
              </Label>
              <div className="mx-4 h-[1px] flex-1 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>

            <div className="space-y-4 rounded-lg border border-slate-200/50 bg-slate-50/50 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-muted-foreground text-sm">
                    Name Size
                  </Label>
                  <div className="flex items-center">
                    <NumberInput
                      value={documentSettings?.header_name_size ?? 24}
                      min={0}
                      max={40}
                      step={1}
                      onChange={(value) =>
                        handleSettingsChange({
                          ...documentSettings,
                          header_name_size: value,
                        })
                      }
                    />
                    <span className="ml-1 text-muted-foreground/60 text-xs">
                      pt
                    </span>
                  </div>
                </div>
                <Slider
                  value={[documentSettings?.header_name_size ?? 24]}
                  min={0}
                  max={40}
                  step={1}
                  onValueChange={([value]) =>
                    handleSettingsChange({
                      ...documentSettings,
                      header_name_size: value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium text-muted-foreground text-sm">
                    Space Below Name
                  </Label>
                  <div className="flex items-center">
                    <NumberInput
                      value={documentSettings?.header_name_bottom_spacing ?? 24}
                      min={0}
                      max={50}
                      step={1}
                      onChange={(value) =>
                        handleSettingsChange({
                          ...documentSettings,
                          header_name_bottom_spacing: value,
                        })
                      }
                    />
                    <span className="ml-1 text-muted-foreground/60 text-xs">
                      pt
                    </span>
                  </div>
                </div>
                <Slider
                  value={[documentSettings?.header_name_bottom_spacing ?? 24]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={([value]) =>
                    handleSettingsChange({
                      ...documentSettings,
                      header_name_bottom_spacing: value,
                    })
                  }
                />
                <div className="mt-1 flex justify-between">
                  <span className="text-[10px] text-muted-foreground/40">
                    Compact
                  </span>
                  <span className="text-[10px] text-muted-foreground/40">
                    Spacious
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text font-semibold text-base text-transparent">
                Skills
              </Label>
              <div className="mx-4 h-[1px] flex-1 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>
            <SectionSettings title="Skills" section="skills" />
          </div>

          {/* Experience Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text font-semibold text-base text-transparent">
                Experience
              </Label>
              <div className="mx-4 h-[1px] flex-1 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>
            <SectionSettings title="Experience" section="experience" />
          </div>

          {/* Projects Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text font-semibold text-base text-transparent">
                Projects
              </Label>
              <div className="mx-4 h-[1px] flex-1 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>
            <SectionSettings title="Projects" section="projects" />
          </div>

          {/* Education Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text font-semibold text-base text-transparent">
                Education
              </Label>
              <div className="mx-4 h-[1px] flex-1 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>
            <SectionSettings title="Education" section="education" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
