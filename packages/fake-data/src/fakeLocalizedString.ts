import { LocalizedString } from "@gc-digital-talent/web/src/api/generated";


const toLocalizedString = (base: string): LocalizedString => {
  return {
    en: `${base} EN`,
    fr: `${base} FR`,
  };
}


export default toLocalizedString;
