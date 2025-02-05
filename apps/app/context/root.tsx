'use client';
import initHotjar from '@/lib/utils/hotjar';
import type { TProvider } from '@/types';

import { createContext, useContext, useEffect, useState } from 'react';

export type RootContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  isCommandSearchOpen: boolean;
  setIsCommandSearchOpen: (isCommandSearchOpen: boolean) => void;
  openApiKeyModal: boolean;
  setOpenApiKeyModal: (openApiKeyModal: boolean) => void;
  apiKeyModalProvider: TProvider | null;
  setApiKeyModalProvider: (apiKeyModalProvider: TProvider | null) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isMobileSidebarOpen: boolean) => void;
  openPricingModal: boolean;
  setOpenPricingModal: (openPricingModal: boolean) => void;
  openMessageLimitModal: boolean;
  setOpenMessageLimitModal: (openMessageLimitModal: boolean) => void;
};
export const RootContext = createContext<RootContextType | null>(null);

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    initHotjar();
  }, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandSearchOpen, setIsCommandSearchOpen] = useState(false);
  const [openApiKeyModal, setOpenApiKeyModal] = useState(false);
  const [apiKeyModalProvider, setApiKeyModalProvider] =
    useState<TProvider | null>(null);
  const [openPricingModal, setOpenPricingModal] = useState(false);
  const [openMessageLimitModal, setOpenMessageLimitModal] = useState(false);
  return (
    <RootContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        isCommandSearchOpen,
        setIsCommandSearchOpen,
        openApiKeyModal,
        setOpenApiKeyModal,
        apiKeyModalProvider,
        setApiKeyModalProvider,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        openPricingModal,
        setOpenPricingModal,
        openMessageLimitModal,
        setOpenMessageLimitModal,
      }}
    >
      {children}
    </RootContext.Provider>
  );
};

export const useRootContext = () => {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('useRootContext must be used within a RootProvider');
  }
  return context;
};
