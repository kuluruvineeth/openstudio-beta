import { AutomationTabsSection } from '@/modules/tube/automation/ui/sections/tabs-section';

export const AutomationView = () => {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="mb-8 flex-1 overflow-y-auto px-4 pb-8">
        <AutomationTabsSection />
      </div>
    </div>
  );
};
