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
                                path: ":experienceId/edit",
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

// const profileRoutes = (
//   profilePaths: ApplicantProfileRoutes,
//   myUserId?: string,
// ): Routes<RouterResult> => [
//   {
//     path: profilePaths.createAccount(),
//     action: () => ({
//       component: <CreateAccount />,
//     }),
//   },
//   {
//     path: profilePaths.home(":userId"),
//     action: () => ({
//       component: <ProfilePage />,
//       authorizedRoles: [Role.Applicant],
//     }),
//   },
//   {
//     path: profilePaths.myProfile(),
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId ? profilePaths.home(myUserId) : undefined,
//     }),
//   },
//   {
//     path: profilePaths.governmentInformation(":userId"),
//     action: (context) => {
//       const userId = context.params.userId as string;
//       return {
//         component: <GovernmentInfoFormPage meId={userId} />,
//         authorizedRoles: [Role.Applicant],
//       };
//     },
//   },
//   {
//     path: profilePaths.languageInformation(":userId"),
//     action: () => ({
//       component: <LanguageInformationFormPage />,
//       authorizedRoles: [Role.Applicant],
//     }),
//   },
//   {
//     path: profilePaths.workLocation(":userId"),
//     action: () => ({
//       component: <WorkLocationPreferenceFormPage />,
//       authorizedRoles: [Role.Applicant],
//     }),
//   },
//   {
//     path: profilePaths.roleSalary(":userId"),
//     action: () => ({
//       component: <RoleSalaryFormPage />,
//       authorizedRoles: [Role.Applicant],
//     }),
//   },
//   {
//     path: `${profilePaths.skillsAndExperiences(":userId")}/:type/create`,
//     action: (context) => {
//       const userId = context.params.userId as string;
//       const experienceType = context.params.type as ExperienceType;
//       return {
//         component: (
//           <ExperienceFormContainer
//             userId={userId}
//             experienceType={experienceType}
//           />
//         ),
//         authorizedRoles: [Role.Applicant],
//       };
//     },
//   },
//   {
//     path: `${profilePaths.skillsAndExperiences(":userId")}/:type/:id/edit`,
//     action: (context) => {
//       const userId = context.params.userId as string;
//       const experienceType = context.params.type as ExperienceType;
//       const experienceId = context.params.id as string;
//       return {
//         component: (
//           <ExperienceFormContainer
//             userId={userId}
//             experienceType={experienceType}
//             experienceId={experienceId}
//             edit
//           />
//         ),
//         authorizedRoles: [Role.Applicant],
//       };
//     },
//   },
//   {
//     path: profilePaths.workPreferences(":userId"),
//     action: () => ({
//       component: <WorkPreferencesFormPage />,
//       authorizedRoles: [Role.Applicant],
//     }),
//   },
//   {
//     path: profilePaths.aboutMe(":userId"),
//     action: () => ({
//       component: <AboutMeFormPage />,
//       authorizedRoles: [Role.Applicant],
//     }),
//   },
//   {
//     path: profilePaths.diversityEquityInclusion(":userId"),
//     action: () => ({
//       component: <EmploymentEquityFormPage />,
//       authorizedRoles: [Role.Applicant],
//     }),
//   },
//   {
//     path: profilePaths.skillsAndExperiences(":userId"),
//     action: () => ({
//       component: <ExperienceAndSkillsPage />,
//       authorizedRoles: [Role.Applicant],
//     }),
//   },

//   // Old routes - these redirect to the current route for the page
//   {
//     path: profilePaths.myProfileDeprecated(),
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId ? profilePaths.home(myUserId) : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/create-account`,
//     action: () => ({
//       component: <div />,
//       redirect: profilePaths.createAccount(),
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/about-me`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId ? profilePaths.aboutMe(myUserId) : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/language-information`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId
//         ? profilePaths.languageInformation(myUserId)
//         : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/government-information`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId
//         ? profilePaths.governmentInformation(myUserId)
//         : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/role-salary`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId ? profilePaths.roleSalary(myUserId) : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/work-location`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId ? profilePaths.workLocation(myUserId) : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/work-preferences`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId ? profilePaths.workPreferences(myUserId) : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/diversity-and-inclusion`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId
//         ? profilePaths.diversityEquityInclusion(myUserId)
//         : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/skills-and-experiences`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId
//         ? profilePaths.skillsAndExperiences(myUserId)
//         : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/skills-and-experiences/award/create`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId ? profilePaths.createAward(myUserId) : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/skills-and-experiences/community/create`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId ? profilePaths.createCommunity(myUserId) : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/skills-and-experiences/education/create`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId ? profilePaths.createEducation(myUserId) : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/skills-and-experiences/personal/create`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId ? profilePaths.createPersonal(myUserId) : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/skills-and-experiences/work`,
//     action: () => ({
//       component: <div />,
//       authorizedRoles: [Role.Applicant],
//       redirect: myUserId ? profilePaths.createWork(myUserId) : undefined,
//     }),
//   },
//   {
//     path: `${profilePaths.myProfile()}/skills-and-experiences/:type/:id/edit`,
//     action: (context) => {
//       const experienceType = context.params.type as ExperienceType;
//       const experienceId = context.params.id as string;
//       return {
//         component: <div />,
//         authorizedRoles: [Role.Applicant],
//         redirect: myUserId
//           ? profilePaths.editExperience(myUserId, experienceType, experienceId)
//           : undefined,
//       };
//     },
//   },
// ];

// const directIntakeRoutes = (
//   directIntakePaths: DirectIntakeRoutes,
// ): Routes<RouterResult> => [
//   {
//     path: directIntakePaths.home(),
//     action: () => ({
//       component: <div />,
//       redirect: directIntakePaths.allPools(),
//     }),
//   },
//   {
//     path: directIntakePaths.allPools(),
//     action: () => ({
//       component: <BrowsePoolsPage />,
//     }),
//   },
//   {
//     path: directIntakePaths.pool(":id"),
//     action: (context) => {
//       const poolId = context.params.id as string;
//       return {
//         component: <PoolAdvertisementPage id={poolId} />,
//       };
//     },
//   },
//   {
//     path: directIntakePaths.createApplication(":id"),
//     action: (context) => {
//       const poolId = context.params.id as string;
//       return {
//         component: <CreateApplication poolId={poolId} />,
//         authorizedRoles: [Role.Applicant],
//       };
//     },
//   },
//   {
//     path: directIntakePaths.signAndSubmit(":id"),
//     action: (context) => {
//       const applicationId = context.params.id as string;
//       return {
//         component: <SignAndSubmitPage id={applicationId} />,
//         authorizedRoles: [Role.Applicant],
//       };
//     },
//   },
//   {
//     path: directIntakePaths.applications(":userId"),
//     action: () => ({
//       component: <MyApplicationsPage />,
//       authorizedRoles: [Role.Applicant],
//     }),
//   },
//   {
//     path: directIntakePaths.reviewApplication(":poolCandidateId"),
//     action: (context) => {
//       const poolCandidateId = context.params.poolCandidateId as string;
//       return {
//         component: (
//           <ReviewMyApplicationPage poolCandidateId={poolCandidateId} />
//         ),
//         authorizedRoles: [Role.Applicant],
//       };
//     },
//   },
// ];

export const Router = () => (
  <React.Suspense fallback={<Loading />}>
    <RouterProvider router={router} />
  </React.Suspense>
);

export default Router;
