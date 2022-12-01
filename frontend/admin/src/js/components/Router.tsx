import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import lazyRetry from "@common/helpers/lazyRetry";
import Loading from "@common/components/Pending/Loading";
import RequireAuth from "@common/components/RequireAuth/RequireAuth";
import useFeatureFlags, { FeatureFlags } from "@common/hooks/useFeatureFlags";

import Layout from "./Layout";

import { Role } from "../api/generated";

const HomePage = React.lazy(() =>
  lazyRetry(
    () => import(/* webpackChunkName: "adminHomePage" */ "./home/HomePage"),
  ),
);
const ErrorPage = React.lazy(() =>
  lazyRetry(
    () => import(/* webpackChunkName: "adminErrorPage" */ "./Error/ErrorPage"),
  ),
);
const DashboardPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminDashboardPage" */ "./dashboard/DashboardPage"
      ),
  ),
);

/** Users */
const UserPage = React.lazy(() =>
  lazyRetry(
    () => import(/* webpackChunkName: "adminUserPage" */ "./user/UserPage"),
  ),
);
const CreateUser = React.lazy(() =>
  lazyRetry(
    () => import(/* webpackChunkName: "adminCreateUser" */ "./user/CreateUser"),
  ),
);
const UpdateUser = React.lazy(() =>
  lazyRetry(
    () => import(/* webpackChunkName: "adminUpdateUser" */ "./user/UpdateUser"),
  ),
);
const ViewUser = React.lazy(() =>
  lazyRetry(
    () => import(/* webpackChunkName: "adminViewUser" */ "./user/ViewUser"),
  ),
);

/** Classifications */
const ClassificationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminClassificationPage" */ "./classification/ClassificationPage"
      ),
  ),
);
const CreateClassification = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateClassification" */ "./classification/CreateClassification"
      ),
  ),
);
const UpdateClassification = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateClassification" */ "./classification/UpdateClassification"
      ),
  ),
);

/** CMO Assets */
const CreateCmoAsset = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateCmoAsset" */ "./cmoAsset/CreateCmoAsset"
      ),
  ),
);
const UpdateCmoAsset = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateCmoAsset" */ "./cmoAsset/UpdateCmoAsset"
      ),
  ),
);

/** Pool Candidates */
const PoolCandidatePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminPoolCandidatePage" */ "./poolCandidate/PoolCandidatePage"
      ),
  ),
);
const CreatePoolCandidate = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreatePoolCandidate" */ "./poolCandidate/CreatePoolCandidate"
      ),
  ),
);
const UpdatePoolCandidate = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdatePoolCandidate" */ "./poolCandidate/UpdatePoolCandidate"
      ),
  ),
);
const ViewPoolCandidatePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminViewPoolCandidate" */ "./poolCandidate/ViewPoolCandidate/ViewPoolCandidatePage"
      ),
  ),
);

/** Pools */
const PoolPage = React.lazy(() =>
  lazyRetry(
    () => import(/* webpackChunkName: "adminPoolPage" */ "./pool/PoolPage"),
  ),
);
const CreatePool = React.lazy(() =>
  lazyRetry(
    () => import(/* webpackChunkName: "adminCreatePool" */ "./pool/CreatePool"),
  ),
);
const EditPool = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminEditPool" */ "./pool/EditPool/EditPool"
      ),
  ),
);
const ViewPool = React.lazy(() =>
  lazyRetry(
    () => import(/* webpackChunkName: "adminViewPool" */ "./pool/ViewPool"),
  ),
);
const DeprecatedViewPool = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminDeprecatedViewPool" */ "./pool/deprecated/ViewPool"
      ),
  ),
);
const DeprecatedUpdatePool = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminDeprecatedUpdatePool" */ "./pool/deprecated/UpdatePool"
      ),
  ),
);
const DeprecatedCreatePool = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminDeprecatedCreatePool" */ "./pool/deprecated/CreatePool"
      ),
  ),
);

/** Departments */
const DepartmentPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminDepartmentPage" */ "./department/DepartmentPage"
      ),
  ),
);
const CreateDepartment = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateDepartment" */ "./department/CreateDepartment"
      ),
  ),
);
const UpdateDepartment = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateDepartment" */ "./department/UpdateDepartment"
      ),
  ),
);

/** Skill Families */
const SkillFamilyPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminSkillFamilyPage" */ "./skillFamily/SkillFamilyPage"
      ),
  ),
);
const CreateSkillFamily = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateSkillFamily" */ "./skillFamily/CreateSkillFamily"
      ),
  ),
);
const UpdateSkillFamily = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateSkillFamily" */ "./skillFamily/UpdateSkillFamily"
      ),
  ),
);

/** Skills */
const SkillPage = React.lazy(() =>
  lazyRetry(
    () => import(/* webpackChunkName: "adminSkillPage" */ "./skill/SkillPage"),
  ),
);
const CreateSkill = React.lazy(() =>
  lazyRetry(
    () =>
      import(/* webpackChunkName: "adminCreateSkill" */ "./skill/CreateSkill"),
  ),
);
const UpdateSkill = React.lazy(() =>
  lazyRetry(
    () =>
      import(/* webpackChunkName: "adminUpdateSkill" */ "./skill/UpdateSkill"),
  ),
);

/** Search Requests */
const SearchRequestPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminSearchRequestPage" */ "./searchRequest/SearchRequestPage"
      ),
  ),
);
const SingleSearchRequestPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminSingleSearchRequestPage" */ "./searchRequest/SingleSearchRequestPage"
      ),
  ),
);

interface CreateRouterArgs {
  featureFlags: FeatureFlags;
}

const createRouter = ({ featureFlags }: CreateRouterArgs) =>
  createBrowserRouter([
    {
      path: "/:locale",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "admin",
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <HomePage />,
            },
            {
              path: "dashboard",
              element: (
                <RequireAuth roles={[Role.Admin]}>
                  <DashboardPage />
                </RequireAuth>
              ),
            },
            {
              path: "users",
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth roles={[Role.Admin]}>
                      <UserPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: "create",
                  element: (
                    <RequireAuth roles={[Role.Admin]}>
                      <CreateUser />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":userId",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth roles={[Role.Admin]}>
                          <ViewUser />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "edit",
                      element: (
                        <RequireAuth roles={[Role.Admin]}>
                          <UpdateUser />
                        </RequireAuth>
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
                  element: (
                    <RequireAuth roles={[Role.Admin]}>
                      <PoolPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: "create",
                  element: (
                    <RequireAuth roles={[Role.Admin]}>
                      {featureFlags.directIntake ? (
                        <CreatePool />
                      ) : (
                        <DeprecatedCreatePool />
                      )}
                    </RequireAuth>
                  ),
                },
                {
                  path: ":poolId",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth roles={[Role.Admin]}>
                          {featureFlags.directIntake ? (
                            <ViewPool />
                          ) : (
                            <DeprecatedViewPool />
                          )}
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "edit",
                      element: (
                        <RequireAuth roles={[Role.Admin]}>
                          {featureFlags.directIntake ? (
                            <EditPool />
                          ) : (
                            <DeprecatedUpdatePool />
                          )}
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "pool-candidates",
                      children: [
                        {
                          index: true,
                          element: (
                            <RequireAuth roles={[Role.Admin]}>
                              <PoolCandidatePage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "create",
                          element: (
                            <RequireAuth roles={[Role.Admin]}>
                              <CreatePoolCandidate />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: ":poolCandidateId",
                          children: [
                            {
                              index: true,
                              element: (
                                <RequireAuth roles={[Role.Admin]}>
                                  <ViewPoolCandidatePage />
                                </RequireAuth>
                              ),
                            },
                            {
                              path: "edit",
                              element: (
                                <RequireAuth roles={[Role.Admin]}>
                                  <UpdatePoolCandidate />
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
              path: "candidates/:poolCandidateId/application",
              element: (
                <RequireAuth roles={[Role.Admin]}>
                  <ViewPoolCandidatePage />
                </RequireAuth>
              ),
            },
            {
              path: "talent-requests",
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth roles={[Role.Admin]}>
                      <SearchRequestPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":searchRequestId",
                  element: (
                    <RequireAuth roles={[Role.Admin]}>
                      <SingleSearchRequestPage />
                    </RequireAuth>
                  ),
                },
              ],
            },
            {
              path: "settings",
              children: [
                {
                  path: "classifications",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth roles={[Role.Admin]}>
                          <ClassificationPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth roles={[Role.Admin]}>
                          <CreateClassification />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: ":classificationId",
                      children: [
                        {
                          path: "edit",
                          element: (
                            <RequireAuth roles={[Role.Admin]}>
                              <UpdateClassification />
                            </RequireAuth>
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
                      element: (
                        <RequireAuth roles={[Role.Admin]}>
                          <DepartmentPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth roles={[Role.Admin]}>
                          <CreateDepartment />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: ":departmentId",
                      children: [
                        {
                          path: "edit",
                          element: (
                            <RequireAuth roles={[Role.Admin]}>
                              <UpdateDepartment />
                            </RequireAuth>
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
                      element: (
                        <RequireAuth roles={[Role.Admin]}>
                          <SkillPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth roles={[Role.Admin]}>
                          <CreateSkill />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: ":skillId",
                      children: [
                        {
                          path: "edit",
                          element: (
                            <RequireAuth roles={[Role.Admin]}>
                              <UpdateSkill />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                    {
                      path: "families",
                      children: [
                        {
                          index: true,
                          element: (
                            <RequireAuth roles={[Role.Admin]}>
                              <SkillFamilyPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "create",
                          element: (
                            <RequireAuth roles={[Role.Admin]}>
                              <CreateSkillFamily />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: ":skillFamilyId",
                          children: [
                            {
                              path: "edit",
                              element: (
                                <RequireAuth roles={[Role.Admin]}>
                                  <UpdateSkillFamily />
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
          ],
        },
      ],
    },
  ]);

const Router = () => {
  const featureFlags = useFeatureFlags();
  const router = createRouter({ featureFlags });
  return (
    <React.Suspense fallback={<Loading />}>
      <RouterProvider router={router} fallbackElement={<Loading />} />
    </React.Suspense>
  );
};

export default Router;
