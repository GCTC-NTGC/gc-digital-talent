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
  route("/", "./pages/Root/RootLocaleRedirect.tsx"),

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
        route("dnd", "./pages/DNDDigitalCareersPage/DNDDigitalCareersPage.tsx"),
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

        // Applicant
        ...prefix("applicant", [
          layout("./pages/Auth/RegistrationPages/RegistrationRedirect.tsx", [
            index("./pages/ApplicantDashboardPage/ApplicantDashboardPage.tsx"),
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

        // Dashboards
        route(
          "community",
          "./pages/CommunityDashboardPage/CommunityDashboardPage.tsx",
        ),

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

  // Catch all
  route("*", "./pages/NotFoundPage/NotFoundPage.tsx", { id: "root-not-found" }),
] satisfies RouteConfig;
