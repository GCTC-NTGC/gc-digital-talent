import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";
import { ExperienceType } from "./components/experienceForm/types";
import { APPLICANTPROFILE_APP_DIR } from "./talentSearchConstants";

export type ApplicantProfileRoutes = ReturnType<typeof applicantProfileRoutes>;

const applicantProfileRoutes = (lang: string) => {
  const home = (): string => path.join("/", lang, APPLICANTPROFILE_APP_DIR); // leading slash in case empty base url
  return {
    home,
    profilePage: (): string => path.join(home(), "profile"),
    aboutMe: (): string => path.join(home(), "about-me"),
    languageInformation: (): string =>
      path.join(home(), "language-information"),
    governmentInformation: (): string =>
      path.join(home(), "government-information"),
    roleSalary: (): string => path.join(home(), "role-salary"),
    workLocation: (): string => path.join(home(), "work-location"),
    workPreferences: (): string => path.join(home(), "work-preferences"),
    diversityEquityInclusion: (): string =>
      path.join(home(), "diversity-and-inclusion"),
    skillsAndExperiences: (): string =>
      path.join(home(), "skills-and-experiences"),
    createAward: (): string =>
      path.join(home(), "skills-and-experiences", "award", "create"),
    createCommunity: (): string =>
      path.join(home(), "skills-and-experiences", "community", "create"),
    createEducation: (): string =>
      path.join(home(), "skills-and-experiences", "education", "create"),
    createPersonal: (): string =>
      path.join(home(), "skills-and-experiences", "personal", "create"),
    createWork: (): string =>
      path.join(home(), "skills-and-experiences", "work", "create"),
    editExperience: (type: ExperienceType, id: string) =>
      path.join(home(), "skills-and-experiences", type, id, "edit"),
  };
};

export const useApplicantProfileRoutes = (): ApplicantProfileRoutes => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return applicantProfileRoutes(locale);
};

export default applicantProfileRoutes;
