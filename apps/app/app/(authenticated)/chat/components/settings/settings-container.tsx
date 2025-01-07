export type TSettingsContainer = {
  children: React.ReactNode;
  title: string;
};

export const SettingsContainer = ({ title, children }: TSettingsContainer) => {
  return (
    <div className="flex flex-col items-start gap-2 px-3 md:px-5">
      <p className="pt-4 pb-2 font-medium text-xl text-zinc-800 dark:text-white">
        {title}
      </p>
      {children}
    </div>
  );
};
