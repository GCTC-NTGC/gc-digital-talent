import path from "path-browserify";

import useLocale from "@common/hooks/useLocale";
import { Locales } from "@common/helpers/localize";
import { ExperienceType } from "../components/experienceForm/types";

const getRoutes = (lang: Locales) => {
  const baseUrl = path.join("/", lang);
  const userUrl = (userId: string) => path.join(baseUrl, "users", userId);
  const applicationParam = (applicationId?: string) =>
    applicationId ? path.join(`?applicationId=${applicationId}`) : "";
  const userEditUrl = (
    section: string,
    userId: string,
    applicationId?: string,
  ) =>
    path.join(
      userUrl(userId),
      "profile",
      section,
      "edit",
      applicationParam(applicationId),
    );

  const createExperienceUrl = (
    type: ExperienceType,
    userId: string,
    applicationId?: string,
  ) =>
    path.join(
      userUrl(userId),
      "profile",
      "experiences",
      type,
      "create",
      applicationParam(applicationId),
    );

  return {
    // Main Routes
    home: () => baseUrl,
    notFound: () => path.join(baseUrl, "404"),
    support: () => path.join(baseUrl, "support"),
    search: () => path.join(baseUrl, "search"),
    request: () => path.join(baseUrl, "search", "request"),
    register: () => path.join(baseUrl, "register-info"),
    login: () => path.join(baseUrl, "login-info"),
    loggedOut: () => path.join(baseUrl, "logged-out"),
    createAccount: () => path.join(baseUrl, "create-account"),
    accessibility: () => path.join(baseUrl, "accessibility-statement"),

    // Pools
    browse: () => path.join(baseUrl, "browse"),
    allPools: () => path.join(baseUrl, "browse", "pools"),
    pool: (poolId: string) => path.join(baseUrl, "browse", "pools", poolId),
    createApplication: (poolId: string) =>
      path.join(baseUrl, "browse", "pools", poolId, "create-application"),

    // Applications
    applications: (userId: string) =>
      path.join(userUrl(userId), "applications"),
    signAndSubmit: (applicationId: string) =>
      path.join(baseUrl, "browse", "applications", applicationId, "submit"),
    reviewApplication: (applicationId: string) =>
      path.join(baseUrl, "browse", "applications", applicationId, "apply"),

    // Profile Routes
    profile: (userId: string) => path.join(userUrl(userId), "profile"),
    myProfile: () => path.join(baseUrl, "users", "me"),
    aboutMe: (userId: string, applicationId?: string) =>
      userEditUrl("about-me", userId, applicationId),
    languageInformation: (userId: string, applicationId?: string) =>
      userEditUrl("language-info", userId, applicationId),
    governmentInformation: (userId: string, applicationId?: string) =>
      userEditUrl("government-info", userId, applicationId),
    roleSalary: (userId: string, applicationId?: string) =>
      userEditUrl("role-salary-expectations", userId, applicationId),
    workLocation: (userId: string, applicationId?: string) =>
      userEditUrl("work-location", userId, applicationId),
    workPreferences: (userId: string, applicationId?: string) =>
      userEditUrl("work-preferences", userId, applicationId),
    diversityEquityInclusion: (userId: string, applicationId?: string) =>
      userEditUrl("employment-equity", userId, applicationId),

    // Experience & Skills Routes
    skillsAndExperiences: (userId: string, applicationId?: string) =>
      path.join(
        userUrl(userId),
        "profile",
        "experiences",
        applicationParam(applicationId),
      ),
    editExperience: (
      userId: string,
      type: ExperienceType,
      experienceId: string,
    ) =>
      path.join(
        userUrl(userId),
        "profile",
        "experiences",
        type,
        experienceId,
        "edit",
      ),
    createAward: (userId: string, applicationId?: string) =>
      createExperienceUrl("award", userId, applicationId),
    createCommunity: (userId: string, applicationId?: string) =>
      createExperienceUrl("community", userId, applicationId),
    createEducation: (userId: string, applicationId?: string) =>
      createExperienceUrl("education", userId, applicationId),
    createPersonal: (userId: string, applicationId?: string) =>
      createExperienceUrl("personal", userId, applicationId),
    createWork: (userId: string, applicationId?: string) =>
      createExperienceUrl("work", userId, applicationId),

    /**
     * Deprecated
     *
     * The following paths are deprecated and
     * should contain redirects to new ones.
     */
    myProfileDeprecated: () => path.join("/", lang, "talent", "profile"),
  };
};

const useRoutes = () => {
  const { locale } = useLocale();

  return getRoutes(locale);
};

export default useRoutes;
