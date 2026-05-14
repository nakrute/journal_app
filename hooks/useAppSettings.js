import { useEffect, useState } from "react";
import { ensureStorageVersion } from "../utils/storage";
import { usePersistedState } from "./usePersistedState";

export const defaultProfile = {
  name: "You",
  handle: "@yourmoment",
  bio: "Daily check-ins with real voice notes.",
  avatarUri: ""
};

export function useAppSettings() {
  const [storageReady, setStorageReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = usePersistedState("voiceReal.darkMode", false);
  const [profile, setProfile] = usePersistedState("voiceReal.profile", defaultProfile);
  const [hasSeenOnboarding, setHasSeenOnboarding] = usePersistedState("voiceReal.hasSeenOnboarding", false);
  const [privacySettings, setPrivacySettings] = usePersistedState("voiceReal.privacySettings", {
    allowFriendRequests: true,
    privateProfile: false,
    savePostsToArchive: true,
    muteDailyReminders: false
  });
  const [securitySettings, setSecuritySettings] = usePersistedState("voiceReal.securitySettings", {
    appLockEnabled: false,
    pin: ""
  });

  useEffect(() => {
    ensureStorageVersion()
      .catch((error) => console.warn("Storage migration failed", error))
      .finally(() => setStorageReady(true));
  }, []);

  function togglePrivacySetting(field) {
    setPrivacySettings((current) => ({
      ...current,
      [field]: !current[field]
    }));
  }

  function updateSecuritySettings(nextSettings) {
    setSecuritySettings((current) => ({
      ...current,
      ...nextSettings
    }));
  }

  return {
    hasSeenOnboarding,
    isDarkMode,
    privacySettings,
    profile,
    securitySettings,
    setHasSeenOnboarding,
    setIsDarkMode,
    setPrivacySettings,
    setProfile,
    storageReady,
    togglePrivacySetting,
    updateSecuritySettings
  };
}
