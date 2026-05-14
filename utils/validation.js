export function validateDraftPost({ capturedPhoto, voiceUri, caption }) {
  if (!capturedPhoto) {
    return "Take a photo before posting.";
  }

  if (!voiceUri) {
    return "Record a voice note before posting.";
  }

  if (caption.length > 90) {
    return "Keep the caption under 90 characters.";
  }

  return null;
}
