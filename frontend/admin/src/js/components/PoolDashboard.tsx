import React from "react";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import { AuthenticationContext } from "@common/components/Auth";
import { Helmet } from "react-helmet";
import { getLocale } from "@common/helpers/localize";
import { useIntl } from "react-intl";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { AdminRoutes, useAdminRoutes } from "../adminRoutes";
import { CreateClassification } from "./classification/CreateClassification";
import { UpdateClassification } from "./classification/UpdateClassification";
import CmoAssetPage from "./cmoAsset/CmoAssetPage";
import { CreateCmoAsset } from "./cmoAsset/CreateCmoAsset";
import { UpdateCmoAsset } from "./cmoAsset/UpdateCmoAsset";
import { CreateUser } from "./user/CreateUser";
import Dashboard from "./dashboard/Dashboard";
import { CreatePoolCandidate } from "./poolCandidate/CreatePoolCandidate";
import { UpdatePoolCandidate } from "./poolCandidate/UpdatePoolCandidate";
import PoolCandidatePage from "./poolCandidate/PoolCandidatePage";
import ClassificationPage from "./classification/ClassificationPage";
import { UpdateUser } from "./user/UpdateUser";
import UserPage from "./user/UserPage";
import PoolPage from "./pool/PoolPage";
import { CreatePool } from "./pool/CreatePool";
import { UpdatePool } from "./pool/UpdatePool";
import DeprecatedViewPool from "./pool/deprecated/ViewPool";
import ViewPool from "./pool/ViewPool";
import DepartmentPage from "./department/DepartmentPage";
import { CreateDepartment } from "./department/CreateDepartment";
import { UpdateDepartment } from "./department/UpdateDepartment";
import SearchRequestPage from "./searchRequest/SearchRequestPage";
import SingleSearchRequestPage from "./searchRequest/SingleSearchRequestPage";
import SkillFamilyPage from "./skillFamily/SkillFamilyPage";
import { CreateSkillFamily } from "./skillFamily/CreateSkillFamily";
import { UpdateSkillFamily } from "./skillFamily/UpdateSkillFamily";
import SkillPage from "./skill/SkillPage";
import { CreateSkill } from "./skill/CreateSkill";
import { UpdateSkill } from "./skill/UpdateSkill";
import { Role } from "../api/generated";
import DashboardPage from "./dashboard/DashboardPage";
import ViewUser from "./user/ViewUser";
import HomePage from "./home/HomePage";

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
    path: paths.poolUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdatePool poolId={params.id as string} />,
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
    <>
      <Dashboard contentRoutes={routes(paths, loggedIn)} />
      <Helmet>
        <html lang={getLocale(intl)} />
      </Helmet>
    </>
  );
};

export default PoolDashboard;
