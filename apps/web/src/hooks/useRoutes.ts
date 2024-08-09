import path from "path-browserify";
import { useIntl } from "react-intl";

import { Locales, getLocale } from "@gc-digital-talent/i18n";

import { PageSectionId as UserProfilePageSectionId } from "~/constants/sections/userProfile";
import { PageSectionId as CareerTimelineAndRecruitmentPageSectionId } from "~/constants/sections/careerTimeline";

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

const createFragment = (identifier: string | null | undefined): string =>
  identifier ? `#${identifier}` : "";

const getRoutes = (lang: Locales) => {
  const baseUrl = path.join("/", lang);
  const adminUrl = path.join(baseUrl, "admin");
  const applicantUrl = path.join(baseUrl, "applicant");
  const showcase = path.join(applicantUrl, "skills", "showcase");

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
    userDeleted: () => path.join(baseUrl, "user-deleted"),
    gettingStarted: () => path.join(baseUrl, "getting-started"),
    emailVerification: () => path.join(baseUrl, "email-verification"),
    employeeInformation: () => path.join(baseUrl, "employee-registration"),
    termsAndConditions: () => path.join(baseUrl, "terms-and-conditions"),
    privacyPolicy: () => path.join(baseUrl, "privacy-policy"),
    accessibility: () => path.join(baseUrl, "accessibility-statement"),
    manager: () => path.join(baseUrl, "manager"),
    executive: () => path.join(baseUrl, "executive"),
    skills: () => path.join(baseUrl, "skills"),
    inclusivityEquity: () => path.join(baseUrl, "inclusivity-equity"),

    // Admin
    adminDashboard: () => adminUrl,

    // Admin - Pools
    poolTable: () => path.join(adminUrl, "pools"),
    poolCreate: () => path.join(adminUrl, "pools", "create"),
    poolView: (poolId: string) => path.join(adminUrl, "pools", poolId),
    poolUpdate: (poolId: string) =>
      path.join(adminUrl, "pools", poolId, "edit"),
    assessmentPlanBuilder: (poolId: string) =>
      path.join(adminUrl, "pools", poolId, "plan"),
    screeningAndEvaluation: (poolId: string) =>
      path.join(adminUrl, "pools", poolId, "screening"),
    poolPreview: (poolId: string) =>
      path.join(adminUrl, "pools", poolId, "preview"),

    // Admin - Pool Candidates
    poolCandidates: () => path.join(adminUrl, "pool-candidates"),
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
    skillFamilyTable: () => path.join(adminUrl, "settings", "skill-families"),
    skillFamilyCreate: () =>
      path.join(adminUrl, "settings", "skill-families", "create"),
    skillFamilyUpdate: (skillFamilyId: string) =>
      path.join(adminUrl, "settings", "skill-families", skillFamilyId, "edit"),

    // Admin - Departments
    departmentTable: () => path.join(adminUrl, "settings", "departments"),
    departmentCreate: () =>
      path.join(adminUrl, "settings", "departments", "create"),
    departmentUpdate: (departmentId: string) =>
      path.join(adminUrl, "settings", "departments", departmentId, "edit"),

    // Admin - Announcements
    announcements: () => path.join(adminUrl, "settings", "announcements"),

    // IAP
    iap: () => path.join(baseUrl, "indigenous-it-apprentice"),
    iapManager: () => path.join(baseUrl, "indigenous-it-apprentice", "hire"),

    // Pools
    browsePools: () => path.join(baseUrl, "browse", "pools"),
    pool: (poolId: string) => path.join(baseUrl, "browse", "pools", poolId),
    createApplication: (poolId: string) =>
      path.join(baseUrl, "browse", "pools", poolId, "create-application"),

    // Applications
    application: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId),

    // Application
    applicationWelcome: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "welcome"),
    applicationSelfDeclaration: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "self-declaration"),
    applicationProfile: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "profile"),
    applicationCareerTimeline: (applicationId: string) =>
      path.join(baseUrl, "applications", applicationId, "career-timeline"),
    applicationCareerTimelineIntro: (applicationId: string) =>
      path.join(
        baseUrl,
        "applications",
        applicationId,
        "career-timeline",
        "introduction",
      ),
    applicationCareerTimelineAdd: (applicationId: string) =>
      path.join(
        baseUrl,
        "applications",
        applicationId,
        "career-timeline",
        "add",
      ),
    applicationCareerTimelineEdit: (
      applicationId: string,
      experienceId: string,
    ) =>
      path.join(
        baseUrl,
        "applications",
        applicationId,
        "career-timeline",
        experienceId,
      ),
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
    profile: (section?: UserProfilePageSectionId) => {
      const fragment = section ? `#${section}` : "";
      return path.join(applicantUrl, "personal-information") + fragment;
    },
    verifyContactEmail: (opts?: { emailAddress?: string | null }) => {
      const searchParams = new Map<string, string>();
      if (opts?.emailAddress) {
        searchParams.set("emailAddress", opts.emailAddress);
      }
      return (
        path.join(applicantUrl, "verify-contact-email") +
        createSearchQuery(searchParams)
      );
    },

    // Career timeline and recruitment Routes
    careerTimelineAndRecruitment: (opts?: {
      section?: CareerTimelineAndRecruitmentPageSectionId;
    }) => {
      const fragment = opts?.section ? `#${opts.section}` : "";
      return `${path.join(applicantUrl, "career-timeline")}${fragment}`;
    },
    editExperience: (experienceId: string) =>
      path.join(applicantUrl, "career-timeline", experienceId, "edit"),
    createExperience: () =>
      path.join(applicantUrl, "career-timeline", "create"),

    // Profile and Applications
    profileAndApplications: (opts?: {
      fromIapDraft?: boolean;
      fromIapSuccess?: boolean;
      fragmentIdentifier?: "track-applications-section";
    }) => {
      const searchParams = new Map<string, string>();
      if (opts?.fromIapDraft) searchParams.set(FromIapDraftQueryKey, "true");
      if (opts?.fromIapSuccess)
        searchParams.set(FromIapSuccessQueryKey, "true");

      return (
        applicantUrl +
        createSearchQuery(searchParams) +
        createFragment(opts?.fragmentIdentifier)
      );
    },

    skillLibrary: () => path.join(applicantUrl, "skills"),
    skillShowcase: () => path.join(showcase),
    editUserSkill: (skillId: string) =>
      path.join(applicantUrl, "skills", skillId),
    topBehaviouralSkills: () => path.join(showcase, "top-5-behavioural-skills"),
    topTechnicalSkills: () => path.join(showcase, "top-10-technical-skills"),
    improveBehaviouralSkills: () =>
      path.join(showcase, "3-behavioural-skills-to-improve"),
    improveTechnicalSkills: () =>
      path.join(showcase, "5-technical-skills-to-train"),

    // Notifications
    notifications: () => path.join(applicantUrl, "notifications"),

    // Directive on digital talent
    directive: () => path.join(baseUrl, "directive-on-digital-talent"),
    digitalServicesContractingQuestionnaire: () =>
      path.join(
        baseUrl,
        "directive-on-digital-talent",
        "digital-services-contracting-questionnaire",
      ),

    // Account Settings
    accountSettings: () => path.join(applicantUrl, "settings"),

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
  const intl = useIntl();
  const locale = getLocale(intl);

  return getRoutes(locale);
};

export default useRoutes;
