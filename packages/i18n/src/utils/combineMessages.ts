import type { Messages } from "../types";
import CommonFrench from "../lang/frCompiled.json";

const combineMessages = (
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

export default combineMessages;
