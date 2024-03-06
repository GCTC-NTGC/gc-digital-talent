import groupBy from "lodash/groupBy";

import * as rawI18nEnMessages from "@gc-digital-talent/i18n/src/lang/en.json";
import * as rawI18nFrMessages from "@gc-digital-talent/i18n/src/lang/fr.json";

import * as rawWebEnMessages from "~/lang/en.json";
import * as rawWebFrMessages from "~/lang/fr.json";

describe("apps:web language", () => {
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
      fr: frMessages[messageId].defaultMessage,
    }));
    const groupedByEn = groupBy(matchedMessages, "en");
    const messagesWithMultipleFrStrings = Object.keys(groupedByEn)
      .map((en) => ({
        en,
        fr: Array.from(new Set(groupedByEn[en].map((g) => g.fr))),
      }))
      .filter((g) => g.fr.length > 1);

    expect(
      JSON.stringify(messagesWithMultipleFrStrings, null, 4), // should use stable-stringify
    ).toMatchSnapshot();
  });
});
