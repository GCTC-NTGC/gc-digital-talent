const toLocalizedString = (base: string) => {
  return {
    __typename: "LocalizedString" as const,
    en: `${base} EN`,
    fr: `${base} FR`,
    localized: `${base} LOCALIZED`,
  };
};

export default toLocalizedString;
