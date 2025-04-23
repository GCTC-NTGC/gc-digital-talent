import groupBy from "lodash/groupBy"; // provides sorted output
import stringify from "json-stable-stringify";

import rawI18nEnMessages from "@gc-digital-talent/i18n/en.json";
import rawI18nFrMessages from "@gc-digital-talent/i18n/fr.json";
import { notEmpty } from "@gc-digital-talent/helpers";

import rawWebEnMessages from "./en.json";
import rawWebFrMessages from "./fr.json";

describe("message files", () => {
  /*
    To update expected changes to the snapshot:
    `npx jest ./src/lang/lang.test.ts --testNamePattern="should have no changes to duplicate strings" --updateSnapshot`
    */
  it("should have no changes to duplicate strings", () => {
    const enMessages: Record<string, { defaultMessage: string }> = {
      ...rawWebEnMessages,
      ...rawI18nEnMessages,
    };

    const frMessages: Record<string, { defaultMessage: string }> = {
      ...rawWebFrMessages,
      ...rawI18nFrMessages,
    };

    const matchedMessages = Object.keys(enMessages).map((messageId) => ({
      en: enMessages[messageId].defaultMessage,
      fr: frMessages[messageId]?.defaultMessage,
    }));
    const groupedByEn = groupBy(matchedMessages, "en");
    const messagesWithMultipleFrStrings = Object.keys(groupedByEn)
      .map((en) => ({
        en,
        fr: Array.from(
          new Set(groupedByEn[en].map((g) => g.fr).filter(notEmpty)),
        ),
      }))
      .filter((g) => g.fr.length > 1);

    expect(
      stringify(messagesWithMultipleFrStrings, { space: "  " }),
    ).toMatchSnapshot();
  });
  it("should have no quotes in french strings", () => {
    const frMessages: Record<string, { defaultMessage: string }> = {
      ...rawWebFrMessages,
      ...rawI18nFrMessages,
    };

    const messagesArr = Object.keys(frMessages).map(
      (messageId) => frMessages[messageId]?.defaultMessage,
    );

    expect(messagesArr).toEqual(
      expect.not.arrayContaining([expect.stringMatching(new RegExp(/"|“|”/g))]),
    );
  });
});
