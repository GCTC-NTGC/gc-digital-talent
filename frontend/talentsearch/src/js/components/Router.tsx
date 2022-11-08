import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Loading from "@common/components/Pending/Loading";
import RequireAuth from "@common/components/RequireAuth/RequireAuth";

import Layout from "./Layout";
import { Role } from "../api/generated";

import TalentRedirect from "./Redirects/TalentRedirect";
import ProfileRedirect from "./Redirects/ProfileRedirect";

/** Home */
const HomePage = React.lazy(() => import("./Home/HomePage"));
const ErrorPage = React.lazy(() => import("./Error/ErrorPage"));
const SupportPage = React.lazy(() => import("./support/SupportPage"));

/** Search */
const SearchPage = React.lazy(() => import("./search/SearchPage"));
const RequestPage = React.lazy(() => import("./request/RequestPage"));

/** Auth */
const RegisterPage = React.lazy(() => import("./register/RegisterPage"));
const LoggedOutPage = React.lazy(() => import("./loggedOut/LoggedOutPage"));
const LoginPage = React.lazy(() => import("./login/LoginPage"));

/** Profile */
const CreateAccount = React.lazy(
  () => import("./createAccount/CreateAccountPage"),
);
const ProfilePage = React.lazy(
  () => import("./profile/ProfilePage/ProfilePage"),
);
const GovernmentInfoFormPage = React.lazy(
  () => import("./GovernmentInfoForm/GovernmentInfoFormPage"),
);
const LanguageInformationFormPage = React.lazy(
  () => import("./languageInformationForm/LanguageInformationFormPage"),
);
const WorkLocationPreferenceFormPage = React.lazy(
  () => import("./workLocationPreferenceForm/WorkLocationPreferenceFormPage"),
);
const RoleSalaryFormPage = React.lazy(
  () => import("./roleSalaryForm/RoleSalaryFormPage"),
);
const ExperienceFormPage = React.lazy(
  () => import("./experienceForm/ExperienceForm"),
);
const WorkPreferencesFormPage = React.lazy(
  () => import("./workPreferencesForm/WorkPreferencesFormPage"),
);
const AboutMeFormPage = React.lazy(
  () => import("./aboutMeForm/AboutMeFormPage"),
);
const EmploymentEquityFormPage = React.lazy(
  () => import("./employmentEquityForm/EmploymentEquityFormPage"),
);
const ExperienceAndSkillsPage = React.lazy(
  () => import("./experienceAndSkills/ExperienceAndSkillsPage"),
);

/** Direct Intake */
const BrowsePoolsPage = React.lazy(() => import("./Browse/BrowsePoolsPage"));
const PoolAdvertisementPage = React.lazy(
  () => import("./pool/PoolAdvertisementPage"),
);
const CreateApplication = React.lazy(() => import("./pool/CreateApplication"));
const SignAndSubmitPage = React.lazy(
  () => import("./signAndSubmit/SignAndSubmitPage"),
);
const MyApplicationsPage = React.lazy(
  () => import("./applications/MyApplicationsPage"),
);
const ReviewMyApplicationPage = React.lazy(
  () => import("./reviewMyApplication/ReviewMyApplicationPage"),
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
    <RouterProvider router={router} />
  </React.Suspense>
);

export default Router;
