import type { LocalizedString } from "@gc-digital-talent/graphql/schema-types";

const toLocalizedString = (base: string): LocalizedString => {
  return {
    __typename: "LocalizedString",
    en: `${base} EN`,
    fr: `${base} FR`,
    localized: `${base} LOCALIZED`,
  };
};

export default toLocalizedString;
