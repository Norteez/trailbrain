import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function setValue(value) {
    setStoredValue(value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('localStorage write failed:', err);
    }
  }

  return [storedValue, setValue];
}
