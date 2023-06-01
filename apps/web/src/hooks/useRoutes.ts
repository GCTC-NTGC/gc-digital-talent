import path from "path-browserify";

import { useLocale, Locales } from "@gc-digital-talent/i18n";

import { ExperienceType } from "~/types/experience";

export const FromIapDraftQueryKey = "fromIapDraft";
export const FromIapSuccessQueryKey = "fromIapSuccess";

const createSearchQuery = (parameters: Map<string, string>): string => {
  if (parameters.size === 0) return "";

  const keyValuePairStrings = Array.from(
    parameters,
    ([key, value]) => `${key}=${value}`,
  );
  return `?${keyValuePairStrings.join("&")}`;
};

const getRoutes = (lang: Locales) => {
  const baseUrl = path.join("/", lang);
  const adminUrl = path.join(baseUrl, "admin");
  const applicantUrl = path.join(baseUrl, "applicant");
  const userUrl = (userId: string) => path.join(baseUrl, "users", userId);
  const applicationParam = (applicationId?: string) =>
    applicationId ? `?applicationId=${applicationId}` : "";
  const userEditUrl = (
    section: string,
    userId: string,
    applicationId?: string,
  ) =>
    `${path.join(
      userUrl(userId),
      "profile",
      section,
      "edit",
    )}${applicationParam(applicationId)}`;

  const createExperienceUrl = (
    type: ExperienceType,
    userId: string,
    applicationId?: string,
  ) =>
    `${path.join(
      userUrl(userId),
      "profile",
      "experiences",
      type,
      "create",
    )}${applicationParam(applicationId)}`;

  return {
    // Main Routes
    home: () => baseUrl,
    notFound: () => path.join(baseUrl, "404"),
    support: () => path.join(baseUrl, "support"),
    search: () => path.join(baseUrl, "search"),
    request: () => path.join(baseUrl, "search", "request"),
    requestConfirmation: (requestId: string) =>
      path.join(baseUrl, "search", "request", requestId),
    register: () => path.join(baseUrl, "register-info"),
    login: () => path.join(baseUrl, "login-info"),
    loggedOut: () => path.join(baseUrl, "logged-out"),
    createAccount: () => path.join(baseUrl, "create-account"),
    accessibility: () => path.join(baseUrl, "accessibility-statement"),
    directive: () => path.join(baseUrl, "directive-on-digital-talent"),

    // Admin
    admin: () => adminUrl,
    adminDashboard: () => path.join(adminUrl, "dashboard"),

    // Admin - Pools
    poolTable: () => path.join(adminUrl, "pools"),
    poolCreate: () => path.join(adminUrl, "pools", "create"),
    poolView: (poolId: string) => path.join(adminUrl, "pools", poolId),
    poolUpdate: (poolId: string) =>
      path.join(adminUrl, "pools", poolId, "edit"),

    // Admin - Pool Candidates
    poolCandidateTable: (poolId: string) =>
      path.join(adminUrl, "pools", poolId, "pool-candidates"),
    poolCandidateCreate: (poolId: string) =>
      path.join(adminUrl, "pools", poolId, "pool-candidates", "create"),
    poolCandidateUpdate: (poolId: string, poolCandidateId: string) =>
      path.join(
        adminUrl,
        "pools",
        poolId,
        "pool-candidates",
        poolCandidateId,
        "edit",
      ),
    poolCandidateApplication: (poolCandidateId: string) =>
      path.join(adminUrl, "candidates", poolCandidateId, "application"),

    // Admin - Users
    userTable: () => path.join(adminUrl, "users"),
    userCreate: () => path.join(adminUrl, "users", "create"),
    userView: (userId: string) => path.join(adminUrl, "users", userId),
    userProfile: (userId: string) =>
      path.join(adminUrl, "users", userId, "profile"),
    userUpdate: (userId: string) =>
      path.join(adminUrl, "users", userId, "edit"),
    userPlacement: (userId: string) =>
      path.join(adminUrl, "users", userId, "placement"),

    // Admin - Teams
    teamTable: () => path.join(adminUrl, "teams"),
    teamCreate: () => path.join(adminUrl, "teams", "create"),
    teamView: (teamId: string) => path.join(adminUrl, "teams", teamId),
    teamMembers: (teamId: string) =>
      path.join(adminUrl, "teams", teamId, "members"),
    teamUpdate: (teamId: string) =>
      path.join(adminUrl, "teams", teamId, "edit"),

    // Admin - Search Requests
    searchRequestTable: () => path.join(adminUrl, "talent-requests"),
    searchRequestView: (id: string) =>
      path.join(adminUrl, "talent-requests", id),

    // Admin - Classifications
    classificationTable: () =>
      path.join(adminUrl, "settings", "classifications"),
    classificationCreate: () =>
      path.join(adminUrl, "settings", "classifications", "create"),
    classificationUpdate: (classificationId: string) =>
      path.join(
        adminUrl,
        "settings",
        "classifications",
        classificationId,
        "edit",
      ),

    // Admin - Skills
    skillTable: () => path.join(adminUrl, "settings", "skills"),
    skillCreate: () => path.join(adminUrl, "settings", "skills", "create"),
    skillUpdate: (skillId: string) =>
      path.join(adminUrl, "settings", "skills", skillId, "edit"),

    // Admin - Skill Families
    skillFamilyTable: () =>
      path.join(adminUrl, "settings", "skills", "families"),
    skillFamilyCreate: () =>
      path.join(adminUrl, "settings", "skills", "families", "create"),
    skillFamilyUpdate: (skillFamilyId: string) =>
      path.join(
        adminUrl,
        "settings",
        "skills",
        "families",
        skillFamilyId,
        "edit",
      ),

    // Admin - Departments
    departmentTable: () => path.join(adminUrl, "settings", "departments"),
    departmentCreate: () =>
      path.join(adminUrl, "settings", "departments", "create"),
    departmentUpdate: (departmentId: string) =>
      path.join(adminUrl, "settings", "departments", departmentId, "edit"),

    // IAP
    iap: () => path.join(baseUrl, "indigenous-it-apprentice"),

    // Pools
    browsePools: () => path.join(baseUrl, "browse", "pools"),
    pool: (poolId: string) => path.join(baseUrl, "browse", "pools", poolId),
    createApplication: (poolId: string) =>
      path.join(baseUrl, "browse", "pools", poolId, "create-application"),

    // Applications
    applications: (userId: string) =>
      path.join(userUrl(userId), "applications"),
    application: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId),
    signAndSubmit: (applicationId: string) =>
      path.join(baseUrl, "browse", "applications", applicationId, "submit"),
    reviewApplication: (applicationId: string) =>
      path.join(baseUrl, "browse", "applications", applicationId, "apply"),
    applicationWelcome: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "welcome"),
    applicationSelfDeclaration: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "self-declaration"),
    applicationProfile: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "profile"),
    applicationResume: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "resume"),
    applicationResumeIntro: (applicationId: string) =>
      path.join(
        baseUrl,
        "applications",
        applicationId,
        "resume",
        "introduction",
      ),
    applicationResumeAdd: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "resume", "add"),
    applicationResumeEdit: (applicationId: string, experienceId: string) =>
      path.join(baseUrl, "applications", applicationId, "resume", experienceId),
    applicationEducation: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "education"),
    applicationSkills: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "skills"),
    applicationSkillsIntro: (applicationId: string) =>
      path.join(
        baseUrl,
        "applications",
        applicationId,
        "skills",
        "introduction",
      ),
    applicationQuestions: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "questions"),
    applicationQuestionsIntro: (applicationId: string) =>
      path.join(
        baseUrl,
        "applications",
        applicationId,
        "questions",
        "introduction",
      ),
    applicationReview: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "review"),
    applicationSuccess: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "success"),

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
      `${path.join(
        userUrl(userId),
        "profile",
        "experiences",
      )}${applicationParam(applicationId)}`,
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

    // Applicant Dashboard
    dashboard: (opts?: {
      fromIapDraft?: boolean;
      fromIapSuccess?: boolean;
    }) => {
      const searchParams = new Map<string, string>();
      if (opts?.fromIapDraft) searchParams.set(FromIapDraftQueryKey, "true");
      if (opts?.fromIapSuccess)
        searchParams.set(FromIapSuccessQueryKey, "true");

      return (
        path.join(applicantUrl, "dashboard") + createSearchQuery(searchParams)
      );
    },

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
