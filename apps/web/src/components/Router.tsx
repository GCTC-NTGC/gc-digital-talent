import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { Locales, useLocale } from "@gc-digital-talent/i18n";
import { POST_LOGOUT_OVERRIDE_PATH_KEY } from "@gc-digital-talent/auth";
import { Loading } from "@gc-digital-talent/ui";
import { defaultLogger } from "@gc-digital-talent/logger";
import { NotFoundError } from "@gc-digital-talent/helpers";
import { useFeatureFlags } from "@gc-digital-talent/env";

const createRoute = (locale: Locales, newApplicantDashboard: boolean) =>
  createBrowserRouter([
    {
      path: `/`,
      lazy: () => import("./Layout/MainLayout"),
      HydrateFallback: Loading,
      children: [
        {
          path: locale,
          async lazy() {
            const { RouteErrorBoundary: ErrorBoundary } = await import(
              "./Layout/RouteErrorBoundary/RouteErrorBoundary"
            );
            return { ErrorBoundary };
          },
          children: [
            {
              index: true,
              lazy: () => import("../pages/Home/HomePage/HomePage"),
            },
            {
              path: "executive",
              lazy: () =>
                import("../pages/Home/ExecutiveHomePage/ExecutiveHomePage"),
            },
            {
              path: "manager",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/Home/ManagerHomePage/ManagerHomePage"),
                },
              ],
            },
            {
              path: "community",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import(
                      "../pages/CommunityDashboardPage/CommunityDashboardPage"
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
                        import(
                          "../pages/TalentManagementEventsPage/TalentManagementEventsPage"
                        ),
                    },
                    {
                      path: ":nominationEventId/create-talent-nomination",
                      lazy: () =>
                        import(
                          "../pages/CreateTalentNominationPage/CreateTalentNominationPage"
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
                        import(
                          "../pages/TalentNominations/NominateTalent/NominateTalentPage"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "support",
              lazy: () => import("../pages/SupportPage/SupportPage"),
            },
            {
              path: "terms-and-conditions",
              lazy: () =>
                import("../pages/TermsAndConditions/TermsAndConditions"),
            },
            {
              path: "privacy-policy",
              lazy: () => import("../pages/PrivacyPolicy/PrivacyPolicy"),
            },
            {
              path: "accessibility-statement",
              lazy: () =>
                import(
                  "../pages/AccessibilityStatementPage/AccessibilityStatementPage"
                ),
            },
            {
              path: "inclusivity-equity",
              lazy: () =>
                import("../pages/InclusivityEquityPage/InclusivityEquityPage"),
            },
            {
              path: "directive-on-digital-talent",
              children: [
                {
                  index: true,
                  lazy: () => import("../pages/DirectivePage/DirectivePage"),
                },
              ],
            },
            {
              path: "search",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/SearchRequests/SearchPage/SearchPage"),
                },
                {
                  path: "request",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import(
                          "../pages/SearchRequests/RequestPage/RequestPage"
                        ),
                    },
                    {
                      path: ":requestId",
                      lazy: () =>
                        import(
                          "../pages/SearchRequests/RequestConfirmationPage/RequestConfirmationPage"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "skills",
              lazy: () => import("../pages/Skills/SkillPage"),
            },
            {
              path: "register-info",
              lazy: () => import("../pages/Auth/SignUpPage/SignUpPage"),
            },
            {
              path: "logged-out",
              loader: () => {
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
              lazy: () => import("../pages/Auth/SignedOutPage/SignedOutPage"),
            },
            {
              path: "login-info",
              lazy: () => import("../pages/Auth/SignInPage/SignInPage"),
            },
            {
              path: "getting-started",
              lazy: () =>
                import(
                  "../pages/Auth/RegistrationPages/GettingStartedPage/GettingStartedPage"
                ),
            },
            {
              path: "email-verification",
              lazy: () =>
                import(
                  "../pages/Auth/RegistrationPages/RegistrationContactEmailVerificationPage"
                ),
            },
            {
              path: "employee-registration",
              lazy: () =>
                import(
                  "../pages/Auth/RegistrationPages/EmployeeInformationPage/EmployeeInformationPage"
                ),
            },
            {
              path: "work-email-verification",
              lazy: () =>
                import(
                  "../pages/Auth/RegistrationPages/RegistrationWorkEmailVerificationPage"
                ),
            },
            {
              path: "applicant",
              lazy: () =>
                import("../pages/Auth/RegistrationPages/RegistrationRedirect"),
              children: [
                {
                  index: true,
                  lazy: () =>
                    newApplicantDashboard
                      ? import(
                          "../pages/ApplicantDashboardPage/ApplicantDashboardPage"
                        )
                      : import(
                          "../pages/ProfileAndApplicationsPage/ProfileAndApplicationsPage"
                        ),
                },
                {
                  path: "dashboard",
                  lazy: () =>
                    newApplicantDashboard
                      ? import(
                          "../pages/ApplicantDashboardPage/ApplicantDashboardPage"
                        )
                      : import(
                          "../pages/ProfileAndApplicationsPage/ProfileAndApplicationsPage"
                        ),
                },
                {
                  path: "settings",
                  lazy: () =>
                    import(
                      "../pages/Profile/AccountSettings/AccountSettingsPage"
                    ),
                },
                {
                  path: "notifications",
                  lazy: () =>
                    import(
                      "../pages/Notifications/NotificationsPage/NotificationsPage"
                    ),
                },
                {
                  path: "employee-profile",
                  lazy: () =>
                    import("../pages/EmployeeProfile/EmployeeProfilePage"),
                },
                {
                  path: "personal-information",
                  lazy: () =>
                    import("../pages/Profile/ProfilePage/ProfilePage"),
                },
                {
                  path: "career-timeline",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import(
                          "../pages/Profile/CareerTimelineAndRecruitmentPage/CareerTimelineAndRecruitmentPage"
                        ),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import(
                          "../pages/Profile/ExperienceFormPage/CreateExperienceFormPage"
                        ),
                    },
                    {
                      path: ":experienceId",
                      children: [
                        {
                          path: "edit",
                          lazy: () =>
                            import(
                              "../pages/Profile/ExperienceFormPage/EditExperienceFormPage"
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
                      lazy: () => import("../pages/Skills/SkillPortfolioPage"),
                    },
                    {
                      path: ":skillId",
                      lazy: () => import("../pages/Skills/UpdateUserSkillPage"),
                    },
                    {
                      path: "showcase",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Skills/SkillShowcasePage"),
                        },
                        {
                          path: "top-5-behavioural-skills",
                          lazy: () =>
                            import("../pages/Skills/TopBehaviouralSkillsPage"),
                        },
                        {
                          path: "top-10-technical-skills",
                          lazy: () =>
                            import("../pages/Skills/TopTechnicalSkillsPage"),
                        },
                        {
                          path: "3-behavioural-skills-to-improve",
                          lazy: () =>
                            import(
                              "../pages/Skills/ImproveBehaviouralSkillsPage"
                            ),
                        },
                        {
                          path: "5-technical-skills-to-train",
                          lazy: () =>
                            import(
                              "../pages/Skills/ImproveTechnicalSkillsPage"
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "verify-contact-email",
                  lazy: () =>
                    import(
                      "../pages/EmailVerificationPages/ProfileContactEmailVerificationPage"
                    ),
                },
                {
                  path: "verify-work-email",
                  lazy: () =>
                    import(
                      "../pages/EmailVerificationPages/ProfileWorkEmailVerificationPage"
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
                        import(
                          "../pages/CommunityInterests/UpdateCommunityInterestPage/UpdateCommunityInterestPage"
                        ),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import(
                          "../pages/CommunityInterests/CreateCommunityInterestPage/CreateCommunityInterestPage"
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
                        import(
                          "../pages/Pools/BrowsePoolsPage/BrowsePoolsPage"
                        ),
                    },
                    {
                      path: ":poolId",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import(
                              "../pages/Pools/PoolAdvertisementPage/PoolAdvertisementPage"
                            ),
                        },
                        {
                          path: "create-application",
                          lazy: () =>
                            import(
                              "../pages/CreateApplicationPage/CreateApplicationPage"
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
                  lazy: () => import("../pages/Applications/ApplicationLayout"),
                  children: [
                    {
                      path: "welcome",
                      lazy: () =>
                        import(
                          "../pages/Applications/ApplicationWelcomePage/ApplicationWelcomePage"
                        ),
                    },
                    {
                      path: "self-declaration",
                      lazy: () =>
                        import(
                          "../pages/Applications/ApplicationSelfDeclarationPage/ApplicationSelfDeclarationPage"
                        ),
                    },
                    {
                      path: "profile",
                      lazy: () =>
                        import(
                          "../pages/Applications/ApplicationProfilePage/ApplicationProfilePage"
                        ),
                    },
                    {
                      path: "career-timeline",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationCareerTimelinePage/ApplicationCareerTimelinePage"
                            ),
                        },
                        {
                          path: "introduction",
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationCareerTimelineIntroductionPage/ApplicationCareerTimelineIntroductionPage"
                            ),
                        },
                        {
                          path: "add",
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationCareerTimelineAddPage/ApplicationCareerTimelineAddPage"
                            ),
                        },
                        {
                          path: ":experienceId",
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationCareerTimelineEditPage/ApplicationCareerTimelineEditPage"
                            ),
                        },
                      ],
                    },
                    {
                      path: "education",
                      lazy: () =>
                        import(
                          "../pages/Applications/ApplicationEducationPage/ApplicationEducationPage"
                        ),
                    },
                    {
                      path: "skills",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationSkillsPage/ApplicationSkillsPage"
                            ),
                        },
                        {
                          path: "introduction",
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationSkillsIntroductionPage/ApplicationSkillsIntroductionPage"
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
                            import(
                              "../pages/Applications/ApplicationQuestionsPage/ApplicationQuestionsPage"
                            ),
                        },
                        {
                          path: "introduction",
                          lazy: () =>
                            import(
                              "../pages/Applications/ApplicationQuestionsIntroductionPage/ApplicationQuestionsIntroductionPage"
                            ),
                        },
                      ],
                    },
                    {
                      path: "review",
                      lazy: () =>
                        import(
                          "../pages/Applications/ApplicationReviewPage/ApplicationReviewPage"
                        ),
                    },
                    {
                      path: "success",
                      lazy: () =>
                        import(
                          "../pages/Applications/ApplicationSuccessPage/ApplicationSuccessPage"
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
                    import(
                      "../pages/JobPosterTemplates/JobPosterTemplatesPage/JobPosterTemplatesPage"
                    ),
                },
                {
                  path: ":templateId",
                  lazy: () =>
                    import(
                      "../pages/JobPosterTemplates/JobPosterTemplatePage/JobPosterTemplatePage"
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
                    import("../pages/ItTrainingFundPage/ItTrainingFundPage"),
                },
                {
                  path: "instructor-led-training",
                  lazy: () =>
                    import(
                      "../pages/InstructorLedTrainingPage/InstructorLedTrainingPage"
                    ),
                },
                {
                  path: "certification-exam-vouchers",
                  lazy: () =>
                    import(
                      "../pages/CertificationExamVouchersPage/CertificationExamVouchersPage"
                    ),
                },
              ],
            },
            {
              path: "comptrollership-executives",
              lazy: () =>
                import(
                  "../pages/ComptrollershipExecutivesPage/ComptrollershipExecutivesPage"
                ),
            },
            {
              path: "admin",
              children: [
                {
                  index: true,
                  lazy: () =>
                    import("../pages/AdminDashboardPage/AdminDashboardPage"),
                },
                {
                  path: "users",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/Users/IndexUserPage/IndexUserPage"),
                    },
                    {
                      path: ":userId",
                      lazy: () => import("../pages/Users/UserLayout"),
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import(
                              "../pages/Users/UserInformationPage/UserInformationPage"
                            ),
                        },
                        {
                          path: "employee-profile",
                          lazy: () =>
                            import(
                              "../pages/Users/UserEmployeeInformationPage/UserEmployeeInformationPage"
                            ),
                        },
                        {
                          path: "profile",
                          lazy: () =>
                            import(
                              "../pages/Users/AdminUserProfilePage/AdminUserProfilePage"
                            ),
                        },
                        {
                          path: "edit",
                          lazy: () =>
                            import(
                              "../pages/Users/UpdateUserPage/UpdateUserPage"
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
                        import(
                          "../pages/Communities/IndexCommunityPage/IndexCommunityPage"
                        ),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import(
                          "../pages/Communities/CreateCommunityPage/CreateCommunityPage"
                        ),
                    },
                    {
                      path: ":communityId",
                      lazy: () =>
                        import("../pages/Communities/CommunityLayout"),
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import(
                              "../pages/Communities/ViewCommunityPage/ViewCommunityPage"
                            ),
                        },
                        {
                          path: "manage-access",
                          lazy: () =>
                            import(
                              "../pages/Communities/CommunityMembersPage/CommunityMembersPage"
                            ),
                        },
                        {
                          path: "edit",
                          lazy: () =>
                            import(
                              "../pages/Communities/UpdateCommunityPage/UpdateCommunityPage"
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
                        import("../pages/Pools/IndexPoolPage/IndexPoolPage"),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import("../pages/Pools/CreatePoolPage/CreatePoolPage"),
                    },
                    {
                      path: ":poolId",
                      lazy: () => import("../pages/Pools/PoolLayout"),
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/Pools/ViewPoolPage/ViewPoolPage"),
                        },
                        {
                          path: "edit",
                          lazy: () =>
                            import("../pages/Pools/EditPoolPage/EditPoolPage"),
                        },
                        {
                          path: "pool-candidates",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import(
                                  "../pages/PoolCandidates/IndexPoolCandidatePage/IndexPoolCandidatePage"
                                ),
                            },
                          ],
                        },
                        {
                          path: "screening",
                          lazy: () =>
                            import(
                              "../pages/Pools/ScreeningAndEvaluationPage/ScreeningAndEvaluationPage"
                            ),
                        },
                        {
                          path: "manage-access",
                          lazy: () =>
                            import(
                              "../pages/Pools/ManageAccessPage/ManageAccessPage"
                            ),
                        },
                        {
                          path: "plan",
                          lazy: () =>
                            import(
                              "../pages/Pools/AssessmentPlanBuilderPage/AssessmentPlanBuilderPage"
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "pools/:poolId/preview",
                  lazy: () =>
                    import(
                      "../pages/Pools/PoolAdvertisementPage/PoolAdvertisementPage"
                    ),
                },
                {
                  path: "pool-candidates",
                  lazy: () =>
                    import(
                      "../pages/PoolCandidates/AllPoolCandidatesPage/AllPoolCandidatesPage"
                    ),
                },
                {
                  path: "candidates/:poolCandidateId/application",
                  lazy: () =>
                    import(
                      "../pages/PoolCandidates/ViewPoolCandidatePage/ViewPoolCandidatePage"
                    ),
                },
                {
                  path: "talent-events",
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("../pages/TalentEvents/IndexTalentEventPage"),
                    },
                    {
                      path: ":eventId",
                      lazy: () =>
                        import("../pages/TalentEvents/TalentEvent/Layout"),
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import(
                              "../pages/TalentEvents/TalentEvent/DetailsPage"
                            ),
                        },
                        {
                          path: "nominations",
                          lazy: () =>
                            import(
                              "../pages/TalentEvents/TalentEvent/NominationsPage"
                            ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "talent-events/:eventId/nominations/:talentNominationGroupId",
                  lazy: () =>
                    import("../pages/TalentNominations/NominationGroup/Layout"),
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import(
                          "../pages/TalentNominations/NominationGroup/Details"
                        ),
                    },
                    {
                      path: "profile",
                      lazy: () =>
                        import(
                          "../pages/TalentNominations/NominationGroup/Profile"
                        ),
                    },
                    {
                      path: "career-experience",
                      lazy: () =>
                        import(
                          "../pages/TalentNominations/NominationGroup/CareerExperience"
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
                        import(
                          "../pages/SearchRequests/IndexSearchRequestPage/IndexSearchRequestPage"
                        ),
                    },
                    {
                      path: ":searchRequestId",
                      lazy: () =>
                        import(
                          "../pages/SearchRequests/ViewSearchRequestPage/ViewSearchRequestPage"
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
                        import(
                          "../pages/TrainingOpportunities/IndexTrainingOpportunitiesPage"
                        ),
                    },
                    {
                      path: "create",
                      lazy: () =>
                        import(
                          "../pages/TrainingOpportunities/CreateTrainingOpportunityPage"
                        ),
                    },
                    {
                      path: ":trainingOpportunityId",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import(
                              "../pages/TrainingOpportunities/ViewTrainingOpportunityPage"
                            ),
                        },
                        {
                          path: "edit",
                          lazy: () =>
                            import(
                              "../pages/TrainingOpportunities/UpdateTrainingOpportunityPage"
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
                            import(
                              "../pages/Classifications/IndexClassificationPage"
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import(
                              "../pages/Classifications/CreateClassificationPage"
                            ),
                        },
                        {
                          path: ":classificationId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import(
                                  "../pages/Classifications/ViewClassificationPage"
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import(
                                  "../pages/Classifications/UpdateClassificationPage"
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
                            import("../pages/Departments/IndexDepartmentPage"),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/Departments/CreateDepartmentPage"),
                        },
                        {
                          path: ":departmentId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import(
                                  "../pages/Departments/ViewDepartmentPage"
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import(
                                  "../pages/Departments/UpdateDepartmentPage"
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
                          lazy: () => import("../pages/Skills/IndexSkillPage"),
                        },
                        {
                          path: "create",
                          lazy: () => import("../pages/Skills/CreateSkillPage"),
                        },
                        {
                          path: ":skillId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import("../pages/Skills/ViewSkillPage"),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import("../pages/Skills/UpdateSkillPage"),
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
                            import(
                              "../pages/SkillFamilies/IndexSkillFamilyPage"
                            ),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import(
                              "../pages/SkillFamilies/CreateSkillFamilyPage"
                            ),
                        },
                        {
                          path: ":skillFamilyId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import(
                                  "../pages/SkillFamilies/ViewSkillFamilyPage"
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import(
                                  "../pages/SkillFamilies/UpdateSkillFamilyPage"
                                ),
                            },
                          ],
                        },
                      ],
                    },
                    {
                      path: "announcements",
                      lazy: () =>
                        import("../pages/AnnouncementsPage/AnnouncementsPage"),
                    },
                    {
                      path: "work-streams",
                      children: [
                        {
                          index: true,
                          lazy: () =>
                            import("../pages/WorkStreams/IndexWorkStreamPage"),
                        },
                        {
                          path: "create",
                          lazy: () =>
                            import("../pages/WorkStreams/CreateWorkStreamPage"),
                        },
                        {
                          path: ":workStreamId",
                          children: [
                            {
                              index: true,
                              lazy: () =>
                                import(
                                  "../pages/WorkStreams/ViewWorkStreamsPage"
                                ),
                            },
                            {
                              path: "edit",
                              lazy: () =>
                                import(
                                  "../pages/WorkStreams/UpdateWorkStreamPage"
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
                    import(
                      "../pages/CommunityInterests/CommunityTalentPage/CommunityTalentPage"
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
      lazy: () => import("./Layout/IAPLayout"),
      children: [
        {
          index: true,
          lazy: () => import("../pages/Home/IAPHomePage/Home"),
        },
        {
          path: "hire",
          lazy: () =>
            import("../pages/Home/IAPManagerHomePage/IAPManagerHomePage"),
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
  const { newApplicantDashboard } = useFeatureFlags();
  const router = createRoute(locale, newApplicantDashboard);

  return <RouterProvider router={router} />;
};

export default Router;
