import * as FileSystem from "expo-file-system/legacy";

const MEDIA_DIR = `${FileSystem.documentDirectory}voice-real-media/`;

export async function preserveMedia(uri, prefix) {
  if (!uri || uri.startsWith(MEDIA_DIR)) return uri;

  await FileSystem.makeDirectoryAsync(MEDIA_DIR, { intermediates: true });
  const extension = getExtension(uri);
  const destination = `${MEDIA_DIR}${prefix}-${Date.now()}${extension}`;
  await FileSystem.copyAsync({ from: uri, to: destination });
  return destination;
}

export async function deleteMedia(uri) {
  if (!isAppOwnedMedia(uri)) return;

  const info = await FileSystem.getInfoAsync(uri);
  if (info.exists) {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
}

export async function cleanupUnusedMedia(usedUris) {
  const directoryInfo = await FileSystem.getInfoAsync(MEDIA_DIR);
  if (!directoryInfo.exists) return;

  const used = new Set(usedUris.filter(Boolean));
  const files = await FileSystem.readDirectoryAsync(MEDIA_DIR);

  await Promise.all(
    files.map((file) => {
      const uri = `${MEDIA_DIR}${file}`;
      return used.has(uri) ? Promise.resolve() : FileSystem.deleteAsync(uri, { idempotent: true });
    })
  );
}

export function isAppOwnedMedia(uri) {
  return !!uri && uri.startsWith(MEDIA_DIR);
}

function getExtension(uri) {
  const cleanUri = uri.split("?")[0];
  const match = cleanUri.match(/\.[a-zA-Z0-9]+$/);
  return match ? match[0] : ".dat";
}
