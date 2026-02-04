import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  // Need the top level route
  // it should just redirect to locale if user ever gets here
  route("/", "./pages/Root/RootRoute.tsx", [
    ...prefix(":locale", [
      layout("./components/Layout/MainLayout.tsx", [
        // NOTE: Required for the nice error boundary
        route("", "./pages/Root/ErrorBoundaryWrapper.tsx", [
          // Static pages
          index("./pages/Home/HomePage/HomePage.tsx"),
          route(
            "executive",
            "./pages/Home/ExecutiveHomePage/ExecutiveHomePage.tsx",
          ),
          route("manager", "./pages/Home/ManagerHomePage/ManagerHomePage.tsx"),
          route("support", "./pages/SupportPage/SupportPage.tsx"),
          route(
            "terms-and-conditions",
            "./pages/TermsAndConditions/TermsAndConditions.tsx",
          ),
          route("privacy-policy", "./pages/PrivacyPolicy/PrivacyPolicy.tsx"),
          route(
            "accessibility-statement",
            "./pages/AccessibilityStatementPage/AccessibilityStatementPage.tsx",
          ),
          route(
            "inclusivity-equity",
            "./pages/InclusivityEquityPage/InclusivityEquityPage.tsx",
          ),
          route(
            "dnd",
            "./pages/DNDDigitalCareersPage/DNDDigitalCareersPage.tsx",
          ),
          route(
            "workforce-adjustment",
            "./pages/WorkforceAdjustment/WorkforceAdjustmentPage.tsx",
          ),
          route(
            "directive-on-digital-talent",
            "./pages/DirectivePage/DirectivePage.tsx",
          ),
          route(
            "hr/resources",
            "./pages/HumanResources/PlatformResourcesForProfessionalsPage.tsx",
          ),
          route(
            "comptrollership-executives",
            "./pages/ComptrollershipExecutivesPage/ComptrollershipExecutivesPage.tsx",
          ),
          route("skills", "./pages/Skills/SkillPage.tsx"),
          route("register-info", "./pages/Auth/SignUpPage/SignUpPage.tsx"),
          route("login-info", "./pages/Auth/SignInPage/SignInPage.tsx"),
          route("logged-out", "./pages/Auth/SignedOutPage/SignedOutPage.tsx"),

          // Registration
          ...prefix("registration", [
            route(
              "account",
              "./pages/Auth/RegistrationPages/GettingStartedPage/GettingStartedPage.tsx",
            ),
            route(
              "experience",
              "./pages/Auth/RegistrationPages/EmployeeInformationPage/EmployeeInformationPage.tsx",
            ),
          ]),

          // Talent events
          ...prefix("communities", [
            route(
              "talent-events",
              "./pages/TalentManagementEventsPage/TalentManagementEventsPage.tsx",
            ),
            route(
              "talent-events/:nominationEventId/create-talent-nomination",
              "./pages/CreateTalentNominationPage/CreateTalentNominationPage.tsx",
            ),
            route(
              "talent-nominations/:id",
              "./pages/TalentNominations/NominateTalent/NominateTalentPage.tsx",
            ),
          ]),

          // Search
          ...prefix("search", [
            index("./pages/SearchRequests/SearchPage/SearchPage.tsx"),
            route(
              "request",
              "./pages/SearchRequests/RequestPage/RequestPage.tsx",
            ),
            route(
              "request/:requestId",
              "./pages/SearchRequests/RequestConfirmationPage/RequestConfirmationPage.tsx",
            ),
          ]),

          // Browse jobs
          ...prefix("jobs", [
            index("./pages/Pools/BrowsePoolsPage/BrowsePoolsPage.tsx"),
            route(
              ":poolId",
              "./pages/Pools/PoolAdvertisementPage/PoolAdvertisementPage.tsx",
            ),
            route(
              ":poolId/create-application",
              "./pages/CreateApplicationPage/CreateApplicationPage.tsx",
            ),
          ]),

          // Job templates
          ...prefix("job-templates", [
            index(
              "./pages/JobPosterTemplates/JobPosterTemplatesPage/JobPosterTemplatesPage.tsx",
            ),
            route(
              ":templateId",
              "./pages/JobPosterTemplates/JobPosterTemplatePage/JobPosterTemplatePage.tsx",
            ),
          ]),

          // IT Training fund
          ...prefix("it-training-fund", [
            index("./pages/ItTrainingFundPage/ItTrainingFundPage.tsx"),
            route(
              "instructor-led-training",
              "./pages/InstructorLedTrainingPage/InstructorLedTrainingPage.tsx",
            ),
            route(
              "instructor-led-training/:id",
              "./pages/TrainingOpportunities/TrainingOpportunityPage.tsx",
            ),
            route(
              "certification-exam-vouchers",
              "./pages/CertificationExamVouchersPage/CertificationExamVouchersPage.tsx",
            ),
          ]),

          // Applicant
          ...prefix("applicant", [
            layout("./pages/Auth/RegistrationPages/RegistrationRedirect.tsx", [
              index(
                "./pages/ApplicantDashboardPage/ApplicantDashboardPage.tsx",
              ),
              route(
                "settings",
                "./pages/Profile/AccountSettings/AccountSettingsPage.tsx",
              ),
              route(
                "notifications",
                "./pages/Notifications/NotificationsPage/NotificationsPage.tsx",
              ),
              route(
                "employee-profile",
                "./pages/EmployeeProfile/EmployeeProfilePage.tsx",
              ),
              route(
                "personal-information",
                "./pages/Profile/ProfilePage/ProfilePage.tsx",
              ),

              ...prefix("career-timeline", [
                index(
                  "./pages/Profile/CareerTimelinePage/CareerTimelinePage.tsx",
                ),
                route(
                  ":experienceId/edit",
                  "./pages/Profile/ExperienceFormPage/EditExperienceFormPage.tsx",
                ),
                route(
                  "create",
                  "./pages/Profile/ExperienceFormPage/CreateExperienceFormPage.tsx",
                ),
              ]),
              ...prefix("community-interests", [
                route(
                  ":communityInterestId",
                  "./pages/CommunityInterests/UpdateCommunityInterestPage/UpdateCommunityInterestPage.tsx",
                ),
                route(
                  "create",
                  "./pages/CommunityInterests/CreateCommunityInterestPage/CreateCommunityInterestPage.tsx",
                ),
              ]),

              ...prefix("skills", [
                index("./pages/Skills/SkillPortfolioPage.tsx"),
                route(":skillId", "./pages/Skills/UpdateUserSkillPage.tsx"),
                ...prefix("showcase", [
                  index("./pages/Skills/SkillShowcasePage.tsx"),
                  route(
                    "top-5-behavioural-skills",
                    "./pages/Skills/TopBehaviouralSkillsPage.tsx",
                  ),
                  route(
                    "top-10-technical-skills",
                    "./pages/Skills/TopTechnicalSkillsPage.tsx",
                  ),
                  route(
                    "3-behavioural-skills-to-improve",
                    "./pages/Skills/ImproveBehaviouralSkillsPage.tsx",
                  ),
                  route(
                    "5-technical-skills-to-train",
                    "./pages/Skills/ImproveTechnicalSkillsPage.tsx",
                  ),
                ]),
              ]),
            ]),
          ]),

          // Applications
          route(
            "applications/:applicationId",
            "./pages/Applications/ApplicationLayout.tsx",
            [
              route(
                "welcome",
                "./pages/Applications/ApplicationWelcomePage/ApplicationWelcomePage.tsx",
              ),
              route(
                "self-declaration",
                "./pages/Applications/ApplicationSelfDeclarationPage/ApplicationSelfDeclarationPage.tsx",
              ),
              route(
                "profile",
                "./pages/Applications/ApplicationProfilePage/ApplicationProfilePage.tsx",
              ),
              route(
                "career-timeline",
                "./pages/Applications/ApplicationCareerTimelinePage/ApplicationCareerTimelinePage.tsx",
              ),
              route(
                "career-timeline/introduction",
                "./pages/Applications/ApplicationCareerTimelineIntroductionPage/ApplicationCareerTimelineIntroductionPage.tsx",
              ),
              route(
                "career-timeline/:experienceId",
                "./pages/Applications/ApplicationCareerTimelineEditPage/ApplicationCareerTimelineEditPage.tsx",
              ),
              route(
                "career-timeline/add",
                "./pages/Applications/ApplicationCareerTimelineAddPage/ApplicationCareerTimelineAddPage.tsx",
              ),
              route(
                "education",
                "./pages/Applications/ApplicationEducationPage/ApplicationEducationPage.tsx",
              ),
              route(
                "skills",
                "./pages/Applications/ApplicationSkillsPage/ApplicationSkillsPage.tsx",
              ),
              route(
                "skills/introduction",
                "./pages/Applications/ApplicationSkillsIntroductionPage/ApplicationSkillsIntroductionPage.tsx",
              ),
              route(
                "questions",
                "./pages/Applications/ApplicationQuestionsPage/ApplicationQuestionsPage.tsx",
              ),
              route(
                "questions/introduction",
                "./pages/Applications/ApplicationQuestionsIntroductionPage/ApplicationQuestionsIntroductionPage.tsx",
              ),
              route(
                "review",
                "./pages/Applications/ApplicationReviewPage/ApplicationReviewPage.tsx",
              ),
              route(
                "success",
                "./pages/Applications/ApplicationSuccessPage/ApplicationSuccessPage.tsx",
              ),
            ],
          ),

          // Dashboards
          route(
            "community",
            "./pages/CommunityDashboardPage/CommunityDashboardPage.tsx",
          ),

          // Admin
          ...prefix("admin", [
            index("./pages/AdminDashboardPage/AdminDashboardPage.tsx"),
            route(
              "roles-and-permissions",
              "./pages/Auth/RolesAndPermissionsPage/RolesAndPermissionsPage.tsx",
            ),

            // Admin - Communities
            ...prefix("communities", [
              index(
                "./pages/Communities/IndexCommunityPage/IndexCommunityPage.tsx",
              ),
              route(
                "create",
                "./pages/Communities/CreateCommunityPage/CreateCommunityPage.tsx",
              ),
              ...prefix(":communityId", [
                layout("./pages/Communities/CommunityLayout.tsx", [
                  index(
                    "./pages/Communities/ViewCommunityPage/ViewCommunityPage.tsx",
                  ),
                  route(
                    "edit",
                    "./pages/Communities/UpdateCommunityPage/UpdateCommunityPage.tsx",
                  ),
                  route(
                    "manage-access",
                    "./pages/Communities/CommunityMembersPage/CommunityMembersPage.tsx",
                  ),
                ]),
              ]),
            ]),

            // Admin - Community talent
            route(
              "community-talent",
              "./pages/CommunityInterests/CommunityTalentPage/CommunityTalentPage.tsx",
            ),

            // Admin - Pools
            ...prefix("pools", [
              index("./pages/Pools/IndexPoolPage/IndexPoolPage.tsx"),
              route(
                "create",
                "./pages/Pools/CreatePoolPage/CreatePoolPage.tsx",
              ),
              ...prefix(":poolId", [
                route(
                  "preview",
                  "./pages/Pools/PoolAdvertisementPage/PoolAdvertisementPage.tsx",
                  { id: "admin-job-advert-preview" },
                ),
                layout("./pages/Pools/PoolLayout.tsx", [
                  index("./pages/Pools/ViewPoolPage/ViewPoolPage.tsx"),
                  route("edit", "./pages/Pools/EditPoolPage/EditPoolPage.tsx"),
                  route(
                    "pool-candidates",
                    "./pages/PoolCandidates/IndexPoolCandidatePage/IndexPoolCandidatePage.tsx",
                  ),
                  route(
                    "manage-access",
                    "./pages/Pools/ManageAccessPage/ManageAccessPage.tsx",
                  ),
                  route(
                    "plan",
                    "./pages/Pools/AssessmentPlanBuilderPage/AssessmentPlanBuilderPage.tsx",
                  ),
                  route(
                    "activity",
                    "./pages/Pools/PoolActivityPage/PoolActivityPage.tsx",
                  ),
                ]),
              ]),
            ]),

            // Admin - Pool candidates
            route(
              "pool-candidates",
              "./pages/PoolCandidates/AllPoolCandidatesPage/AllPoolCandidatesPage.tsx",
            ),
            route(
              "candidates/:poolCandidateId/application",
              "./pages/PoolCandidates/ViewPoolCandidatePage/ViewPoolCandidatePage.tsx",
            ),

            // Admin - Talent events
            ...prefix("talent-events", [
              index("./pages/TalentEvents/IndexTalentEventPage.tsx"),
              ...prefix(":eventId", [
                layout("./pages/TalentEvents/TalentEvent/Layout.tsx", [
                  index("./pages/TalentEvents/TalentEvent/DetailsPage.tsx"),
                  route(
                    "nominations",
                    "./pages/TalentEvents/TalentEvent/NominationsPage.tsx",
                  ),
                ]),
                ...prefix("nominations/:talentNominationGroupId", [
                  layout(
                    "./pages/TalentNominations/NominationGroup/Layout.tsx",
                    [
                      index(
                        "./pages/TalentNominations/NominationGroup/Details.tsx",
                      ),
                      route(
                        "profile",
                        "./pages/TalentNominations/NominationGroup/Profile.tsx",
                      ),
                      route(
                        "career-experience",
                        "./pages/TalentNominations/NominationGroup/CareerExperience.tsx",
                      ),
                    ],
                  ),
                ]),
              ]),
            ]),

            // Admin - Talent requests
            ...prefix("talent-requests", [
              index(
                "./pages/SearchRequests/IndexSearchRequestPage/IndexSearchRequestPage.tsx",
              ),
              route(
                ":searchRequestId",
                "./pages/SearchRequests/ViewSearchRequestPage/ViewSearchRequestPage.tsx",
              ),
            ]),

            // Admin - Training opportunities
            ...prefix("training-opportunities", [
              index(
                "./pages/TrainingOpportunities/IndexTrainingOpportunitiesPage.tsx",
              ),
              route(
                "create",
                "./pages/TrainingOpportunities/CreateTrainingOpportunityPage.tsx",
              ),
              route(
                ":trainingOpportunityId",
                "./pages/TrainingOpportunities/ViewTrainingOpportunityPage.tsx",
              ),
              route(
                ":trainingOpportunityId/edit",
                "./pages/TrainingOpportunities/UpdateTrainingOpportunityPage.tsx",
              ),
            ]),

            // Admin - Users
            ...prefix("users", [
              index("./pages/Users/IndexUserPage/IndexUserPage.tsx"),
              ...prefix(":userId", [
                layout("./pages/Users/UserLayout.tsx", [
                  index(
                    "./pages/Users/AdminApplicantProfilePage/AdminApplicantProfilePage.tsx",
                  ),
                  route(
                    "employee-profile",
                    "./pages/Users/UserEmployeeInformationPage/UserEmployeeInformationPage.tsx",
                  ),
                  route(
                    "experience",
                    "./pages/Users/AdminCareerExperiencePage/AdminCareerExperiencePage.tsx",
                  ),
                  route(
                    "skills",
                    "./pages/Users/AdminUserSkillsPage/AdminUserSkillsPage.tsx",
                  ),
                  route(
                    "recruitment",
                    "./pages/Users/AdminUserRecruitmentPage/AdminUserRecruitmentPage.tsx",
                  ),
                  route(
                    "tools",
                    "./pages/Users/AdminUserAdvancedToolsPage/AdminUserAdvancedToolsPage.tsx",
                  ),
                ]),
              ]),
            ]),

            // Admin - Settings
            ...prefix("settings", [
              // Announcements
              route(
                "announcements",
                "./pages/AnnouncementsPage/AnnouncementsPage.tsx",
              ),

              // Admin - Classifications
              ...prefix("classifications", [
                index("./pages/Classifications/IndexClassificationPage.tsx"),
                route(
                  "create",
                  "./pages/Classifications/CreateClassificationPage.tsx",
                ),
                route(
                  ":classificationId",
                  "./pages/Classifications/ViewClassificationPage.tsx",
                ),
                route(
                  ":classificationId/edit",
                  "./pages/Classifications/UpdateClassificationPage.tsx",
                ),
              ]),

              // Admin - Departments
              ...prefix("departments", [
                index("./pages/Departments/IndexDepartmentPage.tsx"),
                route("create", "./pages/Departments/CreateDepartmentPage.tsx"),
                ...prefix(":departmentId", [
                  index("./pages/Departments/ViewDepartmentPage.tsx"),
                  route("edit", "./pages/Departments/UpdateDepartmentPage.tsx"),
                  route(
                    "advanced-tools",
                    "./pages/Departments/AdvancedToolsDepartmentPage.tsx",
                  ),
                ]),
              ]),

              // Admin - Job templates
              ...prefix("job-templates", [
                index(
                  "./pages/JobPosterTemplateAdminPages/IndexJobPosterTemplatePage/IndexJobPosterTemplatePage.tsx",
                ),
                route(
                  "create",
                  "./pages/JobPosterTemplateAdminPages/CreateJobPosterTemplatePage/CreateJobPosterTemplatePage.tsx",
                ),
                route(
                  ":jobPosterTemplateId",
                  "./pages/JobPosterTemplateAdminPages/UpdateJobPosterTemplatePage/UpdateJobPosterTemplatePage.tsx",
                ),
              ]),

              // Admin - Skills
              ...prefix("skills", [
                index("./pages/Skills/IndexSkillPage.tsx"),
                route("create", "./pages/Skills/CreateSkillPage.tsx"),
                route(":skillId", "./pages/Skills/ViewSkillPage.tsx"),
                route(":skillId/edit", "./pages/Skills/UpdateSkillPage.tsx"),
              ]),

              // Admin - Skill families
              ...prefix("skill-families", [
                index("./pages/SkillFamilies/IndexSkillFamilyPage.tsx"),
                route(
                  "create",
                  "./pages/SkillFamilies/CreateSkillFamilyPage.tsx",
                ),
                route(
                  ":skillFamilyId",
                  "./pages/SkillFamilies/ViewSkillFamilyPage.tsx",
                ),
                route(
                  ":skillFamilyId/edit",
                  "./pages/SkillFamilies/UpdateSkillFamilyPage.tsx",
                ),
              ]),

              // Admin - Work streams
              ...prefix("work-streams", [
                index("./pages/WorkStreams/IndexWorkStreamPage.tsx"),
                route("create", "./pages/WorkStreams/CreateWorkStreamPage.tsx"),
                route(
                  ":workStreamId",
                  "./pages/WorkStreams/ViewWorkStreamsPage.tsx",
                ),
                route(
                  ":workStreamId/edit",
                  "./pages/WorkStreams/UpdateWorkStreamPage.tsx",
                ),
              ]),
            ]),

            // Admin - WFA
            route(
              "wfa-employees",
              "./pages/WorkforceAdjustment/IndexWorkforceAdjustmentPage/IndexWorkforceAdjustmentPage.tsx",
            ),
          ]),

          // Catch all
          route("*", "./pages/NotFoundPage/NotFoundPage.tsx", {
            id: "main-not-found",
          }),
        ]),
      ]),

      ...prefix("indigenous-it-apprentice", [
        layout("./components/Layout/IAPLayout.tsx", [
          // NOTE: Required for the nice error boundary
          route(
            "",
            "./pages/Root/ErrorBoundaryWrapper.tsx",
            { id: "iap-boundary" },
            [
              index("./pages/Home/IAPHomePage/Home.tsx"),
              route(
                "hire",
                "./pages/Home/IAPManagerHomePage/IAPManagerHomePage.tsx",
              ),

              // Catch all
              route("*", "./pages/NotFoundPage/NotFoundPage.tsx", {
                id: "iap-not-found",
              }),
            ],
          ),
        ]),
      ]),
    ]),

    route("*", "./pages/NotFoundPage/NotFoundPage.tsx", {
      id: "root-not-found",
    }),
  ]),

  // Catch all
  route("*", "./pages/NotFoundPage/NotFoundPage.tsx", {
    id: "fallback-not-found",
  }),
] satisfies RouteConfig;
