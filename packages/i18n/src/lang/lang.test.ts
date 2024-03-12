import groupBy from "lodash/groupBy"; // provides sorted output
import stringify from "json-stable-stringify";

import * as rawWebEnMessages from "@gc-digital-talent/web/src/lang/en.json";
import * as rawWebFrMessages from "@gc-digital-talent/web/src/lang/fr.json";
import { notEmpty } from "@gc-digital-talent/helpers";

import * as rawI18nEnMessages from "./en.json";
import * as rawI18nFrMessages from "./fr.json";

describe("message files", () => {
  /*
    To update expected changes to the snapshot:
    `npx jest ./src/lang/lang.test.ts --testNamePattern="should have no changes to duplicate strings" --updateSnapshot`
    */
  it("should have no changes to duplicate strings", async () => {
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
});
