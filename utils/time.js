export function formatMillis(value) {
  const totalSeconds = Math.max(0, Math.floor((value || 0) / 1000));
  return formatSeconds(totalSeconds);
}

export function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function getPlaybackProgress(status) {
  if (!status.durationMillis) return 0;
  return Math.min(100, Math.max(0, (status.positionMillis / status.durationMillis) * 100));
}
