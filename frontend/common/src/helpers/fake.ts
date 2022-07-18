import { LocalizedString } from "../api/generated";

// eslint-disable-next-line import/prefer-default-export
export function toLocalizedString(base: string): LocalizedString {
  return {
    en: `${base} EN`,
    fr: `${base} FR`,
  };
}
