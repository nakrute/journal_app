import { createDailyDrop, getCurrentDailyDrop, getDropSecondsRemaining } from "../utils/dailyDrop";

describe("daily drop utilities", () => {
  test("keeps the stored drop for the same date", () => {
    const date = new Date("2026-05-14T12:00:00Z");
    const drop = createDailyDrop(date);

    expect(getCurrentDailyDrop(drop, date)).toBe(drop);
  });

  test("creates a new drop for a new date", () => {
    const drop = createDailyDrop(new Date("2026-05-14T12:00:00Z"));
    const nextDrop = getCurrentDailyDrop(drop, new Date("2026-05-15T12:00:00Z"));

    expect(nextDrop.dateKey).toBe("2026-05-15");
  });

  test("calculates remaining drop time", () => {
    const drop = { startedAt: "2026-05-14T12:00:00Z" };
    const date = new Date("2026-05-14T12:01:00Z");

    expect(getDropSecondsRemaining(drop, date)).toBe(60);
  });
});
