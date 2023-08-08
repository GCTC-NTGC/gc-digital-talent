/**
 * @jest-environment jsdom
 */
import { localizePath, oppositeLocale } from "./localize";
import { Locales } from "../types";

describe("localize helper tests", () => {
  describe("oppositeLocale", () => {
    test("returns 'en' if passed 'fr' and vice versa", () => {
      expect(oppositeLocale("fr")).toBe("en");
      expect(oppositeLocale("en")).toBe("fr");
    });
    test("returns 'fr' if passed any unexpected value", () => {
      expect(oppositeLocale("unknown" as Locales)).toBe("fr");
      expect(oppositeLocale(undefined as unknown as Locales)).toBe("fr");
      expect(oppositeLocale({ hello: "world" } as unknown as Locales)).toBe(
        "fr",
      );
    });
  });
  describe("localizePath", () => {
    test("sets non-localized paths to correct locale", () => {
      expect(localizePath("/admin/users", "en")).toBe("/en/admin/users");
      expect(localizePath("/admin/users", "fr")).toBe("/fr/admin/users");
    });
    test("sets already localized paths to correct locale", () => {
      expect(localizePath("/en/admin/users", "en")).toBe("/en/admin/users");
      expect(localizePath("/en/admin/users", "fr")).toBe("/fr/admin/users");
    });
    test("leaves relative paths relative", () => {
      expect(localizePath("admin/users", "en")).toBe("en/admin/users");
      expect(localizePath("fr/admin/users", "en")).toBe("en/admin/users");
    });
    test("works on single slash", () => {
      expect(localizePath("/", "en")).toBe("/en/");
    });
    test("works on empty string", () => {
      expect(localizePath("", "en")).toBe("en");
    });
    test("leaves hash and query parameters alone", () => {
      expect(localizePath("/admin/users?foo=bar#baz", "en")).toBe(
        "/en/admin/users?foo=bar#baz",
      );
    });
  });
});
