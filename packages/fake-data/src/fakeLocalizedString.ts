import { LocalizedString } from "@gc-digital-talent/graphql";

const toLocalizedString = (base: string): LocalizedString => {
  return {
    en: `${base} EN`,
    fr: `${base} FR`,
    localized: `${base} LOCALIZED`,
  };
};

export default toLocalizedString;
