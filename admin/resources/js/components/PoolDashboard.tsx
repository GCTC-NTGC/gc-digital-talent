import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Routes } from "universal-router";
import { Link, RouterResult } from "../helpers/router";
import { CreateClassification } from "./classification/CreateClassification";
import { UpdateClassification } from "./classification/UpdateClassification";

import { ClassificationTableApi } from "./classification/ClassificationTable";
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
import { UpdateUser } from "./user/UpdateUser";
import UserPage from "./user/UserPage";
import PoolPage from "./pool/PoolPage";
import { CreatePool } from "./pool/CreatePool";
import { UpdatePool } from "./pool/UpdatePool";

import { useGetPoolsQuery } from "../api/generated";
import { getLocale } from "../helpers/localize";

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
  menuPoolCandidates: {
    id: "poolDashboard.menu.poolCandidatesLabel",
    defaultMessage: "Pool Candidates",
    description: "Label displayed on the Pool Candidates menu item.",
  },
  menuPools: {
    id: "poolDashboard.menu.poolsLabel",
    defaultMessage: "Pools",
    description: "Label displayed on the Pools menu item.",
  },
});

const routes: Routes<RouterResult> = [
  {
    path: "/admin/users",
    action: () => ({
      component: <UserPage />,
    }),
  },
  {
    path: "/admin/users/create",
    action: () => ({
      component: <CreateUser />,
    }),
  },
  {
    path: "/admin/users/:id/edit",
    action: ({ params }) => ({
      component: <UpdateUser userId={params.id as string} />,
    }),
  },
  {
    path: "/admin/classifications",
    action: () => ({
      component: (
        <div>
          <Link href="/admin/classifications/create" title="">
            Create Classification
          </Link>
          <ClassificationTableApi />
        </div>
      ),
    }),
  },
  {
    path: "/admin/classifications/create",
    action: () => ({
      component: <CreateClassification />,
    }),
  },
  {
    path: "/admin/classifications/:id/edit",
    action: ({ params }) => ({
      component: (
        <UpdateClassification classificationId={params.id as string} />
      ),
    }),
  },
  {
    path: "/admin/cmo-assets",
    action: () => ({
      component: <CmoAssetPage />,
    }),
  },
  {
    path: "/admin/cmo-assets/create",
    action: () => ({
      component: <CreateCmoAsset />,
    }),
  },
  {
    path: "/admin/cmo-assets/:id/edit",
    action: ({ params }) => ({
      component: <UpdateCmoAsset cmoAssetId={params.id as string} />,
    }),
  },
  {
    path: "/admin/operational-requirements",
    action: () => ({
      component: <OperationalRequirementPage />,
    }),
  },
  {
    path: "/admin/operational-requirements/create",
    action: () => ({
      component: <CreateOperationalRequirement />,
    }),
  },
  {
    path: "/admin/operational-requirements/:id/edit",
    action: ({ params }) => ({
      component: (
        <UpdateOperationalRequirement
          operationalRequirementId={params.id as string}
        />
      ),
    }),
  },
  {
    path: "/admin/pools/:id/pool-candidates",
    action: ({ params }) => ({
      component: <PoolCandidatePage poolId={params.id as string} />,
    }),
  },
  {
    path: "/admin/pools/:id/pool-candidates/create",
    action: ({ params }) => ({
      component: <CreatePoolCandidate poolId={params.id as string} />,
    }),
  },
  {
    path: "/admin/pools/:id/pool-candidates/:candidateId/edit",
    action: ({ params }) => ({
      component: (
        <UpdatePoolCandidate poolCandidateId={params.candidateId as string} />
      ),
    }),
  },
  {
    path: "/admin/pools",
    action: () => ({
      component: <PoolPage />,
    }),
  },
  {
    path: "/admin/pools/create",
    action: () => ({
      component: <CreatePool />,
    }),
  },
  {
    path: "/admin/pools/:id/edit",
    action: ({ params }) => ({
      component: <UpdatePool poolId={params.id as string} />,
    }),
  },
];

export const PoolDashboard: React.FC = () => {
  const [result] = useGetPoolsQuery();
  const { data, fetching, error } = result;
  const intl = useIntl();

  const menuItems = [
    <MenuHeading
      key="admin-tools"
      text={intl.formatMessage(messages.menuAdminTools)}
    />,
    <MenuLink
      key="users"
      href="/admin/users"
      text={intl.formatMessage(messages.menuUsers)}
    />,
    <MenuLink
      key="classifications"
      href="/admin/classifications"
      text={intl.formatMessage(messages.menuClassifications)}
    />,
    <MenuLink
      key="cmo-assets"
      href="/admin/cmo-assets"
      text={intl.formatMessage(messages.menuCmoAssets)}
    />,
    <MenuLink
      key="operational-requirements"
      href="/admin/operational-requirements"
      text={intl.formatMessage(messages.menuOperationalRequirements)}
    />,
    <MenuLink
      key="pools"
      href="/admin/pools"
      text={intl.formatMessage(messages.menuPools)}
    />,
  ];

  if (!fetching && !error) {
    menuItems.push(
      <MenuHeading
        key="pool-candidates"
        text={intl.formatMessage(messages.menuPoolCandidates)}
      />,
    );
    data?.pools.map((pool) =>
      menuItems.push(
        <MenuLink
          key={`/admin/pools/${pool?.id}/pool-candidates`}
          href={`/admin/pools/${pool?.id}/pool-candidates`}
          text={(pool?.name && pool?.name[getLocale(intl)]) ?? ""}
        />,
      ),
    );
  }

  return (
    <ErrorContainer>
      <ClientProvider>
        <Dashboard menuItems={menuItems} contentRoutes={routes} />
      </ClientProvider>
    </ErrorContainer>
  );
};

export default PoolDashboard;
