"use client";
import { DEFAULT_STORAGE, LocalStorageContextValue, StorageData} from '@/types';
import useLocalStorage from '@/hooks/context/useLocalStorage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const LocalStorageContext = createContext<LocalStorageContextValue | undefined>(undefined);

export const LocalStorageProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const settingsStorage = useLocalStorage('settings');
  const profileStorage = useLocalStorage('profile');
  const [ready, setReady] = useState(false);

  const cycleTheme = () => {
    const themes = ['light', 'dark'] as const;
    const current = settingsStorage.data.theme;
    const currentIndex = themes.indexOf(current as typeof themes[number]);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    settingsStorage.update({ theme: nextTheme });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const { theme } = settingsStorage.data;
    const classList = document.documentElement.classList;
    const themeClasses = ["light", "dark"];
    themeClasses.forEach((c) => classList.remove(c));
    classList.add(theme);
  }, [settingsStorage.data.theme]);

  const value: LocalStorageContextValue = {
    settings: { ...DEFAULT_STORAGE.settings, ...settingsStorage.data },
    setSettings: settingsStorage.set,
    updateSettings: settingsStorage.update,
    removeSettings: settingsStorage.remove,
    resetSettings: settingsStorage.reset,
    profile: { ...DEFAULT_STORAGE.profile, ...profileStorage.data },
    setProfile: profileStorage.set,
    updateProfile: profileStorage.update,
    removeProfile: profileStorage.remove,
    resetProfile: profileStorage.reset,
    cycleTheme,
    ready
  };

  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export function useLocalStorageContext() {
  const context = useContext(LocalStorageContext);
  if (!context) throw new Error('LocalStorageContext must be used within LocalStorageProvider');
  return context;
}