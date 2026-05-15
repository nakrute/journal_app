import { formatHandle } from "../screens/profile/profileUtils";

export function updateProfileField(profile, field, value) {
  return {
    ...profile,
    [field]: field === "handle" ? formatHandle(value) : value
  };
}
