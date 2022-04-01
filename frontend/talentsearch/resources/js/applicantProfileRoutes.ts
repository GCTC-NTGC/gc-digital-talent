import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";
import { APPLICANTPROFILE_APP_DIR } from "./talentSearchConstants";

export type ApplicantProfileRoutes = ReturnType<typeof applicantProfileRoutes>;

const applicantProfileRoutes = (lang: string) => {
  const home = (): string => path.join("/", lang, APPLICANTPROFILE_APP_DIR); // leading slash in case empty base url
  return {
    home,
    aboutMe: (): string => path.join(home(), "about-me"),
    languageInformation: (): string =>
      path.join(home(), "language-information"),
    governmentInformation: (): string =>
      path.join(home(), "government-information"),
    workLocation: (id: string): string =>
      path.join(home(), "work-location", id, "edit"),
    workPreferences: (): string => path.join(home(), "work-preferences"),
    diversityAndInclusion: (): string =>
      path.join(home(), "diversity-and-inclusion"),
    skillsAndExperiences: (): string =>
      path.join(home(), "skills-and-experiences"),
  };
};

export const useApplicantProfileRoutes = (): ApplicantProfileRoutes => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return applicantProfileRoutes(locale);
};

export default applicantProfileRoutes;
