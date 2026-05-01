import { StorageType, StorageData, DEFAULT_STORAGE } from '@/types';
import { useState, useEffect } from 'react';

function useLocalStorage<T extends StorageType>(key: T) {
  const [data, setData] = useState<StorageData[T]>(() => {
    if (typeof window === 'undefined') return DEFAULT_STORAGE[key];
    const stored = localStorage.getItem(`railx_${key}`);
    if (!stored) return DEFAULT_STORAGE[key];
    try {
      const parsed = JSON.parse(stored);
      return parsed;
    } catch {
      return DEFAULT_STORAGE[key];
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`railx_${key}`, JSON.stringify(data));
    }
  }, [key, data]);

  const update = (patch: Partial<StorageData[T]> | ((prev: StorageData[T]) => StorageData[T])) => {
    setData(prev => {
      const newData = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      return newData;
    });
  };

  const remove = (fields?: (keyof StorageData[T])[]) => {
    setData(prev => {
      if (!fields) return DEFAULT_STORAGE[key];
      const newData = { ...prev };
      fields.forEach(field => {
        delete newData[field];
      });
      return newData;
    });
  };

  const reset = () => {
    setData(DEFAULT_STORAGE[key]);
  };

  return {
    data,
    set: setData,
    update,
    remove,
    reset
  };
}

export default useLocalStorage;