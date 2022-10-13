import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";

export type TalentSearchRoutes = ReturnType<typeof talentSearchRoutes>;

const talentSearchRoutes = (lang: string) => {
  const home = (): string => path.join("/", lang); // leading slash in case empty base url
  return {
    home,
    notFound: (): string => path.join("/", lang, "404"),
    support: (): string => path.join("/", lang, "support"),
    search: (): string => path.join("/", lang, "search"),
    request: (): string => path.join("/", lang, "search", "request"),
  };
};

/**
 * A hook version of talentSearchRoutes which gets the locale from the intl context.
 * @returns TalentSearchRoutes
 */
export const useTalentSearchRoutes = (): TalentSearchRoutes => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return talentSearchRoutes(locale);
};

export default talentSearchRoutes;
