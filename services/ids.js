export function createLocalId(prefix) {
  return `${prefix}-${Date.now()}`;
}

export function createTimestamp() {
  return new Date().toISOString();
}
