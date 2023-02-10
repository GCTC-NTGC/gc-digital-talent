import { LocalizedString } from "@gc-digital-talent/graphql";

const toLocalizedString = (base: string): LocalizedString => {
  return {
    en: `${base} EN`,
    fr: `${base} FR`,
  };
};

export default toLocalizedString;
