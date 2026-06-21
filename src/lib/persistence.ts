const createDebouncedStorage = () => {
  let writeTimeout: NodeJS.Timeout | undefined;

  return {
    getItem: (name: string): string | null => {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(name);
    },
    setItem: (name: string, value: string): void => {
      if (typeof window === 'undefined') return;
      if (writeTimeout) clearTimeout(writeTimeout);
      writeTimeout = setTimeout(() => {
        try {
          localStorage.setItem(name, value);
        } catch {
          // LocalStorage failure silently swallowed
        }
      }, 300);
    },
    removeItem: (name: string): void => {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(name);
    }
  };
};

export const debouncedLocalStorage = createDebouncedStorage();
