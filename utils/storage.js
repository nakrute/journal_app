import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_VERSION = 2;
const STORAGE_VERSION_KEY = "voiceReal.storageVersion";

export async function ensureStorageVersion() {
  const storedVersion = Number(await AsyncStorage.getItem(STORAGE_VERSION_KEY) || 0);
  if (storedVersion === STORAGE_VERSION) return { migrated: false, version: STORAGE_VERSION };

  if (storedVersion < 1) {
    await AsyncStorage.setItem("voiceReal.hasSeenOnboarding", "false");
  }

  await AsyncStorage.setItem(STORAGE_VERSION_KEY, String(STORAGE_VERSION));
  return { migrated: true, version: STORAGE_VERSION };
}

export async function resetLocalStorage(keysToKeep = []) {
  const keys = await AsyncStorage.getAllKeys();
  const voiceRealKeys = keys.filter((key) => key.startsWith("voiceReal.") && !keysToKeep.includes(key));
  await AsyncStorage.multiRemove(voiceRealKeys);
  await AsyncStorage.setItem(STORAGE_VERSION_KEY, String(STORAGE_VERSION));
}
