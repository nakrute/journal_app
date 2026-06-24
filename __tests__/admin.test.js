import { isAdminProfile } from "../utils/admin";

describe("admin utilities", () => {
  test("recognizes allowed admin handles", () => {
    expect(isAdminProfile({ handle: "@admin" })).toBe(true);
    expect(isAdminProfile({ handle: " @OutLoud-Admin " })).toBe(true);
  });

  test("rejects regular profiles", () => {
    expect(isAdminProfile({ handle: "@yourmoment" })).toBe(false);
    expect(isAdminProfile({ handle: "" })).toBe(false);
    expect(isAdminProfile(null)).toBe(false);
  });
});
