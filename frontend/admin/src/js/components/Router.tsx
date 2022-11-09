import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Loading from "@common/components/Pending/Loading";
import RequireAuth from "@common/components/RequireAuth/RequireAuth";
import useFeatureFlags, { FeatureFlags } from "@common/hooks/useFeatureFlags";

import Layout from "./Layout";

import { Role } from "../api/generated";

const HomePage = React.lazy(() => import("./home/HomePage"));
const ErrorPage = React.lazy(() => import("./Error/ErrorPage"));
const DashboardPage = React.lazy(() => import("./dashboard/DashboardPage"));

/** Users */
const UserPage = React.lazy(() => import("./user/UserPage"));
const CreateUser = React.lazy(() => import("./user/CreateUser"));
const UpdateUser = React.lazy(() => import("./user/UpdateUser"));
const ViewUser = React.lazy(() => import("./user/ViewUser"));

/** Classifications */
const ClassificationPage = React.lazy(
  () => import("./classification/ClassificationPage"),
);
const CreateClassification = React.lazy(
  () => import("./classification/CreateClassification"),
);
const UpdateClassification = React.lazy(
  () => import("./classification/UpdateClassification"),
);

/** CMO Assets */
const CmoAssetPage = React.lazy(() => import("./cmoAsset/CmoAssetPage"));
const CreateCmoAsset = React.lazy(() => import("./cmoAsset/CreateCmoAsset"));
const UpdateCmoAsset = React.lazy(() => import("./cmoAsset/UpdateCmoAsset"));

/** Pool Candidates */
const PoolCandidatePage = React.lazy(
  () => import("./poolCandidate/PoolCandidatePage"),
);
const CreatePoolCandidate = React.lazy(
  () => import("./poolCandidate/CreatePoolCandidate"),
);
const UpdatePoolCandidate = React.lazy(
  () => import("./poolCandidate/UpdatePoolCandidate"),
);
const ViewPoolCandidatePage = React.lazy(
  () => import("./poolCandidate/ViewPoolCandidate/ViewPoolCandidatePage"),
);

/** Pools */
const PoolPage = React.lazy(() => import("./pool/PoolPage"));
const CreatePool = React.lazy(() => import("./pool/CreatePool"));
const EditPool = React.lazy(() => import("./pool/EditPool/EditPool"));
const ViewPool = React.lazy(() => import("./pool/ViewPool"));
const DeprecatedViewPool = React.lazy(
  () => import("./pool/deprecated/ViewPool"),
);
const DeprecatedUpdatePool = React.lazy(
  () => import("./pool/deprecated/UpdatePool"),
);
const DeprecatedCreatePool = React.lazy(
  () => import("./pool/deprecated/CreatePool"),
);

/** Departments */
const DepartmentPage = React.lazy(() => import("./department/DepartmentPage"));
const CreateDepartment = React.lazy(
  () => import("./department/CreateDepartment"),
);
const UpdateDepartment = React.lazy(
  () => import("./department/UpdateDepartment"),
);

/** Skill Families */
const SkillFamilyPage = React.lazy(
  () => import("./skillFamily/SkillFamilyPage"),
);
const CreateSkillFamily = React.lazy(
  () => import("./skillFamily/CreateSkillFamily"),
);
const UpdateSkillFamily = React.lazy(
  () => import("./skillFamily/UpdateSkillFamily"),
);

/** Skills */
const SkillPage = React.lazy(() => import("./skill/SkillPage"));
const CreateSkill = React.lazy(() => import("./skill/CreateSkill"));
const UpdateSkill = React.lazy(() => import("./skill/UpdateSkill"));

/** Search Requests */
const SearchRequestPage = React.lazy(
  () => import("./searchRequest/SearchRequestPage"),
);
const SingleSearchRequestPage = React.lazy(
  () => import("./searchRequest/SingleSearchRequestPage"),
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
              path: "cmo-assets",
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth roles={[Role.Admin]}>
                      <CmoAssetPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: "create",
                  element: (
                    <RequireAuth roles={[Role.Admin]}>
                      <CreateCmoAsset />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":cmoAssetId",
                  children: [
                    {
                      path: "edit",
                      element: (
                        <RequireAuth roles={[Role.Admin]}>
                          <UpdateCmoAsset />
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
