export function formatHandle(value) {
  const normalized = value.replace(/\s+/g, "").toLowerCase();
  if (!normalized) return "";
  return normalized.startsWith("@") ? normalized : `@${normalized}`;
}

export function getNameFromHandle(handle) {
  return handle.replace("@", "").replace(/^\w/, (letter) => letter.toUpperCase());
}

export function getLocalDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
