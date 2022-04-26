import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";
import TALENTSEARCH_APP_DIR from "./talentSearchConstants";

export type ApplicantProfileRoutes = ReturnType<typeof applicantProfileRoutes>;

const guardWithFlag = (unguardedPath: string) =>
  process.env.FEATURE_APPLICANTPROFILE ? unguardedPath : undefined;

const applicantProfileRoutes = (lang: string) => {
  // This is a workaround for #2375?
  // const home = (): string => path.join("/", lang, APPLICANTPROFILE_APP_DIR); // leading slash in case empty base url
  const home2 = (): string => path.join("/", lang, TALENTSEARCH_APP_DIR);
  return {
    home: (): string => path.join(home2(), "profile"),
    aboutMe: (): string => path.join(home2(), "about-me"),
    languageInformation: (): string =>
      path.join(home2(), "language-information"),
    governmentInformation: (): string | undefined =>
      guardWithFlag(path.join(home2(), "government-information")),
    workLocation: (): string => path.join(home2(), "work"),
    workPreferences: (): string => path.join(home2(), "work-preferences"),
    diversityAndInclusion: (): string =>
      path.join(home2(), "diversity-and-inclusion"),
    skillsAndExperiences: (): string =>
      path.join(home2(), "skills-and-experiences"),
  };
};

export const useApplicantProfileRoutes = (): ApplicantProfileRoutes => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return applicantProfileRoutes(locale);
};

export default applicantProfileRoutes;
