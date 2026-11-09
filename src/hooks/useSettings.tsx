import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type Settings } from "@/lib/settings";

interface SettingsContextValue {
  settings: Settings;
  loaded: boolean;
  updateSettings: (changes: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

// Shares the settings between screens; changes made on the settings
// screen apply to the dashboard right away and are persisted on the device
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then((stored) => {
      setSettings(stored);
      setLoaded(true);
    });
  }, []);

  const updateSettings = useCallback((changes: Partial<Settings>) => {
    setSettings((current) => {
      const next = { ...current, ...changes };
      saveSettings(next);
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loaded, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used inside SettingsProvider");
  return context;
}
