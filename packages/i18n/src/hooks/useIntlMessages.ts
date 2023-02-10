import * as CommonFrench from "../lang/frCompiled.json";

import type { Messages } from "../components/context/LanguageProvider";

const useIntlLanguages = (
  locale: string | null,
  messages: Messages | undefined,
) => {
  return locale === "fr"
    ? {
        ...messages,
        ...CommonFrench,
      }
    : undefined;
};

export default useIntlLanguages;
