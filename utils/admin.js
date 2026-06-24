import { ADMIN_HANDLES } from "../constants/app";

export function isAdminProfile(profile) {
  const handle = profile?.handle?.trim().toLowerCase();
  return ADMIN_HANDLES.includes(handle);
}
