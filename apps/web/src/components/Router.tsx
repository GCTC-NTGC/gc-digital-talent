import { createBrowserRouter, redirect } from "react-router";
import { RouterProvider } from "react-router/dom";

import { Locales, useLocale } from "@gc-digital-talent/i18n";
import { POST_LOGOUT_OVERRIDE_PATH_KEY } from "@gc-digital-talent/auth";
import { Loading } from "@gc-digital-talent/ui";
import { defaultLogger } from "@gc-digital-talent/logger";
import { NotFoundError } from "@gc-digital-talent/helpers";
import { FeatureFlags, useFeatureFlags } from "@gc-digital-talent/env";

import { urlMatchesAppHostName } from "~/utils/utils";
import { convert } from "~/utils/routeUtils";

import RootErrorBoundary from "./Layout/RouteErrorBoundary/RootErrorBoundary";

const createRoute = (locale: Locales, featureFlags: FeatureFlags) =>
  createBrowserRouter([
    {
      path: `/`,
      lazy: () => import("./Layout/MainLayout").then(convert),
      ErrorBoundary: RootErrorBoundary,
      HydrateFallback: Loading,
      children: [
        {
          path: locale,
          async lazy() {
            const { RouteErrorBoundary: ErrorBoundary } =
              await import("./Layout/RouteErrorBoundary/RouteErrorBoundary");
            return { ErrorBoundary };
          },
          children: [
            {
              index: true,
              lazy: () =>
                import("../pages/Home/HomePage/HomePage").then(convert),
            },
            {
              path: "executive",
              lazy: () =>
                import("../pages/Home/ExecutiveHomePage/ExecutiveHomePage").then(
                  convert,
                ),
            },
            {
              path: "manager",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/Home/ManagerHomePage/ManagerHomePage").then(
                      convert,
                    ),
                },
              ],
            },
            {
              path: "community",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/CommunityDashboardPage/CommunityDashboardPage").then(
                      convert,
                    ),
                },
              ],
            },
            {
              path: "communities",
              children: [
                {
                  index: true,
                  loader: () => {
                    throw new NotFoundError();
                  },
                },
                {
                  path: "talent-events",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/TalentManagementEventsPage/TalentManagementEventsPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":nominationEventId/create-talent-nomination",
                      lazy: () =>
                        import("../pages/CreateTalentNominationPage/CreateTalentNominationPage").then(
                          convert,
                        ),
                    },
                  ],
                },
                {
                  path: "talent-nominations",
                  children: [
                    {
                      path: ":id",
                      lazy: () =>
                        import("../pages/TalentNominations/NominateTalent/NominateTalentPage").then(
                          convert,
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "support",
              lazy: () =>
                import("../pages/SupportPage/SupportPage").then(convert),
            },
            {
              path: "terms-and-conditions",
              lazy: () =>
                import("../pages/TermsAndConditions/TermsAndConditions").then(
                  convert,
                ),
            },
            {
              path: "privacy-policy",
              lazy: () =>
                import("../pages/PrivacyPolicy/PrivacyPolicy").then(convert),
            },
            {
              path: "accessibility-statement",
              lazy: () =>
                import("../pages/AccessibilityStatementPage/AccessibilityStatementPage").then(
                  convert,
                ),
            },
            {
              path: "inclusivity-equity",
              lazy: () =>
                import("../pages/InclusivityEquityPage/InclusivityEquityPage").then(
                  convert,
                ),
            },
            {
              path: "dnd",
              lazy: () =>
                import("../pages/DNDDigitalCareersPage/DNDDigitalCareersPage").then(
                  convert,
                ),
            },
            {
              path: "workforce-adjustment",
              loader: () => {
                if (!featureFlags.workforceAdjustment) {
                  throw new NotFoundError();
                }
              },
              lazy: () =>
                import("../pages/WorkforceAdjustment/WorkforceAdjustmentPage").then(
                  convert,
                ),
            },
            {
              path: "directive-on-digital-talent",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/DirectivePage/DirectivePage").then(
                      convert,
                    ),
                },
              ],
            },
            {
              path: "hr/resources",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/HumanResources/PlatformResourcesForProfessionalsPage").then(
                      convert,
                    ),
                },
              ],
            },
            {
              path: "search",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/SearchRequests/SearchPage/SearchPage").then(
                      convert,
                    ),
                },
                {
                  path: "request",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/SearchRequests/RequestPage/RequestPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":requestId",
                      lazy: () =>
                        import("../pages/SearchRequests/RequestConfirmationPage/RequestConfirmationPage").then(
                          convert,
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "skills",
              lazy: () => import("../pages/Skills/SkillPage").then(convert),
            },
            {
              path: "register-info",
              lazy: () =>
                import("../pages/Auth/SignUpPage/SignUpPage").then(convert),
            },
            {
              path: "logged-out",
              loader: ({ request }) => {
                const url = new URL(request.url);
                const from = url.searchParams.get("from");
                if (
                  from &&
                  (urlMatchesAppHostName(from) || from.startsWith("/"))
                ) {
                  // eslint-disable-next-line @typescript-eslint/only-throw-error
                  throw redirect(from);
                }

                const overridePath = sessionStorage.getItem(
                  POST_LOGOUT_OVERRIDE_PATH_KEY,
                );
                if (overridePath) {
                  sessionStorage.removeItem(POST_LOGOUT_OVERRIDE_PATH_KEY);
                  if (overridePath.startsWith("/")) {
                    window.location.href = overridePath; // do a hard redirect here because redirectUri may exist in another router entrypoint (eg admin)
                    return null;
                  }
                  defaultLogger.warning(
                    `Retrieved an unsafe uri from POST_LOGOUT_URI: ${overridePath}`,
                  );
                }

                return null;
              },
              lazy: () =>
                import("../pages/Auth/SignedOutPage/SignedOutPage").then(
                  convert,
                ),
            },
            {
              path: "login-info",
              lazy: () =>
                import("../pages/Auth/SignInPage/SignInPage").then(convert),
            },
            {
              path: "registration",
              children: [
                {
                  index: true,
                  loader: () => {
                    throw new NotFoundError();
                  },
                },
                {
                  path: "account",
                  lazy: () =>
                    import("../pages/Auth/RegistrationPages/GettingStartedPage/GettingStartedPage").then(
                      convert,
                    ),
                },
                {
                  path: "experience",
                  lazy: () =>
                    import("../pages/Auth/RegistrationPages/EmployeeInformationPage/EmployeeInformationPage").then(
                      convert,
                    ),
                },
              ],
            },
            {
              path: "applicant",
              lazy: () =>
                import("../pages/Auth/RegistrationPages/RegistrationRedirect").then(
                  convert,
                ),
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/ApplicantDashboardPage/ApplicantDashboardPage").then(
                      convert,
                    ),
                },
                {
                  path: "dashboard",
                  lazy: () =>
                    import("../pages/ApplicantDashboardPage/ApplicantDashboardPage").then(
                      convert,
                    ),
                },
                {
                  path: "settings",
                  lazy: () =>
                    import("../pages/Profile/AccountSettings/AccountSettingsPage").then(
                      convert,
                    ),
                },
                {
                  path: "notifications",
                  lazy: () =>
                    import("../pages/Notifications/NotificationsPage/NotificationsPage").then(
                      convert,
                    ),
                },
                {
                  path: "employee-profile",
                  lazy: () =>
                    import("../pages/EmployeeProfile/EmployeeProfilePage").then(
                      convert,
                    ),
                },
                {
                  path: "personal-information",
                  lazy: () =>
                    import("../pages/Profile/ProfilePage/ProfilePage").then(
                      convert,
                    ),
                },
                {
                  path: "career-timeline",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/Profile/CareerTimelinePage/CareerTimelinePage").then(
                          convert,
                        ),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import("../pages/Profile/ExperienceFormPage/CreateExperienceFormPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":experienceId",
                      children: [
                        {
                          path: "edit",
                          lazy: () =>
                            import("../pages/Profile/ExperienceFormPage/EditExperienceFormPage").then(
                              convert,
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "skills",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/Skills/SkillPortfolioPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":skillId",
                      lazy: () =>
                        import("../pages/Skills/UpdateUserSkillPage").then(
                          convert,
                        ),
                    },
                    {
                      path: "showcase",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Skills/SkillShowcasePage").then(
                              convert,
                            ),
                        },
                        {
                          path: "top-5-behavioural-skills",
                          lazy: () =>
                            import("../pages/Skills/TopBehaviouralSkillsPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "top-10-technical-skills",
                          lazy: () =>
                            import("../pages/Skills/TopTechnicalSkillsPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "3-behavioural-skills-to-improve",
                          lazy: () =>
                            import("../pages/Skills/ImproveBehaviouralSkillsPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "5-technical-skills-to-train",
                          lazy: () =>
                            import("../pages/Skills/ImproveTechnicalSkillsPage").then(
                              convert,
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "verify-contact-email",
                  lazy: () =>
                    import("../pages/EmailVerificationPages/ProfileContactEmailVerificationPage").then(
                      convert,
                    ),
                },
                {
                  path: "verify-work-email",
                  lazy: () =>
                    import("../pages/EmailVerificationPages/ProfileWorkEmailVerificationPage").then(
                      convert,
                    ),
                },
                {
                  path: "community-interests",
                  children: [
                    {
                      index: true,
                      loader: () => {
                        throw new NotFoundError();
                      },
                    },
                    {
                      path: ":communityInterestId",
                      lazy: () =>
                        import("../pages/CommunityInterests/UpdateCommunityInterestPage/UpdateCommunityInterestPage").then(
                          convert,
                        ),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import("../pages/CommunityInterests/CreateCommunityInterestPage/CreateCommunityInterestPage").then(
                          convert,
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "browse",
              children: [
                {
                  index: true,
                  loader: () => {
                    throw new NotFoundError();
                  },
                },
                {
                  path: "pools",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/Pools/BrowsePoolsPage/BrowsePoolsPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":poolId",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Pools/PoolAdvertisementPage/PoolAdvertisementPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create-application",
                          lazy: () =>
                            import("../pages/CreateApplicationPage/CreateApplicationPage").then(
                              convert,
                            ),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "applications",
              children: [
                {
                  index: true,
                  loader: () => {
                    throw new NotFoundError();
                  },
                },
                {
                  path: ":applicationId",
                  lazy: () =>
                    import("../pages/Applications/ApplicationLayout").then(
                      convert,
                    ),
                  children: [
                    {
                      path: "welcome",
                      lazy: () =>
                        import("../pages/Applications/ApplicationWelcomePage/ApplicationWelcomePage").then(
                          convert,
                        ),
                    },
                    {
                      path: "self-declaration",
                      lazy: () =>
                        import("../pages/Applications/ApplicationSelfDeclarationPage/ApplicationSelfDeclarationPage").then(
                          convert,
                        ),
                    },
                    {
                      path: "profile",
                      lazy: () =>
                        import("../pages/Applications/ApplicationProfilePage/ApplicationProfilePage").then(
                          convert,
                        ),
                    },
                    {
                      path: "career-timeline",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Applications/ApplicationCareerTimelinePage/ApplicationCareerTimelinePage").then(
                              convert,
                            ),
                        },
                        {
                          path: "introduction",
                          lazy: () =>
                            import("../pages/Applications/ApplicationCareerTimelineIntroductionPage/ApplicationCareerTimelineIntroductionPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "add",
                          lazy: () =>
                            import("../pages/Applications/ApplicationCareerTimelineAddPage/ApplicationCareerTimelineAddPage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":experienceId",
                          lazy: () =>
                            import("../pages/Applications/ApplicationCareerTimelineEditPage/ApplicationCareerTimelineEditPage").then(
                              convert,
                            ),
                        },
                      ],
                    },
                    {
                      path: "education",
                      lazy: () =>
                        import("../pages/Applications/ApplicationEducationPage/ApplicationEducationPage").then(
                          convert,
                        ),
                    },
                    {
                      path: "skills",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Applications/ApplicationSkillsPage/ApplicationSkillsPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "introduction",
                          lazy: () =>
                            import("../pages/Applications/ApplicationSkillsIntroductionPage/ApplicationSkillsIntroductionPage").then(
                              convert,
                            ),
                        },
                      ],
                    },
                    {
                      path: "questions",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Applications/ApplicationQuestionsPage/ApplicationQuestionsPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "introduction",
                          lazy: () =>
                            import("../pages/Applications/ApplicationQuestionsIntroductionPage/ApplicationQuestionsIntroductionPage").then(
                              convert,
                            ),
                        },
                      ],
                    },
                    {
                      path: "review",
                      lazy: () =>
                        import("../pages/Applications/ApplicationReviewPage/ApplicationReviewPage").then(
                          convert,
                        ),
                    },
                    {
                      path: "success",
                      lazy: () =>
                        import("../pages/Applications/ApplicationSuccessPage/ApplicationSuccessPage").then(
                          convert,
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "job-templates",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/JobPosterTemplates/JobPosterTemplatesPage/JobPosterTemplatesPage").then(
                      convert,
                    ),
                },
                {
                  path: ":templateId",
                  lazy: () =>
                    import("../pages/JobPosterTemplates/JobPosterTemplatePage/JobPosterTemplatePage").then(
                      convert,
                    ),
                },
              ],
            },
            {
              path: "it-training-fund",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/ItTrainingFundPage/ItTrainingFundPage").then(
                      convert,
                    ),
                },
                {
                  path: "instructor-led-training",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/InstructorLedTrainingPage/InstructorLedTrainingPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":id",
                      lazy: () =>
                        import("../pages/TrainingOpportunities/TrainingOpportunityPage").then(
                          convert,
                        ),
                    },
                  ],
                },
                {
                  path: "certification-exam-vouchers",
                  lazy: () =>
                    import("../pages/CertificationExamVouchersPage/CertificationExamVouchersPage").then(
                      convert,
                    ),
                },
              ],
            },
            {
              path: "comptrollership-executives",
              lazy: () =>
                import("../pages/ComptrollershipExecutivesPage/ComptrollershipExecutivesPage").then(
                  convert,
                ),
            },
            {
              path: "admin",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/AdminDashboardPage/AdminDashboardPage").then(
                      convert,
                    ),
                },
                {
                  path: "roles-and-permissions",
                  lazy: () =>
                    import("../pages/Auth/RolesAndPermissionsPage/RolesAndPermissionsPage").then(
                      convert,
                    ),
                },
                {
                  path: "users",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/Users/IndexUserPage/IndexUserPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":userId",
                      lazy: () =>
                        import("../pages/Users/UserLayout").then(convert),
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Users/AdminApplicantProfilePage/AdminApplicantProfilePage").then(
                              convert,
                            ),
                        },
                        {
                          path: "employee-profile",
                          lazy: () =>
                            import("../pages/Users/UserEmployeeInformationPage/UserEmployeeInformationPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "experience",
                          lazy: () =>
                            import("../pages/Users/AdminCareerExperiencePage/AdminCareerExperiencePage").then(
                              convert,
                            ),
                        },
                        {
                          path: "skills",
                          lazy: () =>
                            import("../pages/Users/AdminUserSkillsPage/AdminUserSkillsPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "recruitment",
                          lazy: () =>
                            import("../pages/Users/AdminUserRecruitmentPage/AdminUserRecruitmentPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "tools",
                          lazy: () =>
                            import("../pages/Users/AdminUserAdvancedToolsPage/AdminUserAdvancedToolsPage").then(
                              convert,
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "communities",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/Communities/IndexCommunityPage/IndexCommunityPage").then(
                          convert,
                        ),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import("../pages/Communities/CreateCommunityPage/CreateCommunityPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":communityId",
                      lazy: () =>
                        import("../pages/Communities/CommunityLayout").then(
                          convert,
                        ),
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Communities/ViewCommunityPage/ViewCommunityPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "manage-access",
                          lazy: () =>
                            import("../pages/Communities/CommunityMembersPage/CommunityMembersPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "edit",
                          lazy: () =>
                            import("../pages/Communities/UpdateCommunityPage/UpdateCommunityPage").then(
                              convert,
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "pools",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/Pools/IndexPoolPage/IndexPoolPage").then(
                          convert,
                        ),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import("../pages/Pools/CreatePoolPage/CreatePoolPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":poolId",
                      lazy: () =>
                        import("../pages/Pools/PoolLayout").then(convert),
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Pools/ViewPoolPage/ViewPoolPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "edit",
                          lazy: () =>
                            import("../pages/Pools/EditPoolPage/EditPoolPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "pool-candidates",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/PoolCandidates/IndexPoolCandidatePage/IndexPoolCandidatePage").then(
                                  convert,
                                ),
                            },
                          ],
                        },
                        {
                          path: "manage-access",
                          lazy: () =>
                            import("../pages/Pools/ManageAccessPage/ManageAccessPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "plan",
                          lazy: () =>
                            import("../pages/Pools/AssessmentPlanBuilderPage/AssessmentPlanBuilderPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "activity",
                          lazy: () =>
                            import("../pages/Pools/PoolActivityPage/PoolActivityPage").then(
                              convert,
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "pools/:poolId/preview",
                  lazy: () =>
                    import("../pages/Pools/PoolAdvertisementPage/PoolAdvertisementPage").then(
                      convert,
                    ),
                },
                {
                  path: "pool-candidates",
                  lazy: () =>
                    import("../pages/PoolCandidates/AllPoolCandidatesPage/AllPoolCandidatesPage").then(
                      convert,
                    ),
                },
                {
                  path: "candidates/:poolCandidateId/application",
                  lazy: () =>
                    import("../pages/PoolCandidates/ViewPoolCandidatePage/ViewPoolCandidatePage").then(
                      convert,
                    ),
                },
                {
                  path: "talent-events",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/TalentEvents/IndexTalentEventPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":eventId",
                      lazy: () =>
                        import("../pages/TalentEvents/TalentEvent/Layout").then(
                          convert,
                        ),
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/TalentEvents/TalentEvent/DetailsPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "nominations",
                          lazy: () =>
                            import("../pages/TalentEvents/TalentEvent/NominationsPage").then(
                              convert,
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "talent-events/:eventId/nominations/:talentNominationGroupId",
                  lazy: () =>
                    import("../pages/TalentNominations/NominationGroup/Layout").then(
                      convert,
                    ),
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/TalentNominations/NominationGroup/Details").then(
                          convert,
                        ),
                    },
                    {
                      path: "profile",
                      lazy: () =>
                        import("../pages/TalentNominations/NominationGroup/Profile").then(
                          convert,
                        ),
                    },
                    {
                      path: "career-experience",
                      lazy: () =>
                        import("../pages/TalentNominations/NominationGroup/CareerExperience").then(
                          convert,
                        ),
                    },
                  ],
                },
                {
                  path: "talent-requests",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/SearchRequests/IndexSearchRequestPage/IndexSearchRequestPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":searchRequestId",
                      lazy: () =>
                        import("../pages/SearchRequests/ViewSearchRequestPage/ViewSearchRequestPage").then(
                          convert,
                        ),
                    },
                  ],
                },
                {
                  path: "training-opportunities",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/TrainingOpportunities/IndexTrainingOpportunitiesPage").then(
                          convert,
                        ),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import("../pages/TrainingOpportunities/CreateTrainingOpportunityPage").then(
                          convert,
                        ),
                    },
                    {
                      path: ":trainingOpportunityId",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/TrainingOpportunities/ViewTrainingOpportunityPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "edit",
                          lazy: () =>
                            import("../pages/TrainingOpportunities/UpdateTrainingOpportunityPage").then(
                              convert,
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "settings",
                  children: [
                    {
                      index: true,
                      loader: () => {
                        throw new NotFoundError();
                      },
                    },
                    {
                      path: "classifications",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Classifications/IndexClassificationPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/Classifications/CreateClassificationPage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":classificationId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/Classifications/ViewClassificationPage").then(
                                  convert,
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import("../pages/Classifications/UpdateClassificationPage").then(
                                  convert,
                                ),
                            },
                          ],
                        },
                      ],
                    },
                    {
                      path: "departments",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Departments/IndexDepartmentPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/Departments/CreateDepartmentPage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":departmentId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/Departments/ViewDepartmentPage").then(
                                  convert,
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import("../pages/Departments/UpdateDepartmentPage").then(
                                  convert,
                                ),
                            },
                            {
                              path: "advanced-tools",
                              lazy: () =>
                                import("../pages/Departments/AdvancedToolsDepartmentPage").then(
                                  convert,
                                ),
                            },
                          ],
                        },
                      ],
                    },
                    {
                      path: "skills",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Skills/IndexSkillPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/Skills/CreateSkillPage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":skillId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/Skills/ViewSkillPage").then(
                                  convert,
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import("../pages/Skills/UpdateSkillPage").then(
                                  convert,
                                ),
                            },
                          ],
                        },
                      ],
                    },
                    {
                      path: "skill-families",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/SkillFamilies/IndexSkillFamilyPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/SkillFamilies/CreateSkillFamilyPage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":skillFamilyId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/SkillFamilies/ViewSkillFamilyPage").then(
                                  convert,
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import("../pages/SkillFamilies/UpdateSkillFamilyPage").then(
                                  convert,
                                ),
                            },
                          ],
                        },
                      ],
                    },
                    {
                      path: "announcements",
                      lazy: () =>
                        import("../pages/AnnouncementsPage/AnnouncementsPage").then(
                          convert,
                        ),
                    },
                    {
                      path: "work-streams",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/WorkStreams/IndexWorkStreamPage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/WorkStreams/CreateWorkStreamPage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":workStreamId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/WorkStreams/ViewWorkStreamsPage").then(
                                  convert,
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import("../pages/WorkStreams/UpdateWorkStreamPage").then(
                                  convert,
                                ),
                            },
                          ],
                        },
                      ],
                    },
                    {
                      path: "job-templates",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/JobPosterTemplateAdminPages/IndexJobPosterTemplatePage/IndexJobPosterTemplatePage").then(
                              convert,
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/JobPosterTemplateAdminPages/CreateJobPosterTemplatePage/CreateJobPosterTemplatePage").then(
                              convert,
                            ),
                        },
                        {
                          path: ":jobPosterTemplateId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/JobPosterTemplateAdminPages/UpdateJobPosterTemplatePage/UpdateJobPosterTemplatePage").then(
                                  convert,
                                ),
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "community-talent",
                  lazy: () =>
                    import("../pages/CommunityInterests/CommunityTalentPage/CommunityTalentPage").then(
                      convert,
                    ),
                },
                {
                  path: "wfa-employees",
                  lazy: () =>
                    import("../pages/WorkforceAdjustment/IndexWorkforceAdjustmentPage/IndexWorkforceAdjustmentPage").then(
                      convert,
                    ),
                },
                {
                  path: "*",
                  loader: () => {
                    throw new NotFoundError();
                  },
                },
              ],
            },
            {
              path: "*",
              loader: () => {
                throw new NotFoundError();
              },
            },
          ],
        },
        {
          path: "*",
          loader: () => {
            throw new NotFoundError();
          },
        },
      ],
    },

    {
      path: `${locale}/indigenous-it-apprentice`,
      lazy: () => import("./Layout/IAPLayout").then(convert),
      children: [
        {
          index: true,
          lazy: () => import("../pages/Home/IAPHomePage/Home").then(convert),
        },
        {
          path: "hire",
          lazy: () =>
            import("../pages/Home/IAPManagerHomePage/IAPManagerHomePage").then(
              convert,
            ),
        },
        {
          path: "*",
          loader: () => {
            throw new NotFoundError();
          },
        },
      ],
    },
  ]);

const Router = () => {
  // eslint-disable-next-line no-restricted-syntax
  const { locale } = useLocale();
  const featureFlags = useFeatureFlags();
  const router = createRoute(locale, featureFlags);

  return <RouterProvider router={router} />;
};

export default Router;
