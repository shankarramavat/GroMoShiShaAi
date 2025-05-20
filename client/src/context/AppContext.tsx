import { createContext, useContext, useState, ReactNode } from "react";

type Tab = "dashboard" | "leads" | "ai-coach" | "community";

interface AppContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const value = {
    activeTab,
    setActiveTab,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
