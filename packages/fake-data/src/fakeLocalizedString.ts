interface LocalizedStringValues {
  en?: string | null;
  fr?: string | null;
  localized?: string | null;
}

const toLocalizedString = (base: string | LocalizedStringValues) => {
  const values: LocalizedStringValues =
    typeof base === "string"
      ? { en: `${base} EN`, fr: `${base} FR`, localized: `${base} LOCALIZED` }
      : base;

  return {
    __typename: "LocalizedString" as const,
    en: values.en ?? null,
    fr: values.fr ?? null,
    localized: values.localized ?? values.en ?? null,
  };
};

export default toLocalizedString;
