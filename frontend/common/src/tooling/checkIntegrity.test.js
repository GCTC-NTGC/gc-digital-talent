/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @jest-environment node
 */

const {
  base64Decode,
  isValidIntegrity,
  countInvalidIntegrityValues,
} = require("./checkIntegrityLib");

describe("Check integrity tests", () => {
  test("If base64 decoding works", async () => {
    // https://cryptii.com/pipes/base64-to-hex
    // The quick brown fox jumps over 13 lazy dogs.
    const encodedString =
      "VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIDEzIGxhenkgZG9ncy4=";
    const expectedHexString =
      "54686520717569636b2062726f776e20666f78206a756d7073206f766572203133206c617a7920646f67732e";

    const actualHexString = base64Decode(encodedString);
    expect(actualHexString).toBe(expectedHexString);
  });

  test("If it errors on a missing integrity", async () => {
    expect(isValidIntegrity("")).toBeFalsy();
  });

  test("If it errors on a junk integrity", async () => {
    expect(
      isValidIntegrity("The quick brown fox jumps over 13 lazy dogs."),
    ).toBeFalsy();
  });

  test("If it accepts a valid SHA-512 integrity", async () => {
    expect(
      isValidIntegrity(
        "sha512-oh/6byDPnL1zeNXFrDXFLyZjkr1MsBG667IM792caf1L2UPOOMf65NFzjUH/ltyfwjAGfs1rsX1eftK0jC/KIg==",
      ),
    ).toBeTruthy();
  });

  test("If it allows a package with an integrity", async () => {
    const package = JSON.parse(`{
        "test-package": {
          "integrity": "sha512-oh/6byDPnL1zeNXFrDXFLyZjkr1MsBG667IM792caf1L2UPOOMf65NFzjUH/ltyfwjAGfs1rsX1eftK0jC/KIg=="
        }
      }`);
    expect(countInvalidIntegrityValues(package)).toBe(0);
  });

  test("If errors on a package without an integrity", async () => {
    const package = JSON.parse(`{
        "test-package": { }
      }`);
    expect(countInvalidIntegrityValues(package)).toBe(1);
  });

  test("If it errors on a package with a junk integrity", async () => {
    const package = JSON.parse(`{
        "test-package": {
          "integrity": "sha512-ZZZ"
         }
      }`);
    expect(countInvalidIntegrityValues(package)).toBe(1);
  });

  test("If it allows a package without an integrity if it is in the allowed list ", async () => {
    const package = JSON.parse(`{
        "test-package": { }
      }`);
    expect(countInvalidIntegrityValues(package, ["test-package"])).toBe(0);
  });
});
