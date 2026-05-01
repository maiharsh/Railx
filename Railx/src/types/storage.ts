import { Theme } from './ui';
import { Passenger } from './models';

export interface StorageData {
  settings: {
    theme: Theme;
    notifications: boolean;
    language: string;
  };
  profile: {
    token: string | null;
    user: Passenger | null;
  };
}

export const DEFAULT_STORAGE: StorageData = {
  settings: {
    theme: 'dark',
    notifications: true,
    language: 'en'
  },
  profile: {
    token: null,
    user: null
  }
};

export type StorageType = keyof StorageData;

export type LocalStorageContextValue = {
  settings: StorageData['settings'];
  setSettings: (data: StorageData['settings']) => void;
  updateSettings: (patch: Partial<StorageData['settings']> | ((s: StorageData['settings']) => StorageData['settings'])) => void;
  removeSettings: (fields?: (keyof StorageData['settings'])[]) => void;
  resetSettings: () => void;
  profile: StorageData['profile'];
  setProfile: (data: StorageData['profile']) => void;
  updateProfile: (patch: Partial<StorageData['profile']> | ((p: StorageData['profile']) => StorageData['profile'])) => void;
  removeProfile: (fields?: (keyof StorageData['profile'])[]) => void;
  resetProfile: () => void;
  cycleTheme: () => void;
  ready: boolean;
};