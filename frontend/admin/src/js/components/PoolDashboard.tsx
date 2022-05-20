import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import Toast from "@common/components/Toast";
import NotAuthorized from "@common/components/NotAuthorized";
import { getLocale } from "@common/helpers/localize";
import {
  AuthorizationContext,
  AuthenticationContext,
} from "@common/components/Auth";
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
import HomePage from "./home/HomePage";
import { Role } from "../api/generated";
import DashboardPage from "./dashboard/DashboardPage";

const AdminNotAuthorized: React.FC = () => {
  const intl = useIntl();
  return (
    <NotAuthorized
      headingMessage={intl.formatMessage({
        description:
          "Heading for the message saying the page to view is not authorized.",
        defaultMessage: "Sorry, you are not authorized to view this page.",
      })}
    >
      <p>
        {intl.formatMessage({
          description:
            "Detailed message saying the page to view is not authorized.",
          defaultMessage:
            "Oops, it looks like you've landed on a page that you are not authorized to view.",
        })}
      </p>
    </NotAuthorized>
  );
};

const routes = (
  paths: AdminRoutes,
  loggedIn?: boolean,
  isAdmin?: boolean,
): Routes<RouterResult> => [
  {
    path: paths.home(),
    action: () => ({
      component: <HomePage />,
      redirect: loggedIn ? paths.dashboard() : undefined,
    }),
  },
  {
    path: paths.dashboard(),
    action: () => ({
      component: loggedIn ? <DashboardPage /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.userTable(),
    action: () => ({
      component: loggedIn && isAdmin ? <UserPage /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.userCreate(),
    action: () => ({
      component: loggedIn && isAdmin ? <CreateUser /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.userUpdate(":id"),
    action: ({ params }) => ({
      component:
        loggedIn && isAdmin ? (
          <UpdateUser userId={params.id as string} />
        ) : (
          <AdminNotAuthorized />
        ),
    }),
  },
  {
    path: paths.classificationTable(),
    action: () => ({
      component:
        loggedIn && isAdmin ? <ClassificationPage /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.classificationCreate(),
    action: () => ({
      component:
        loggedIn && isAdmin ? <CreateClassification /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.classificationUpdate(":id"),
    action: ({ params }) => ({
      component:
        loggedIn && isAdmin ? (
          <UpdateClassification classificationId={params.id as string} />
        ) : (
          <AdminNotAuthorized />
        ),
    }),
  },
  {
    path: paths.cmoAssetTable(),
    action: () => ({
      component:
        loggedIn && isAdmin ? <CmoAssetPage /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.cmoAssetCreate(),
    action: () => ({
      component:
        loggedIn && isAdmin ? <CreateCmoAsset /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.cmoAssetUpdate(":id"),
    action: ({ params }) => ({
      component:
        loggedIn && isAdmin ? (
          <UpdateCmoAsset cmoAssetId={params.id as string} />
        ) : (
          <AdminNotAuthorized />
        ),
    }),
  },
  {
    path: paths.poolCandidateTable(":id"),
    action: ({ params }) => ({
      component:
        loggedIn && isAdmin ? (
          <PoolCandidatePage poolId={params.id as string} />
        ) : (
          <AdminNotAuthorized />
        ),
    }),
  },
  {
    path: paths.poolCandidateCreate(":id"),
    action: ({ params }) => ({
      component:
        loggedIn && isAdmin ? (
          <CreatePoolCandidate poolId={params.id as string} />
        ) : (
          <AdminNotAuthorized />
        ),
    }),
  },
  {
    path: paths.poolCandidateUpdate(":poolId", ":candidateId"),
    action: ({ params }) => ({
      component:
        loggedIn && isAdmin ? (
          <UpdatePoolCandidate poolCandidateId={params.candidateId as string} />
        ) : (
          <AdminNotAuthorized />
        ),
    }),
  },
  {
    path: paths.poolTable(),
    action: () => ({
      component: loggedIn && isAdmin ? <PoolPage /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.poolCreate(),
    action: () => ({
      component: loggedIn && isAdmin ? <CreatePool /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.poolUpdate(":id"),
    action: ({ params }) => ({
      component:
        loggedIn && isAdmin ? (
          <UpdatePool poolId={params.id as string} />
        ) : (
          <AdminNotAuthorized />
        ),
    }),
  },
  {
    path: paths.departmentTable(),
    action: () => ({
      component:
        loggedIn && isAdmin ? <DepartmentPage /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.departmentCreate(),
    action: () => ({
      component:
        loggedIn && isAdmin ? <CreateDepartment /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.departmentUpdate(":id"),
    action: ({ params }) => ({
      component:
        loggedIn && isAdmin ? (
          <UpdateDepartment departmentId={params.id as string} />
        ) : (
          <AdminNotAuthorized />
        ),
    }),
  },
  {
    path: paths.skillFamilyTable(),
    action: () => ({
      component:
        loggedIn && isAdmin ? <SkillFamilyPage /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.skillFamilyCreate(),
    action: () => ({
      component:
        loggedIn && isAdmin ? <CreateSkillFamily /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.skillFamilyUpdate(":id"),
    action: ({ params }) => ({
      component:
        loggedIn && isAdmin ? (
          <UpdateSkillFamily skillFamilyId={params.id as string} />
        ) : (
          <AdminNotAuthorized />
        ),
    }),
  },
  {
    path: paths.skillTable(),
    action: () => ({
      component: loggedIn && isAdmin ? <SkillPage /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.skillCreate(),
    action: () => ({
      component: loggedIn && isAdmin ? <CreateSkill /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.skillUpdate(":id"),
    action: ({ params }) => ({
      component:
        loggedIn && isAdmin ? (
          <UpdateSkill skillId={params.id as string} />
        ) : (
          <AdminNotAuthorized />
        ),
    }),
  },
  {
    path: paths.searchRequestTable(),
    action: () => ({
      component:
        loggedIn && isAdmin ? <SearchRequestPage /> : <AdminNotAuthorized />,
    }),
  },
  {
    path: paths.searchRequestUpdate(":id"),
    action: ({ params }) => ({
      component:
        loggedIn && isAdmin ? (
          <SingleSearchRequestPage searchRequestId={params.id as string} />
        ) : (
          <AdminNotAuthorized />
        ),
    }),
  },
];

export const PoolDashboard: React.FC = () => {
  const { loggedIn } = React.useContext(AuthenticationContext);
  const paths = useAdminRoutes();
  const { loggedInUserRoles } = React.useContext(AuthorizationContext);
  const isAdmin = !!loggedInUserRoles?.includes(Role.Admin);

  return (
    <>
      <Dashboard contentRoutes={routes(paths, loggedIn, isAdmin)} />
      <Toast />
    </>
  );
};

export default PoolDashboard;
