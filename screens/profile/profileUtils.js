export function formatHandle(value) {
  const normalized = value.replace(/\s+/g, "").toLowerCase();
  if (!normalized) return "";
  return normalized.startsWith("@") ? normalized : `@${normalized}`;
}

export function getInitials(name) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return initials.toUpperCase() || "VR";
}
