import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function usePersistedState(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadValue() {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        if (!isMounted) return;

        if (storedValue) {
          setValue(JSON.parse(storedValue));
        }
      } catch (error) {
        console.warn(`Could not load ${key}`, error);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    loadValue();

    return () => {
      isMounted = false;
    };
  }, [key]);

  useEffect(() => {
    if (!isLoaded) return;

    async function saveValue() {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Could not save ${key}`, error);
      }
    }

    saveValue();
  }, [isLoaded, key, value]);

  return [value, setValue, isLoaded];
}
