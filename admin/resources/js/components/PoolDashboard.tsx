import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import Toast from "@common/components/Toast";
import { getLocale } from "@common/helpers/localize";
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
    path: [homePath(":lang")],
    action: ({ params }) => ({
      component: <div />,
      redirect: poolTablePath(params.lang as string), // TODO: Which page should be treated as the dashboard Landing page?
    }),
  },
  {
    path: userTablePath(":lang"),
    action: ({ params }) => ({
      component: <UserPage lang={params.lang as string} />,
    }),
  },
  {
    path: userCreatePath(":lang"),
    action: () => ({
      component: <CreateUser />,
    }),
  },
  {
    path: userUpdatePath(":id", ":lang"),
    action: ({ params }) => ({
      component: <UpdateUser userId={params.id as string} />,
    }),
  },
  {
    path: classificationTablePath(":lang"),
    action: ({ params }) => ({
      component: <ClassificationPage lang={params.lang as string} />,
    }),
  },
  {
    path: classificationCreatePath(":lang"),
    action: () => ({
      component: <CreateClassification />,
    }),
  },
  {
    path: classificationUpdatePath(":id", ":lang"),
    action: ({ params }) => ({
      component: (
        <UpdateClassification classificationId={params.id as string} />
      ),
    }),
  },
  {
    path: cmoAssetTablePath(":lang"),
    action: ({ params }) => ({
      component: <CmoAssetPage lang={params.lang as string} />,
    }),
  },
  {
    path: cmoAssetCreatePath(":lang"),
    action: () => ({
      component: <CreateCmoAsset />,
    }),
  },
  {
    path: cmoAssetUpdatePath(":id", ":lang"),
    action: ({ params }) => ({
      component: <UpdateCmoAsset cmoAssetId={params.id as string} />,
    }),
  },
  {
    path: operationalRequirementTablePath(":lang"),
    action: ({ params }) => ({
      component: <OperationalRequirementPage lang={params.lang as string} />,
    }),
  },
  {
    path: operationalRequirementCreatePath(":lang"),
    action: () => ({
      component: <CreateOperationalRequirement />,
    }),
  },
  {
    path: operationalRequirementUpdatePath(":id", ":lang"),
    action: ({ params }) => ({
      component: (
        <UpdateOperationalRequirement
          operationalRequirementId={params.id as string}
        />
      ),
    }),
  },
  {
    path: poolCandidateTablePath(":id", ":lang"),
    action: ({ params }) => ({
      component: (
        <PoolCandidatePage
          lang={params.lang as string}
          poolId={params.id as string}
        />
      ),
    }),
  },
  {
    path: poolCandidateCreatePath(":id", ":lang"),
    action: ({ params }) => ({
      component: <CreatePoolCandidate poolId={params.id as string} />,
    }),
  },
  {
    path: poolCandidateUpdatePath(":poolId", ":candidateId", ":lang"),
    action: ({ params }) => ({
      component: (
        <UpdatePoolCandidate poolCandidateId={params.candidateId as string} />
      ),
    }),
  },
  {
    path: poolTablePath(":lang"),
    action: ({ params }) => ({
      component: <PoolPage lang={params.lang as string} />,
    }),
  },
  {
    path: poolCreatePath(":lang"),
    action: () => ({
      component: <CreatePool />,
    }),
  },
  {
    path: poolUpdatePath(":id", ":lang"),
    action: ({ params }) => ({
      component: <UpdatePool poolId={params.id as string} />,
    }),
  },
  {
    path: departmentTablePath(":lang"),
    action: ({ params }) => ({
      component: <DepartmentPage lang={params.lang as string} />,
    }),
  },
  {
    path: departmentCreatePath(":lang"),
    action: () => ({
      component: <CreateDepartment />,
    }),
  },
  {
    path: departmentUpdatePath(":id", ":lang"),
    action: ({ params }) => ({
      component: <UpdateDepartment departmentId={params.id as string} />,
    }),
  },
  {
    path: searchRequestTablePath(":lang"),
    action: ({ params }) => ({
      component: <SearchRequestPage lang={params.lang as string} />,
    }),
  },
  {
    path: searchRequestUpdatePath(":id", ":lang"),
    action: ({ params }) => ({
      component: (
        <SingleSearchRequestPage
          lang={params.lang as string}
          searchRequestId={params.id as string}
        />
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
      href={searchRequestTablePath(getLocale(intl))}
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
      href={userTablePath(getLocale(intl))}
      text={intl.formatMessage({
        defaultMessage: "Users",
        description: "Label displayed on the Users menu item.",
      })}
    />,
    <MenuLink
      key="classifications"
      href={classificationTablePath(getLocale(intl))}
      text={intl.formatMessage({
        defaultMessage: "Classifications",
        description: "Label displayed on the Classifications menu item.",
      })}
    />,
    <MenuLink
      key="cmo-assets"
      href={cmoAssetTablePath(getLocale(intl))}
      text={intl.formatMessage({
        defaultMessage: "CMO Assets",
        description: "Label displayed on the CMO Assets menu item.",
      })}
    />,
    <MenuLink
      key="operational-requirements"
      href={operationalRequirementTablePath(getLocale(intl))}
      text={intl.formatMessage({
        defaultMessage: "Operational Requirements",
        description:
          "Label displayed on the Operational Requirements menu item.",
      })}
    />,
    <MenuLink
      key="pools"
      href={poolTablePath(getLocale(intl))}
      text={intl.formatMessage({
        defaultMessage: "Pools",
        description: "Label displayed on the Pools menu item.",
      })}
    />,
    <MenuLink
      key="departments"
      href={departmentTablePath(getLocale(intl))}
      text={intl.formatMessage({
        defaultMessage: "Departments",
        description: "Label displayed on the Departments menu item.",
      })}
    />,
  ];

  console.log(routes);

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
