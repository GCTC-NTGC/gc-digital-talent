/**
 * @jest-environment jsdom
 */

import { createIntl, createIntlCache } from "react-intl";

import {
  fakeClassifications,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { PoolStream } from "@gc-digital-talent/graphql";

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
      classification: fakeClassifications()[0],
      stream: toLocalizedEnum(PoolStream.SoftwareSolutions),
      intl,
    };
    test("should combine title, classification and stream if all are provided", () => {
      expect(formattedPoolPosterTitle(baseInputs).label).toBe(
        "Web Developer (IT-01 software solutions EN)",
      );
    });
    test("should just be classification and stream in brackets if title is empty, null or undefined", () => {
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          title: null,
        }).label,
      ).toBe("(IT-01 software solutions EN)");
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          title: undefined,
        }).label,
      ).toBe("(IT-01 software solutions EN)");
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          title: "",
        }).label,
      ).toBe("(IT-01 software solutions EN)");
    });
    test("should just be ignore classification if it is null or undefined", () => {
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          classification: null,
        }).label,
      ).toBe("Web Developer (software solutions EN)");
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          classification: undefined,
        }).label,
      ).toBe("Web Developer (software solutions EN)");
    });
    test("should just be ignore stream if it is null or undefined", () => {
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          stream: null,
        }).label,
      ).toBe("Web Developer (IT-01)");
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          stream: undefined,
        }).label,
      ).toBe("Web Developer (IT-01)");
    });
    test("should leave out parentheses entirely if classification and stream are both empty", () => {
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          classification: undefined,
          stream: null,
        }).label,
      ).toBe("Web Developer");
      expect(
        formattedPoolPosterTitle({
          ...baseInputs,
          classification: null,
          stream: undefined,
        }).label,
      ).toBe("Web Developer");
    });
    test("should return empty string if title, classification all empty", () => {
      expect(
        formattedPoolPosterTitle({
          title: "",
          classification: null,
          stream: null,
          intl,
        }).label,
      ).toBe("");
    });
  });
});
