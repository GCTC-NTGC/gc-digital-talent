/**
 * @jest-environment jsdom
 */

import { IntlShape } from "react-intl";
import { getLocale, Locales, localizePath, oppositeLocale } from "./localize";

describe("localize helper tests", () => {
  describe("getLocale", () => {
    test("returns 'en' or 'fr' if that's the intl locale", () => {
      expect(getLocale({ locale: "en" } as IntlShape)).toBe("en");
      expect(getLocale({ locale: "fr" } as IntlShape)).toBe("fr");
    });
    test("always returns default of 'en' if intl.locale is undefined or an unknown string", () => {
      expect(getLocale({ locale: undefined } as unknown as IntlShape)).toBe(
        "en",
      );
      expect(getLocale({ locale: "unknown" } as IntlShape)).toBe("en");
    });
  });
  describe("oppositeLocale", () => {
    test("returns 'en' if passed 'fr' and vice versa", () => {
      expect(oppositeLocale("fr")).toBe("en");
      expect(oppositeLocale("en")).toBe("fr");
    });
    test("returns 'fr' if passed any unexpected value (opposite to getLocale)", () => {
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
