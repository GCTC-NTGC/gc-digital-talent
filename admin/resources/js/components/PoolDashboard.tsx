import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "../helpers/router";
import { CreateClassification } from "./classification/CreateClassification";
import { UpdateClassification } from "./classification/UpdateClassification";
import ClientProvider from "./ClientProvider";
import CmoAssetPage from "./cmoAsset/CmoAssetPage";
import { CreateCmoAsset } from "./cmoAsset/CreateCmoAsset";
import { UpdateCmoAsset } from "./cmoAsset/UpdateCmoAsset";
import { CreateUser } from "./user/CreateUser";
import { Dashboard, MenuHeading, MenuLink } from "./dashboard/Dashboard";
import ErrorContainer from "./ErrorContainer";
import OperationalRequirementPage from "./operationalRequirement/OperationalRequirementPage";
import { CreateOperationalRequirement } from "./operationalRequirement/CreateOperationalRequirement";
import { UpdateOperationalRequirement } from "./operationalRequirement/UpdateOperationalRequirement";
import { CreatePoolCandidate } from "./poolCandidate/CreatePoolCandidate";
import { UpdatePoolCandidate } from "./poolCandidate/UpdatePoolCandidate";
import PoolCandidatePage from "./poolCandidate/PoolCandidatePage";
import ClassificationPage from "./classification/ClassificationPage";
import { UpdateUser } from "./user/UpdateUser";
import UserPage from "./user/UserPage";
import PoolPage from "./pool/PoolPage";
import { CreatePool } from "./pool/CreatePool";
import { UpdatePool } from "./pool/UpdatePool";
import Toast from "./Toast";
import {
  classificationCreate,
  classificationTable,
  classificationUpdate,
  cmoAssetCreate,
  cmoAssetTable,
  cmoAssetUpdate,
  operationalRequirementCreate,
  operationalRequirementTable,
  operationalRequirementUpdate,
  poolCandidateCreate,
  poolCandidateTable,
  poolCandidateUpdate,
  poolCreate,
  poolTable,
  poolUpdate,
  userCreate,
  userTable,
  userUpdate,
} from "../helpers/routes";

const messages = defineMessages({
  menuAdminTools: {
    id: "poolDashboard.menu.adminToolsLabel",
    defaultMessage: "Admin Tools",
    description: "Label displayed on the Admin Tools menu item.",
  },
  menuUsers: {
    id: "poolDashboard.menu.usersLabel",
    defaultMessage: "Users",
    description: "Label displayed on the Users menu item.",
  },
  menuClassifications: {
    id: "poolDashboard.menu.classificationsLabel",
    defaultMessage: "Classifications",
    description: "Label displayed on the Classifications menu item.",
  },
  menuCmoAssets: {
    id: "poolDashboard.menu.cmoAssetsLabel",
    defaultMessage: "CMO Assets",
    description: "Label displayed on the CMO Assets menu item.",
  },
  menuOperationalRequirements: {
    id: "poolDashboard.menu.operationalRequirementsLabel",
    defaultMessage: "Operational Requirements",
    description: "Label displayed on the Operational Requirements menu item.",
  },
  menuPools: {
    id: "poolDashboard.menu.poolsLabel",
    defaultMessage: "Pools",
    description: "Label displayed on the Pools menu item.",
  },
});

const routes: Routes<RouterResult> = [
  {
    path: userTable(),
    action: () => ({
      component: <UserPage />,
    }),
  },
  {
    path: userCreate(),
    action: () => ({
      component: <CreateUser />,
    }),
  },
  {
    path: userUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdateUser userId={params.id as string} />,
    }),
  },
  {
    path: classificationTable(),
    action: () => ({
      component: <ClassificationPage />,
    }),
  },
  {
    path: classificationCreate(),
    action: () => ({
      component: <CreateClassification />,
    }),
  },
  {
    path: classificationUpdate(":id"),
    action: ({ params }) => ({
      component: (
        <UpdateClassification classificationId={params.id as string} />
      ),
    }),
  },
  {
    path: cmoAssetTable(),
    action: () => ({
      component: <CmoAssetPage />,
    }),
  },
  {
    path: cmoAssetCreate(),
    action: () => ({
      component: <CreateCmoAsset />,
    }),
  },
  {
    path: cmoAssetUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdateCmoAsset cmoAssetId={params.id as string} />,
    }),
  },
  {
    path: operationalRequirementTable(),
    action: () => ({
      component: <OperationalRequirementPage />,
    }),
  },
  {
    path: operationalRequirementCreate(),
    action: () => ({
      component: <CreateOperationalRequirement />,
    }),
  },
  {
    path: operationalRequirementUpdate(":id"),
    action: ({ params }) => ({
      component: (
        <UpdateOperationalRequirement
          operationalRequirementId={params.id as string}
        />
      ),
    }),
  },
  {
    path: poolCandidateTable(":id"),
    action: ({ params }) => ({
      component: <PoolCandidatePage poolId={params.id as string} />,
    }),
  },
  {
    path: poolCandidateCreate(":id"),
    action: ({ params }) => ({
      component: <CreatePoolCandidate poolId={params.id as string} />,
    }),
  },
  {
    path: poolCandidateUpdate(":id", ":id"),
    action: ({ params }) => ({
      component: (
        <UpdatePoolCandidate poolCandidateId={params.candidateId as string} />
      ),
    }),
  },
  {
    path: poolTable(),
    action: () => ({
      component: <PoolPage />,
    }),
  },
  {
    path: poolCreate(),
    action: () => ({
      component: <CreatePool />,
    }),
  },
  {
    path: poolUpdate(":id"),
    action: ({ params }) => ({
      component: <UpdatePool poolId={params.id as string} />,
    }),
  },
];

export const PoolDashboard: React.FC = () => {
  const intl = useIntl();

  const menuItems = [
    <MenuHeading
      key="admin-tools"
      text={intl.formatMessage(messages.menuAdminTools)}
    />,
    <MenuLink
      key="users"
      href={userTable()}
      text={intl.formatMessage(messages.menuUsers)}
    />,
    <MenuLink
      key="classifications"
      href={classificationTable()}
      text={intl.formatMessage(messages.menuClassifications)}
    />,
    <MenuLink
      key="cmo-assets"
      href={cmoAssetTable()}
      text={intl.formatMessage(messages.menuCmoAssets)}
    />,
    <MenuLink
      key="operational-requirements"
      href={operationalRequirementTable()}
      text={intl.formatMessage(messages.menuOperationalRequirements)}
    />,
    <MenuLink
      key="pools"
      href={poolTable()}
      text={intl.formatMessage(messages.menuPools)}
    />,
  ];

  return (
    <ErrorContainer>
      <ClientProvider>
        <Dashboard menuItems={menuItems} contentRoutes={routes} />
        <Toast />
      </ClientProvider>
    </ErrorContainer>
  );
};

export default PoolDashboard;
