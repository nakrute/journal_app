import { useEffect, useState } from "react";
import {
  DEFAULT_BETA_ACCESS,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_SAFETY_SETTINGS
} from "../constants/app";
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
  const [storedPrivacySettings, setStoredPrivacySettings] = usePersistedState(
    "voiceReal.privacySettings",
    DEFAULT_PRIVACY_SETTINGS
  );
  const [storedSafetySettings, setStoredSafetySettings] = usePersistedState(
    "voiceReal.safetySettings",
    DEFAULT_SAFETY_SETTINGS
  );
  const [storedBetaAccess, setStoredBetaAccess] = usePersistedState(
    "voiceReal.betaAccess",
    DEFAULT_BETA_ACCESS
  );

  const privacySettings = {
    ...DEFAULT_PRIVACY_SETTINGS,
    ...storedPrivacySettings
  };
  const safetySettings = {
    ...DEFAULT_SAFETY_SETTINGS,
    ...storedSafetySettings
  };
  const betaAccess = {
    ...DEFAULT_BETA_ACCESS,
    ...storedBetaAccess
  };

  useEffect(() => {
    ensureStorageVersion()
      .catch((error) => console.warn("Storage migration failed", error))
      .finally(() => setStorageReady(true));
  }, []);

  function togglePrivacySetting(field) {
    setStoredPrivacySettings((current) => {
      const settings = {
        ...DEFAULT_PRIVACY_SETTINGS,
        ...current
      };

      return {
        ...settings,
        [field]: !settings[field]
      };
    });
  }

  function updatePrivacySetting(field, value) {
    setStoredPrivacySettings((current) => ({
      ...DEFAULT_PRIVACY_SETTINGS,
      ...current,
      [field]: value
    }));
  }

  function toggleSafetySetting(field) {
    setStoredSafetySettings((current) => {
      const settings = {
        ...DEFAULT_SAFETY_SETTINGS,
        ...current
      };

      return {
        ...settings,
        [field]: !settings[field]
      };
    });
  }

  function updateBetaAccess(nextSettings) {
    setStoredBetaAccess((current) => ({
      ...DEFAULT_BETA_ACCESS,
      ...current,
      ...nextSettings
    }));
  }

  return {
    betaAccess,
    hasSeenOnboarding,
    isDarkMode,
    privacySettings,
    profile,
    safetySettings,
    setHasSeenOnboarding,
    setIsDarkMode,
    setPrivacySettings: setStoredPrivacySettings,
    setProfile,
    setSafetySettings: setStoredSafetySettings,
    storageReady,
    togglePrivacySetting,
    toggleSafetySetting,
    updateBetaAccess,
    updatePrivacySetting
  };
}
