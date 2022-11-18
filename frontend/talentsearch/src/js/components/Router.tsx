import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Loading from "@common/components/Pending/Loading";
import RequireAuth from "@common/components/RequireAuth/RequireAuth";

import Layout from "./Layout";
import { Role } from "../api/generated";

import TalentRedirect from "./Redirects/TalentRedirect";
import ProfileRedirect from "./Redirects/ProfileRedirect";
import CreateAccountRedirect from "./createAccount/CreateAccountRedirect";

/** Home */
const HomePage = React.lazy(
  () => import(/* webpackChunkName: "tsHomePage" */ "./Home/HomePage"),
);
const ErrorPage = React.lazy(
  () => import(/* webpackChunkName: "tsErrorPage" */ "./Error/ErrorPage"),
);
const SupportPage = React.lazy(
  () => import(/* webpackChunkName: "tsSupportPage" */ "./support/SupportPage"),
);
const AccessibilityPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsAccessibilityPage" */ "./AccessibilityStatement/AccessibilityStatement"
    ),
);

/** Search */
const SearchPage = React.lazy(
  () => import(/* webpackChunkName: "tsSearchPage" */ "./search/SearchPage"),
);
const RequestPage = React.lazy(
  () => import(/* webpackChunkName: "tsRequestPage" */ "./request/RequestPage"),
);

/** Auth */
const RegisterPage = React.lazy(
  () =>
    import(/* webpackChunkName: "tsRegisterPage" */ "./register/RegisterPage"),
);
const LoggedOutPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsLoggedOutPage" */ "./loggedOut/LoggedOutPage"
    ),
);
const LoginPage = React.lazy(
  () => import(/* webpackChunkName: "tsLoginPage" */ "./login/LoginPage"),
);

/** Profile */
const CreateAccount = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsCreateAccountPage" */ "./createAccount/CreateAccountPage"
    ),
);
const ProfilePage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsProfilePage" */ "./profile/ProfilePage/ProfilePage"
    ),
);
const GovernmentInfoFormPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsGovInfoPage" */ "./GovernmentInfoForm/GovernmentInfoFormPage"
    ),
);
const LanguageInformationFormPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsLangInfoPage" */ "./languageInformationForm/LanguageInformationFormPage"
    ),
);
const WorkLocationPreferenceFormPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsWorkLocationPage" */ "./workLocationPreferenceForm/WorkLocationPreferenceFormPage"
    ),
);
const RoleSalaryFormPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsRoleSalaryPage" */ "./roleSalaryForm/RoleSalaryFormPage"
    ),
);
const ExperienceFormPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsEditExperiencePage" */ "./experienceForm/ExperienceForm"
    ),
);
const WorkPreferencesFormPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsWorkPrefPage" */ "./workPreferencesForm/WorkPreferencesFormPage"
    ),
);
const AboutMeFormPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsAboutMePage" */ "./aboutMeForm/AboutMeFormPage"
    ),
);
const EmploymentEquityFormPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsEquityPage" */ "./employmentEquityForm/EmploymentEquityFormPage"
    ),
);
const ExperienceAndSkillsPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsExperienceSkillsPage" */ "./experienceAndSkills/ExperienceAndSkillsPage"
    ),
);

/** Direct Intake */
const BrowsePoolsPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsBrowsePoolsPage" */ "./Browse/BrowsePoolsPage"
    ),
);
const PoolAdvertisementPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsPoolAdvertPage" */ "./pool/PoolAdvertisementPage"
    ),
);
const CreateApplication = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsCreateApplicationPage" */ "./pool/CreateApplication"
    ),
);
const SignAndSubmitPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsSignSubmitPage" */ "./signAndSubmit/SignAndSubmitPage"
    ),
);
const MyApplicationsPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsMyApplicationsPage" */ "./applications/MyApplicationsPage"
    ),
);
const ReviewMyApplicationPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "tsReviewApplicationPage" */ "./reviewMyApplication/ReviewMyApplicationPage"
    ),
);

const router = createBrowserRouter([
  {
    path: `/`,
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ":locale",
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "support",
            element: <SupportPage />,
          },
          {
            path: "accessibility-statement",
            element: <AccessibilityPage />,
          },
          {
            path: "search",
            children: [
              {
                index: true,
                element: <SearchPage />,
              },
              {
                path: "request",
                element: <RequestPage />,
              },
            ],
          },
          {
            path: "register-info",
            element: <RegisterPage />,
          },
          {
            path: "logged-out",
            element: <LoggedOutPage />,
          },
          {
            path: "login-info",
            element: <LoginPage />,
          },
          {
            path: "create-account",
            element: (
              <RequireAuth roles={[Role.Applicant]}>
                <CreateAccount />
              </RequireAuth>
            ),
          },
          {
            path: "users",
            // Redirect any route in this section to /create-account
            // if no email is set
            element: <CreateAccountRedirect />,
            children: [
              {
                path: "me",
                element: (
                  <RequireAuth roles={[Role.Applicant]}>
                    <ProfileRedirect />
                  </RequireAuth>
                ),
              },
              {
                path: ":userId",
                children: [
                  {
                    path: "profile",
                    children: [
                      {
                        index: true,
                        element: (
                          <RequireAuth roles={[Role.Applicant]}>
                            <ProfilePage />
                          </RequireAuth>
                        ),
                      },
                      {
                        path: "about-me/edit",
                        element: (
                          <RequireAuth roles={[Role.Applicant]}>
                            <AboutMeFormPage />
                          </RequireAuth>
                        ),
                      },
                      {
                        path: "government-info/edit",
                        element: (
                          <RequireAuth roles={[Role.Applicant]}>
                            <GovernmentInfoFormPage />
                          </RequireAuth>
                        ),
                      },
                      {
                        path: "language-info/edit",
                        element: (
                          <RequireAuth roles={[Role.Applicant]}>
                            <LanguageInformationFormPage />
                          </RequireAuth>
                        ),
                      },
                      {
                        path: "work-location/edit",
                        element: (
                          <RequireAuth roles={[Role.Applicant]}>
                            <WorkLocationPreferenceFormPage />
                          </RequireAuth>
                        ),
                      },
                      {
                        path: "work-preferences/edit",
                        element: (
                          <RequireAuth roles={[Role.Applicant]}>
                            <WorkPreferencesFormPage />
                          </RequireAuth>
                        ),
                      },
                      {
                        path: "employment-equity/edit",
                        element: (
                          <RequireAuth roles={[Role.Applicant]}>
                            <EmploymentEquityFormPage />
                          </RequireAuth>
                        ),
                      },
                      {
                        path: "role-salary-expectations/edit",
                        element: (
                          <RequireAuth roles={[Role.Applicant]}>
                            <RoleSalaryFormPage />
                          </RequireAuth>
                        ),
                      },
                      {
                        path: "experiences",
                        children: [
                          {
                            index: true,
                            element: (
                              <RequireAuth roles={[Role.Applicant]}>
                                <ExperienceAndSkillsPage />
                              </RequireAuth>
                            ),
                          },
                          {
                            path: ":experienceType",
                            children: [
                              {
                                path: "create",
                                element: (
                                  <RequireAuth roles={[Role.Applicant]}>
                                    <ExperienceFormPage />
                                  </RequireAuth>
                                ),
                              },
                              {
                                path: ":experienceId",
                                children: [
                                  {
                                    path: "edit",
                                    element: (
                                      <RequireAuth roles={[Role.Applicant]}>
                                        <ExperienceFormPage edit />
                                      </RequireAuth>
                                    ),
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: "applications",
                    element: (
                      <RequireAuth roles={[Role.Applicant]}>
                        <MyApplicationsPage />
                      </RequireAuth>
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
                path: "pools",
                children: [
                  {
                    index: true,
                    element: <BrowsePoolsPage />,
                  },
                  {
                    path: ":poolId",
                    children: [
                      {
                        index: true,
                        element: <PoolAdvertisementPage />,
                      },
                      {
                        path: "create-application",
                        element: (
                          <RequireAuth roles={[Role.Applicant]}>
                            <CreateApplication />
                          </RequireAuth>
                        ),
                      },
                    ],
                  },
                ],
              },
              {
                path: "applications",
                children: [
                  {
                    path: ":poolCandidateId",
                    children: [
                      {
                        path: "submit",
                        element: (
                          <RequireAuth roles={[Role.Applicant]}>
                            <SignAndSubmitPage />
                          </RequireAuth>
                        ),
                      },
                      {
                        path: "apply",
                        element: (
                          <RequireAuth roles={[Role.Applicant]}>
                            <ReviewMyApplicationPage />
                          </RequireAuth>
                        ),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: "talent/profile/*",
            element: (
              <RequireAuth roles={[Role.Applicant]}>
                <TalentRedirect />
              </RequireAuth>
            ),
          },
        ],
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

const Router = () => (
  <React.Suspense fallback={<Loading />}>
    <RouterProvider router={router} fallbackElement={<Loading />} />
  </React.Suspense>
);

export default Router;
