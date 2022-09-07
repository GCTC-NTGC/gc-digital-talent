import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";
import { ExperienceType } from "./components/experienceForm/types";

export type ApplicantProfileRoutes = ReturnType<typeof applicantProfileRoutes>;

const applicantProfileRoutes = (lang: string) => {
  const home = (userId: string): string =>
    path.join("/", lang, "users", userId, "profile"); // leading slash in case empty base url
  const applicationParam = (applicationId?: string) =>
    applicationId ? path.join(`?application=${applicationId}`) : "";
  return {
    home,
    myProfile: (): string => path.join("/", lang, "talent", "profile"),
    createAccount: (): string => path.join("/", lang, "create-account"),
    aboutMe: (userId: string, applicationId?: string): string =>
      path.join(
        home(userId),
        "about-me",
        "edit",
        applicationParam(applicationId),
      ),
    languageInformation: (userId: string, applicationId?: string): string =>
      path.join(
        home(userId),
        "language-info",
        "edit",
        applicationParam(applicationId),
      ),
    governmentInformation: (userId: string, applicationId?: string): string =>
      path.join(
        home(userId),
        "government-info",
        "edit",
        applicationParam(applicationId),
      ),
    roleSalary: (userId: string, applicationId?: string): string =>
      path.join(
        home(userId),
        "role-salary-expectations",
        "edit",
        applicationParam(applicationId),
      ),
    workLocation: (userId: string, applicationId?: string): string =>
      path.join(
        home(userId),
        "work-location",
        "edit",
        applicationParam(applicationId),
      ),
    workPreferences: (userId: string, applicationId?: string): string =>
      path.join(
        home(userId),
        "work-preferences",
        "edit",
        applicationParam(applicationId),
      ),
    diversityEquityInclusion: (
      userId: string,
      applicationId?: string,
    ): string =>
      path.join(
        home(userId),
        "employment-equity",
        "edit",
        applicationParam(applicationId),
      ),
    skillsAndExperiences: (userId: string, applicationId?: string): string =>
      path.join(home(userId), "experiences", applicationParam(applicationId)),
    createAward: (userId: string): string =>
      path.join(home(userId), "experiences", "award", "create"),
    createCommunity: (userId: string): string =>
      path.join(home(userId), "experiences", "community", "create"),
    createEducation: (userId: string): string =>
      path.join(home(userId), "experiences", "education", "create"),
    createPersonal: (userId: string): string =>
      path.join(home(userId), "experiences", "personal", "create"),
    createWork: (userId: string): string =>
      path.join(home(userId), "experiences", "work", "create"),
    editExperience: (
      userId: string,
      type: ExperienceType,
      experienceId: string,
    ) => path.join(home(userId), "experiences", type, experienceId, "edit"),
  };
};

export const useApplicantProfileRoutes = (): ApplicantProfileRoutes => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return applicantProfileRoutes(locale);
};

export default applicantProfileRoutes;
