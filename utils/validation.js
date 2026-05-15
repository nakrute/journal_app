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

export function validateHandle(value) {
  if (!value || value.trim().length === 0) return "Choose a handle.";
  if (!/^@[a-z0-9_]{3,20}$/.test(value)) {
    return "Use 3-20 lowercase letters, numbers, or underscores.";
  }
  return null;
}

export function validateProfile(profile) {
  if (!profile.name.trim()) return "Add a display name.";
  return validateHandle(profile.handle);
}

export function validateTimeValue(value) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return "Use 24-hour time like 22:00.";
  }
  return null;
}
