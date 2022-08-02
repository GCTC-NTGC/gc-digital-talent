import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { Helmet } from "react-helmet";

import { RouterResult } from "@common/helpers/router";
import { AuthenticationContext } from "@common/components/Auth";
import { getLocale } from "@common/helpers/localize";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";

import Pending from "@common/components/Pending";
import { AdminRoutes, useAdminRoutes } from "../adminRoutes";
import { Role } from "../api/generated";

const HomePage = React.lazy(() => import("./home/HomePage"));
const Dashboard = React.lazy(() => import("./dashboard/Dashboard"));
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

const ViewPoolPage = checkFeatureFlag("FEATURE_DIRECTINTAKE")
  ? ViewPool
  : DeprecatedViewPool;

const routes = (
  paths: AdminRoutes,
  loggedIn?: boolean,
): Routes<RouterResult> => [
  {
    path: paths.home(),
    action: () =>
      loggedIn
        ? {
            redirect: paths.dashboard(),
          }
        : {
            component: <HomePage />,
          },
  },
  {
    path: paths.dashboard(),
    action: () => ({
      component: <DashboardPage />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.userTable(),
    action: () => ({
      component: <UserPage />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.userCreate(),
    action: () => ({
      component: <CreateUser />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.userUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdateUser userId={params.id as string} />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.userView(":id"),
    action: ({ params }) => ({
      component: <ViewUser userId={params.id as string} />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.classificationTable(),
    action: () => ({
      component: <ClassificationPage />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.classificationCreate(),
    action: () => ({
      component: <CreateClassification />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.classificationUpdate(":id"),
    action: ({ params }) => ({
      component: (
        <UpdateClassification classificationId={params.id as string} />
      ),
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.cmoAssetTable(),
    action: () => ({
      component: <CmoAssetPage />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.cmoAssetCreate(),
    action: () => ({
      component: <CreateCmoAsset />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.cmoAssetUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdateCmoAsset cmoAssetId={params.id as string} />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.poolCandidateTable(":id"),
    action: ({ params }) => ({
      component: <PoolCandidatePage poolId={params.id as string} />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.poolCandidateCreate(":id"),
    action: ({ params }) => ({
      component: <CreatePoolCandidate poolId={params.id as string} />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.poolCandidateUpdate(":poolId", ":candidateId"),
    action: ({ params }) => ({
      component: (
        <UpdatePoolCandidate poolCandidateId={params.candidateId as string} />
      ),
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.poolTable(),
    action: () => ({
      component: <PoolPage />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.poolCreate(),
    action: () => ({
      component: <CreatePool />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.poolEdit(":id"),
    action: ({ params }) => ({
      component: checkFeatureFlag("FEATURE_DIRECTINTAKE") ? (
        <EditPool poolId={params.id as string} />
      ) : (
        /* deprecated */
        <DeprecatedUpdatePool poolId={params.id as string} />
      ),
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.poolView(":id"),
    action: ({ params }) => ({
      component: <ViewPoolPage poolId={params.id as string} />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.departmentTable(),
    action: () => ({
      component: <DepartmentPage />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.departmentCreate(),
    action: () => ({
      component: <CreateDepartment />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.departmentUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdateDepartment departmentId={params.id as string} />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.skillFamilyTable(),
    action: () => ({
      component: <SkillFamilyPage />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.skillFamilyCreate(),
    action: () => ({
      component: <CreateSkillFamily />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.skillFamilyUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdateSkillFamily skillFamilyId={params.id as string} />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.skillTable(),
    action: () => ({
      component: <SkillPage />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.skillCreate(),
    action: () => ({
      component: <CreateSkill />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.skillUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdateSkill skillId={params.id as string} />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.searchRequestTable(),
    action: () => ({
      component: <SearchRequestPage />,
      authorizedRoles: [Role.Admin],
    }),
  },
  {
    path: paths.searchRequestUpdate(":id"),
    action: ({ params }) => ({
      component: (
        <SingleSearchRequestPage searchRequestId={params.id as string} />
      ),
      authorizedRoles: [Role.Admin],
    }),
  },
];

export const PoolDashboard: React.FC = () => {
  const { loggedIn } = React.useContext(AuthenticationContext);
  const paths = useAdminRoutes();
  const intl = useIntl();
  return (
    <Pending fetching={false}>
      <Dashboard contentRoutes={routes(paths, loggedIn)} />
      <Helmet>
        <html lang={getLocale(intl)} />
      </Helmet>
    </Pending>
  );
};

export default PoolDashboard;
