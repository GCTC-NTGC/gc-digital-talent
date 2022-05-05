import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import Toast from "@common/components/Toast";
import { AdminRoutes, useAdminRoutes } from "../adminRoutes";
import { CreateClassification } from "./classification/CreateClassification";
import { UpdateClassification } from "./classification/UpdateClassification";
import ClientProvider from "./ClientProvider";
import CmoAssetPage from "./cmoAsset/CmoAssetPage";
import { CreateCmoAsset } from "./cmoAsset/CreateCmoAsset";
import { UpdateCmoAsset } from "./cmoAsset/UpdateCmoAsset";
import { CreateUser } from "./user/CreateUser";
import { Dashboard, MenuHeading, MenuLink } from "./dashboard/Dashboard";
import { CreatePoolCandidate } from "./poolCandidate/CreatePoolCandidate";
import { UpdatePoolCandidate } from "./poolCandidate/UpdatePoolCandidate";
import PoolCandidatePage from "./poolCandidate/PoolCandidatePage";
import ClassificationPage from "./classification/ClassificationPage";
import { UpdateUser } from "./user/UpdateUser";
import UserPage from "./user/UserPage";
import PoolPage from "./pool/PoolPage";
import { CreatePool } from "./pool/CreatePool";
import { UpdatePool } from "./pool/UpdatePool";
import AuthContainer from "./AuthContainer";
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

const routes = (paths: AdminRoutes): Routes<RouterResult> => [
  {
    path: paths.home(),
    action: () => ({
      component: <HomePage />,
    }),
  },
  {
    path: paths.userTable(),
    action: () => ({
      component: <UserPage />,
    }),
  },
  {
    path: paths.userCreate(),
    action: () => ({
      component: <CreateUser />,
    }),
  },
  {
    path: paths.userUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdateUser userId={params.id as string} />,
    }),
  },
  {
    path: paths.classificationTable(),
    action: () => ({
      component: <ClassificationPage />,
    }),
  },
  {
    path: paths.classificationCreate(),
    action: () => ({
      component: <CreateClassification />,
    }),
  },
  {
    path: paths.classificationUpdate(":id"),
    action: ({ params }) => ({
      component: (
        <UpdateClassification classificationId={params.id as string} />
      ),
    }),
  },
  {
    path: paths.cmoAssetTable(),
    action: () => ({
      component: <CmoAssetPage />,
    }),
  },
  {
    path: paths.cmoAssetCreate(),
    action: () => ({
      component: <CreateCmoAsset />,
    }),
  },
  {
    path: paths.cmoAssetUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdateCmoAsset cmoAssetId={params.id as string} />,
    }),
  },
  {
    path: paths.poolCandidateTable(":id"),
    action: ({ params }) => ({
      component: <PoolCandidatePage poolId={params.id as string} />,
    }),
  },
  {
    path: paths.poolCandidateCreate(":id"),
    action: ({ params }) => ({
      component: <CreatePoolCandidate poolId={params.id as string} />,
    }),
  },
  {
    path: paths.poolCandidateUpdate(":poolId", ":candidateId"),
    action: ({ params }) => ({
      component: (
        <UpdatePoolCandidate poolCandidateId={params.candidateId as string} />
      ),
    }),
  },
  {
    path: paths.poolTable(),
    action: () => ({
      component: <PoolPage />,
    }),
  },
  {
    path: paths.poolCreate(),
    action: () => ({
      component: <CreatePool />,
    }),
  },
  {
    path: paths.poolUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdatePool poolId={params.id as string} />,
    }),
  },
  {
    path: paths.departmentTable(),
    action: () => ({
      component: <DepartmentPage />,
    }),
  },
  {
    path: paths.departmentCreate(),
    action: () => ({
      component: <CreateDepartment />,
    }),
  },
  {
    path: paths.departmentUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdateDepartment departmentId={params.id as string} />,
    }),
  },
  {
    path: paths.skillFamilyTable(),
    action: () => ({
      component: <SkillFamilyPage />,
    }),
  },
  {
    path: paths.skillFamilyCreate(),
    action: () => ({
      component: <CreateSkillFamily />,
    }),
  },
  {
    path: paths.skillFamilyUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdateSkillFamily skillFamilyId={params.id as string} />,
    }),
  },
  {
    path: paths.skillTable(),
    action: () => ({
      component: <SkillPage />,
    }),
  },
  {
    path: paths.skillCreate(),
    action: () => ({
      component: <CreateSkill />,
    }),
  },
  {
    path: paths.skillUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdateSkill skillId={params.id as string} />,
    }),
  },
  {
    path: paths.searchRequestTable(),
    action: () => ({
      component: <SearchRequestPage />,
    }),
  },
  {
    path: paths.searchRequestUpdate(":id"),
    action: ({ params }) => ({
      component: (
        <SingleSearchRequestPage searchRequestId={params.id as string} />
      ),
    }),
  },
];

export const PoolDashboard: React.FC = () => {
  const intl = useIntl();
  const paths = useAdminRoutes();

  const menuItems = [
    <MenuHeading
      key="search-requests"
      text={intl.formatMessage({
        defaultMessage: "Requests",
        description: "Label displayed on the requests menu item.",
      })}
    />,
    <MenuLink
      key="all-requests"
      href={paths.searchRequestTable()}
      text={intl.formatMessage({
        defaultMessage: "All Requests",
        description: "Label displayed on the all requests menu item.",
      })}
    />,
    <MenuHeading
      key="admin-tools"
      text={intl.formatMessage({
        defaultMessage: "Admin Tools",
        description: "Label displayed on the Admin Tools menu item.",
      })}
    />,
    <MenuLink
      key="users"
      href={paths.userTable()}
      text={intl.formatMessage({
        defaultMessage: "Users",
        description: "Label displayed on the Users menu item.",
      })}
    />,
    <MenuLink
      key="classifications"
      href={paths.classificationTable()}
      text={intl.formatMessage({
        defaultMessage: "Classifications",
        description: "Label displayed on the Classifications menu item.",
      })}
    />,
    <MenuLink
      key="cmo-assets"
      href={paths.cmoAssetTable()}
      text={intl.formatMessage({
        defaultMessage: "CMO Assets",
        description: "Label displayed on the CMO Assets menu item.",
      })}
    />,
    <MenuLink
      key="pools"
      href={paths.poolTable()}
      text={intl.formatMessage({
        defaultMessage: "Pools",
        description: "Label displayed on the Pools menu item.",
      })}
    />,
    <MenuLink
      key="departments"
      href={paths.departmentTable()}
      text={intl.formatMessage({
        defaultMessage: "Departments",
        description: "Label displayed on the Departments menu item.",
      })}
    />,
    <MenuLink
      key="skill-families"
      href={paths.skillFamilyTable()}
      text={intl.formatMessage({
        defaultMessage: "Skill Families",
        description: "Label displayed on the Skill Families menu item.",
      })}
    />,
    <MenuLink
      key="skills"
      href={paths.skillTable()}
      text={intl.formatMessage({
        defaultMessage: "Skills",
        description: "Label displayed on the Skills menu item.",
      })}
    />,
  ];

  return (
    <AuthContainer>
      <ClientProvider>
        <Dashboard menuItems={menuItems} contentRoutes={routes(paths)} />
        <Toast />
      </ClientProvider>
    </AuthContainer>
  );
};

export default PoolDashboard;
