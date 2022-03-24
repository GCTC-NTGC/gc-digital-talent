import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";
import APPLICANTPROFILE_APP_DIR from "./talentSearchConstants";

export type ApplicantProfileRoutes = ReturnType<typeof applicantProfileRoutes>;

const applicantProfileRoutes = (lang: string) => {
  const home = (): string => path.join("/", lang, APPLICANTPROFILE_APP_DIR); // leading slash in case empty base url
  return {
    home,
    workPreferences: (): string => path.join(home(), "workpreferences"),
  };
};

/**
 * A hook version of talentSearchRoutes which gets the locale from the intl context.
 * @returns TalentSearchRoutes
 */
export const useApplicantProfileRoutes = (): ApplicantProfileRoutes => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return applicantProfileRoutes(locale);
};

export default applicantProfileRoutes;
