import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";

export type IndigenousApprenticeshipRoutes = ReturnType<
  typeof indigenousApprenticeshipRoutes
>;

const indigenousApprenticeshipRoutes = (lang: string) => {
  const home = (): string => path.join("/", lang); // leading slash in case empty base url
  return {
    home,
    frenchURL: (): string => path.join("/", lang, "apprenti-autochtonne-ti"),
  };
};

/**
 * A hook version of indigenousApprenticeshipRoutes which gets the locale from the intl context.
 * @returns IndigenousApprenticeshipRoutes
 */
export const useIndigenousApprenticeshipRoutes =
  (): IndigenousApprenticeshipRoutes => {
    const intl = useIntl();
    const locale = getLocale(intl);
    return indigenousApprenticeshipRoutes(locale);
  };

export default indigenousApprenticeshipRoutes;
