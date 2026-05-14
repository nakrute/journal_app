import { getLocalDateKey } from "./formatting";

const DAILY_PROMPTS = [
  "You have two minutes to show what is real right now.",
  "No retakes. Send the room, the face, and the sound.",
  "Capture the moment before it gets polished."
];

export const DROP_WINDOW_SECONDS = 120;

export function createDailyDrop(date = new Date()) {
  const dateKey = getLocalDateKey(date);
  const promptIndex = date.getDate() % DAILY_PROMPTS.length;

  return {
    dateKey,
    prompt: DAILY_PROMPTS[promptIndex],
    startedAt: date.toISOString()
  };
}

export function getCurrentDailyDrop(storedDrop, date = new Date()) {
  const dateKey = getLocalDateKey(date);
  if (storedDrop?.dateKey === dateKey) return storedDrop;

  return createDailyDrop(date);
}

export function getDropSecondsRemaining(drop, date = new Date()) {
  if (!drop?.startedAt) return DROP_WINDOW_SECONDS;

  const elapsedSeconds = Math.floor((date.getTime() - new Date(drop.startedAt).getTime()) / 1000);
  return Math.max(0, DROP_WINDOW_SECONDS - elapsedSeconds);
}
