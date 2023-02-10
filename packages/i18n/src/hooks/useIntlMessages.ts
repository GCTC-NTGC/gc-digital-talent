import type { Messages } from "~/types";
import * as CommonFrench from "~/lang/frCompiled.json";

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
