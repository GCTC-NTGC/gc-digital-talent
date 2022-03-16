import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";
import TALENTSEARCH_APP_PROFILE_DIR from "./talentSearchConstants";

export type ApplicantProfileRoutes = ReturnType<typeof applicantProfileRoutes>;

const applicantProfileRoutes = (lang: string) => {
  const myprofile = (): string =>
    path.join("/", lang, TALENTSEARCH_APP_PROFILE_DIR); // leading slash in case empty base url
  return {
    myprofile,
    workpreferences: (): string => path.join(myprofile(), "workpreferences"),
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
