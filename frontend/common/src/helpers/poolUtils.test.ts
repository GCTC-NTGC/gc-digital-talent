import { createIntl, createIntlCache } from "react-intl";
import { PoolStream } from "../api/generated";
import { formattedPoolPosterTitle } from "./poolUtils";

describe("poolUtils tests", () => {
  describe("formattedPoolPosterTitle", () => {
    const intlCache = createIntlCache();
    const intl = createIntl(
      {
        locale: "en",
      },
      intlCache,
    );
    const baseInputs = {
      title: "Web Developer",
      classification: "IT-01",
      stream: PoolStream.SoftwareSolutions,
      intl,
    };
    test("should combine title, classification and stream if all are provided", () => {
      expect(formattedPoolPosterTitle(baseInputs)).toBe(
        "Web Developer (IT-01 Software Solutions)",
      );
    });
    test("should just be classification and stream in brackets if title is empty, null or undefined", () => {
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          title: null,
        }),
      ).toBe("(IT-01 Software Solutions)");
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          title: undefined,
        }),
      ).toBe("(IT-01 Software Solutions)");
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          title: "",
        }),
      ).toBe("(IT-01 Software Solutions)");
    });
    test("should just be ignore classification if it is null, undefined or empty", () => {
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          classification: null,
        }),
      ).toBe("Web Developer (Software Solutions)");
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          classification: undefined,
        }),
      ).toBe("Web Developer (Software Solutions)");
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          classification: "",
        }),
      ).toBe("Web Developer (Software Solutions)");
    });
    test("should just be ignore stream if it is null, undefined or empty", () => {
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          stream: null,
        }),
      ).toBe("Web Developer (IT-01)");
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          stream: undefined,
        }),
      ).toBe("Web Developer (IT-01)");
    });
    test("should leave out parentheses entirely if classification and stream are both empty", () => {
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          classification: undefined,
          stream: null,
        }),
      ).toBe("Web Developer");
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          classification: null,
          stream: undefined,
        }),
      ).toBe("Web Developer");
    });
    test("should return empty string if title, classification all empty", () => {
      expect(
        formattedPoolPosterTitle({
          title: "",
          classification: "",
          stream: null,
          intl,
        }),
      ).toBe("");
    });
  });
});
