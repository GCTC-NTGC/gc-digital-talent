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
  const baseUrl = `/${lang}`;
  const adminUrl = [baseUrl, "admin"].join("/");
  const applicantUrl = [baseUrl, "applicant"].join("/");
  const managerUrl = [baseUrl, "manager"].join("/");
  const communityUrl = [baseUrl, "community"].join("/");
  const showcase = [applicantUrl, "skills", "showcase"].join("/");
  const communitiesUrl = [baseUrl, "communities"].join("/");

  return {
    // Main Routes
    home: () => baseUrl,
    notFound: () => [baseUrl, "404"].join("/"),
    support: () => [baseUrl, "support"].join("/"),
    search: () => [baseUrl, "search"].join("/"),
    request: () => [baseUrl, "search", "request"].join("/"),
    requestConfirmation: (requestId: string) =>
      [baseUrl, "search", "request", requestId].join("/"),
    register: () => [baseUrl, "register-info"].join("/"),
    login: () => [baseUrl, "login-info"].join("/"),
    loggedOut: () => [baseUrl, "logged-out"].join("/"),
    userDeleted: () => [baseUrl, "user-deleted"].join("/"),
    gettingStarted: () => [baseUrl, "getting-started"].join("/"),
    emailVerification: () => [baseUrl, "email-verification"].join("/"),
    employeeInformation: () => [baseUrl, "employee-registration"].join("/"),
    workEmailVerification: () => [baseUrl, "work-email-verification"].join("/"),
    termsAndConditions: () => [baseUrl, "terms-and-conditions"].join("/"),
    privacyPolicy: () => [baseUrl, "privacy-policy"].join("/"),
    accessibility: () => [baseUrl, "accessibility-statement"].join("/"),
    executive: () => [baseUrl, "executive"].join("/"),
    skills: () => [baseUrl, "skills"].join("/"),
    inclusivityEquity: () => [baseUrl, "inclusivity-equity"].join("/"),

    // Applicant
    applicantDashboard: () => applicantUrl,

    // Admin
    adminDashboard: () => adminUrl,

    // Admin - Communities
    communityDashboard: () => communityUrl,
    communityTable: () => [adminUrl, "communities"].join("/"),
    communityCreate: () => [adminUrl, "communities", "create"].join("/"),
    communityView: (communityId: string) =>
      [adminUrl, "communities", communityId].join("/"),
    communityManageAccess: (communityId: string) =>
      [adminUrl, "communities", communityId, "manage-access"].join("/"),
    communityUpdate: (communityId: string) =>
      [adminUrl, "communities", communityId, "edit"].join("/"),

    // Admin - Pools
    poolTable: () => [adminUrl, "pools"].join("/"),
    poolCreate: () => [adminUrl, "pools", "create"].join("/"),
    poolView: (poolId: string) => [adminUrl, "pools", poolId].join("/"),
    poolUpdate: (poolId: string) =>
      [adminUrl, "pools", poolId, "edit"].join("/"),
    assessmentPlanBuilder: (poolId: string) =>
      [adminUrl, "pools", poolId, "plan"].join("/"),
    screeningAndEvaluation: (poolId: string) =>
      [adminUrl, "pools", poolId, "screening"].join("/"),
    poolPreview: (poolId: string) =>
      [adminUrl, "pools", poolId, "preview"].join("/"),
    poolManageAccess: (poolId: string) =>
      [adminUrl, "pools", poolId, "manage-access"].join("/"),

    // Admin - Pool Candidates
    poolCandidates: () => [adminUrl, "pool-candidates"].join("/"),
    poolCandidateTable: (poolId: string) =>
      [adminUrl, "pools", poolId, "pool-candidates"].join("/"),
    poolCandidateCreate: (poolId: string) =>
      [adminUrl, "pools", poolId, "pool-candidates", "create"].join("/"),
    poolCandidateUpdate: (poolId: string, poolCandidateId: string) =>
      [
        adminUrl,
        "pools",
        poolId,
        "pool-candidates",
        poolCandidateId,
        "edit",
      ].join("/"),
    poolCandidateApplication: (poolCandidateId: string) =>
      [adminUrl, "candidates", poolCandidateId, "application"].join("/"),

    // Admin - Users
    userTable: () => [adminUrl, "users"].join("/"),
    userCreate: () => [adminUrl, "users", "create"].join("/"),
    userView: (userId: string) => [adminUrl, "users", userId].join("/"),
    userProfile: (userId: string) =>
      [adminUrl, "users", userId, "profile"].join("/"),
    userUpdate: (userId: string) =>
      [adminUrl, "users", userId, "edit"].join("/"),

    // Admin - Search Requests
    searchRequestTable: () => [adminUrl, "talent-requests"].join("/"),
    searchRequestView: (id: string) =>
      [adminUrl, "talent-requests", id].join("/"),

    // Admin - Classifications
    classificationTable: () =>
      [adminUrl, "settings", "classifications"].join("/"),
    classificationCreate: () =>
      [adminUrl, "settings", "classifications", "create"].join("/"),
    classificationView: (id: string) =>
      `${adminUrl}/settings/classifications/${id}`,
    classificationUpdate: (classificationId: string) =>
      [adminUrl, "settings", "classifications", classificationId, "edit"].join(
        "/",
      ),

    // Admin - Skills
    skillTable: () => [adminUrl, "settings", "skills"].join("/"),
    skillCreate: () => [adminUrl, "settings", "skills", "create"].join("/"),
    skillView: (skillId: string) =>
      [adminUrl, "settings", "skills", skillId].join("/"),
    skillUpdate: (skillId: string) =>
      [adminUrl, "settings", "skills", skillId, "edit"].join("/"),

    // Admin - Skill Families
    skillFamilyTable: () => [adminUrl, "settings", "skill-families"].join("/"),
    skillFamilyView: (id: string) =>
      `${adminUrl}/settings/skill-families/${id}`,
    skillFamilyCreate: () =>
      [adminUrl, "settings", "skill-families", "create"].join("/"),
    skillFamilyUpdate: (skillFamilyId: string) =>
      [adminUrl, "settings", "skill-families", skillFamilyId, "edit"].join("/"),

    // Admin - Departments
    departmentTable: () => [adminUrl, "settings", "departments"].join("/"),
    departmentCreate: () =>
      [adminUrl, "settings", "departments", "create"].join("/"),
    departmentView: (departmentId: string) =>
      [adminUrl, "settings", "departments", departmentId].join("/"),
    departmentUpdate: (departmentId: string) =>
      [adminUrl, "settings", "departments", departmentId, "edit"].join("/"),

    // Admin - Announcements
    announcements: () => [adminUrl, "settings", "announcements"].join("/"),

    // IAP
    iap: () => [baseUrl, "indigenous-it-apprentice"].join("/"),
    iapManager: () => [baseUrl, "indigenous-it-apprentice", "hire"].join("/"),

    // Pools
    browsePools: () => [baseUrl, "browse", "pools"].join("/"),
    pool: (poolId: string) => [baseUrl, "browse", "pools", poolId].join("/"),
    createApplication: (poolId: string) =>
      [baseUrl, "browse", "pools", poolId, "create-application"].join("/"),

    // Applications
    application: (applicationId: string) =>
      [baseUrl, "applications", applicationId].join("/"),

    // Application
    applicationWelcome: (applicationId: string) =>
      [baseUrl, "applications", applicationId, "welcome"].join("/"),
    applicationSelfDeclaration: (applicationId: string) =>
      [baseUrl, "applications", applicationId, "self-declaration"].join("/"),
    applicationProfile: (applicationId: string) =>
      [baseUrl, "applications", applicationId, "profile"].join("/"),
    applicationCareerTimeline: (applicationId: string) =>
      [baseUrl, "applications", applicationId, "career-timeline"].join("/"),
    applicationCareerTimelineIntro: (applicationId: string) =>
      [
        baseUrl,
        "applications",
        applicationId,
        "career-timeline",
        "introduction",
      ].join("/"),
    applicationCareerTimelineAdd: (applicationId: string) =>
      [baseUrl, "applications", applicationId, "career-timeline", "add"].join(
        "/",
      ),
    applicationCareerTimelineEdit: (
      applicationId: string,
      experienceId: string,
    ) =>
      [
        baseUrl,
        "applications",
        applicationId,
        "career-timeline",
        experienceId,
      ].join("/"),
    applicationEducation: (applicationId: string) =>
      [baseUrl, "applications", applicationId, "education"].join("/"),
    applicationSkills: (applicationId: string) =>
      [baseUrl, "applications", applicationId, "skills"].join("/"),
    applicationSkillsIntro: (applicationId: string) =>
      [baseUrl, "applications", applicationId, "skills", "introduction"].join(
        "/",
      ),
    applicationQuestions: (applicationId: string) =>
      [baseUrl, "applications", applicationId, "questions"].join("/"),
    applicationQuestionsIntro: (applicationId: string) =>
      [
        baseUrl,
        "applications",
        applicationId,
        "questions",
        "introduction",
      ].join("/"),
    applicationReview: (applicationId: string) =>
      [baseUrl, "applications", applicationId, "review"].join("/"),
    applicationSuccess: (applicationId: string) =>
      [baseUrl, "applications", applicationId, "success"].join("/"),

    // Profile Routes
    profile: (section?: UserProfilePageSectionId) => {
      const fragment = section ? `#${section}` : "";
      return [applicantUrl, "personal-information"].join("/") + fragment;
    },
    verifyContactEmail: (opts?: { emailAddress?: string | null }) => {
      const searchParams = new Map<string, string>();
      if (opts?.emailAddress) {
        searchParams.set("emailAddress", opts.emailAddress);
      }
      return (
        [applicantUrl, "verify-contact-email"].join("/") +
        createSearchQuery(searchParams)
      );
    },
    verifyWorkEmail: () => [applicantUrl, "verify-work-email"].join("/"),

    // Career timeline and recruitment Routes
    careerTimelineAndRecruitment: (opts?: {
      section?: CareerTimelineAndRecruitmentPageSectionId;
    }) => {
      const fragment = opts?.section ? `#${opts.section}` : "";
      return `${[applicantUrl, "career-timeline"].join("/")}${fragment}`;
    },
    editExperience: (experienceId: string) =>
      [applicantUrl, "career-timeline", experienceId, "edit"].join("/"),
    createExperience: () =>
      [applicantUrl, "career-timeline", "create"].join("/"),

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

    // Employee profile
    employeeProfile: () => `${applicantUrl}/employee-profile`,

    skillPortfolio: () => [applicantUrl, "skills"].join("/"),
    skillShowcase: () => [showcase].join("/"),
    editUserSkill: (skillId: string) =>
      [applicantUrl, "skills", skillId].join("/"),
    topBehaviouralSkills: () =>
      [showcase, "top-5-behavioural-skills"].join("/"),
    topTechnicalSkills: () => [showcase, "top-10-technical-skills"].join("/"),
    improveBehaviouralSkills: () =>
      [showcase, "3-behavioural-skills-to-improve"].join("/"),
    improveTechnicalSkills: () =>
      [showcase, "5-technical-skills-to-train"].join("/"),

    // Notifications
    notifications: () => [applicantUrl, "notifications"].join("/"),

    // Directive on digital talent
    directive: () => [baseUrl, "directive-on-digital-talent"].join("/"),

    // Account Settings
    accountSettings: () => [applicantUrl, "settings"].join("/"),

    // Job poster templates
    jobPosterTemplates: () => [baseUrl, "job-templates"].join("/"),
    jobPosterTemplate: (templateId: string) =>
      [baseUrl, "job-templates", templateId].join("/"),

    // Manager pages
    manager: () => managerUrl,

    // IT Training Fund
    itTrainingFund: () => [baseUrl, "it-training-fund"].join("/"),
    instructorLedTraining: () =>
      [baseUrl, "it-training-fund", "instructor-led-training"].join("/"),
    certificationExamVouchers: () =>
      [baseUrl, "it-training-fund", "certification-exam-vouchers"].join("/"),

    // Training Opportunities (Admin)
    trainingOpportunitiesIndex: () =>
      [adminUrl, "training-opportunities"].join("/"),
    trainingOpportunityCreate: () =>
      [adminUrl, "training-opportunities", "create"].join("/"),
    trainingOpportunityView: (trainingOpportunityId: string) =>
      [adminUrl, "training-opportunities", trainingOpportunityId].join("/"),
    trainingOpportunityUpdate: (trainingOpportunityId: string) =>
      [adminUrl, "training-opportunities", trainingOpportunityId, "edit"].join(
        "/",
      ),

    // Admin - Work Streams
    workStreamTable: () => [adminUrl, "settings", "work-streams"].join("/"),
    workStreamCreate: () =>
      [adminUrl, "settings", "work-streams", "create"].join("/"),
    workStreamView: (id: string) => `${adminUrl}/settings/work-streams/${id}`,
    workStreamUpdate: (workStreamId: string) =>
      [adminUrl, "settings", "work-streams", workStreamId, "edit"].join("/"),

    // Communities
    talentMobilityEvents: () => [communitiesUrl, "talent-events"].join("/"),

    /**
     * Deprecated
     *
     * The following paths are deprecated and
     * should contain redirects to new ones.
     */
    myProfileDeprecated: () => ["/", lang, "talent", "profile"].join("/"),
  };
};

const useRoutes = () => {
  const intl = useIntl();
  const locale = getLocale(intl);

  return getRoutes(locale);
};

export default useRoutes;
