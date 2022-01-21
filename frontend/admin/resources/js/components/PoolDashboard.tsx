import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import Toast from "@common/components/Toast";
import {
  classificationCreatePath,
  classificationTablePath,
  classificationUpdatePath,
  cmoAssetCreatePath,
  cmoAssetTablePath,
  cmoAssetUpdatePath,
  departmentTablePath,
  departmentCreatePath,
  departmentUpdatePath,
  operationalRequirementCreatePath,
  operationalRequirementTablePath,
  operationalRequirementUpdatePath,
  poolCandidateCreatePath,
  poolCandidateTablePath,
  poolCandidateUpdatePath,
  poolCreatePath,
  poolTablePath,
  poolUpdatePath,
  userCreatePath,
  userTablePath,
  userUpdatePath,
  homePath,
  searchRequestTablePath,
  searchRequestUpdatePath,
} from "../adminRoutes";
import { CreateClassification } from "./classification/CreateClassification";
import { UpdateClassification } from "./classification/UpdateClassification";
import ClientProvider from "./ClientProvider";
import CmoAssetPage from "./cmoAsset/CmoAssetPage";
import { CreateCmoAsset } from "./cmoAsset/CreateCmoAsset";
import { UpdateCmoAsset } from "./cmoAsset/UpdateCmoAsset";
import { CreateUser } from "./user/CreateUser";
import { Dashboard, MenuHeading, MenuLink } from "./dashboard/Dashboard";
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
import AuthContainer from "./AuthContainer";
import DepartmentPage from "./department/DepartmentPage";
import { CreateDepartment } from "./department/CreateDepartment";
import { UpdateDepartment } from "./department/UpdateDepartment";
import SearchRequestPage from "./searchRequest/SearchRequestPage";
import SingleSearchRequestPage from "./searchRequest/SingleSearchRequestPage";

const routes: Routes<RouterResult> = [
  {
    path: [homePath()],
    action: () => ({
      component: <div />,
      redirect: poolTablePath(), // TODO: Which page should be treated as the dashboard Landing page?
    }),
  },
  {
    path: userTablePath(),
    action: () => ({
      component: <UserPage />,
    }),
  },
  {
    path: userCreatePath(),
    action: () => ({
      component: <CreateUser />,
    }),
  },
  {
    path: userUpdatePath(":id"),
    action: ({ params }) => ({
      component: <UpdateUser userId={params.id as string} />,
    }),
  },
  {
    path: classificationTablePath(),
    action: () => ({
      component: <ClassificationPage />,
    }),
  },
  {
    path: classificationCreatePath(),
    action: () => ({
      component: <CreateClassification />,
    }),
  },
  {
    path: classificationUpdatePath(":id"),
    action: ({ params }) => ({
      component: (
        <UpdateClassification classificationId={params.id as string} />
      ),
    }),
  },
  {
    path: cmoAssetTablePath(),
    action: () => ({
      component: <CmoAssetPage />,
    }),
  },
  {
    path: cmoAssetCreatePath(),
    action: () => ({
      component: <CreateCmoAsset />,
    }),
  },
  {
    path: cmoAssetUpdatePath(":id"),
    action: ({ params }) => ({
      component: <UpdateCmoAsset cmoAssetId={params.id as string} />,
    }),
  },
  {
    path: operationalRequirementTablePath(),
    action: () => ({
      component: <OperationalRequirementPage />,
    }),
  },
  {
    path: operationalRequirementCreatePath(),
    action: () => ({
      component: <CreateOperationalRequirement />,
    }),
  },
  {
    path: operationalRequirementUpdatePath(":id"),
    action: ({ params }) => ({
      component: (
        <UpdateOperationalRequirement
          operationalRequirementId={params.id as string}
        />
      ),
    }),
  },
  {
    path: poolCandidateTablePath(":id"),
    action: ({ params }) => ({
      component: <PoolCandidatePage poolId={params.id as string} />,
    }),
  },
  {
    path: poolCandidateCreatePath(":id"),
    action: ({ params }) => ({
      component: <CreatePoolCandidate poolId={params.id as string} />,
    }),
  },
  {
    path: poolCandidateUpdatePath(":poolId", ":candidateId"),
    action: ({ params }) => ({
      component: (
        <UpdatePoolCandidate poolCandidateId={params.candidateId as string} />
      ),
    }),
  },
  {
    path: poolTablePath(),
    action: () => ({
      component: <PoolPage />,
    }),
  },
  {
    path: poolCreatePath(),
    action: () => ({
      component: <CreatePool />,
    }),
  },
  {
    path: poolUpdatePath(":id"),
    action: ({ params }) => ({
      component: <UpdatePool poolId={params.id as string} />,
    }),
  },
  {
    path: departmentTablePath(),
    action: () => ({
      component: <DepartmentPage />,
    }),
  },
  {
    path: departmentCreatePath(),
    action: () => ({
      component: <CreateDepartment />,
    }),
  },
  {
    path: departmentUpdatePath(":id"),
    action: ({ params }) => ({
      component: <UpdateDepartment departmentId={params.id as string} />,
    }),
  },
  {
    path: searchRequestTablePath(),
    action: () => ({
      component: <SearchRequestPage />,
    }),
  },
  {
    path: searchRequestUpdatePath(":id"),
    action: ({ params }) => ({
      component: (
        <SingleSearchRequestPage searchRequestId={params.id as string} />
      ),
    }),
  },
];

export const PoolDashboard: React.FC = () => {
  const intl = useIntl();

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
      href={searchRequestTablePath()}
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
      href={userTablePath()}
      text={intl.formatMessage({
        defaultMessage: "Users",
        description: "Label displayed on the Users menu item.",
      })}
    />,
    <MenuLink
      key="classifications"
      href={classificationTablePath()}
      text={intl.formatMessage({
        defaultMessage: "Classifications",
        description: "Label displayed on the Classifications menu item.",
      })}
    />,
    <MenuLink
      key="cmo-assets"
      href={cmoAssetTablePath()}
      text={intl.formatMessage({
        defaultMessage: "CMO Assets",
        description: "Label displayed on the CMO Assets menu item.",
      })}
    />,
    <MenuLink
      key="operational-requirements"
      href={operationalRequirementTablePath()}
      text={intl.formatMessage({
        defaultMessage: "Operational Requirements",
        description:
          "Label displayed on the Operational Requirements menu item.",
      })}
    />,
    <MenuLink
      key="pools"
      href={poolTablePath()}
      text={intl.formatMessage({
        defaultMessage: "Pools",
        description: "Label displayed on the Pools menu item.",
      })}
    />,
    <MenuLink
      key="departments"
      href={departmentTablePath()}
      text={intl.formatMessage({
        defaultMessage: "Departments",
        description: "Label displayed on the Departments menu item.",
      })}
    />,
  ];

  return (
    <AuthContainer>
      <ClientProvider>
        <Dashboard menuItems={menuItems} contentRoutes={routes} />
        <Toast />
      </ClientProvider>
    </AuthContainer>
  );
};

export default PoolDashboard;
