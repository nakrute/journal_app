import { ADMIN_HANDLES } from "../constants/app";
import { FEATURE_FLAGS } from "../constants/featureFlags";

export function isAdminProfile(profile) {
  const handle = profile?.handle?.trim().toLowerCase();
  return FEATURE_FLAGS.debugTools && ADMIN_HANDLES.includes(handle);
}
