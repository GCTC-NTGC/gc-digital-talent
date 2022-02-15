/**
 * @jest-environment jsdom
 */

import { matchStringCaseDiacriticInsensitive } from "./formUtils";

describe("string matching tests", () => {
  const f = matchStringCaseDiacriticInsensitive;
  test("it doesn't match strings that are clearly different", () => {
    expect(f("apples", "oranges")).toBeFalsy();
  });
  test("it matches simple strings", () => {
    expect(f("tomato", "tomato")).toBeTruthy();
  });
  test("it matches strings with diacritics to the simplified version", () => {
    expect(f("facade", "façade")).toBeTruthy();
  });
  test("it matches strings with diacritics to the same string", () => {
    expect(f("façade", "façade")).toBeTruthy();
  });
});
