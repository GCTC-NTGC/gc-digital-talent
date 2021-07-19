import React from "react";
import { Routes } from "universal-router";
import { Link, RouterResult, useLocation } from "../helpers/router";
import { ClassificationTableApi } from "./ClassificationTable";
import ClientProvider from "./ClientProvider";
import { CreateCmoAsset } from "./cmoAssets/CreateCmoAsset";
import { UpdateCmoAsset } from "./cmoAssets/UpdateCmoAsset";
import { CmoAssetTableApi } from "./CmoAssetTable";
import { CreateUser } from "./CreateUser";
import { Dashboard, exactMatch, MenuLink } from "./dashboard/Dashboard";
import ErrorContainer from "./ErrorContainer";
import IntlContainer from "./IntlContainer";
import { CreateOperationalRequirement } from "./operationalRequirements/CreateOperationalRequirement";
import { UpdateOperationalRequirement } from "./operationalRequirements/UpdateOperationalRequirement";
import { OperationalRequirementTableApi } from "./OperationalRequirementTable";
import { CreatePoolCandidate } from "./poolCandidate/CreatePoolCandidate";
import { PoolCandidatesTableApi } from "./poolCandidate/PoolCandidatesTable";
import { UpdatePoolCandidate } from "./poolCandidate/UpdatePoolCandidate";
import { UpdateUser } from "./UpdateUser";
import { UserTableApi } from "./UserTable";

const routes: Routes<RouterResult> = [
  {
    path: "/",
    action: () => ({
      component: <p>Welcome Home</p>,
    }),
  },
  {
    path: "/users",
    action: () => ({
      component: (
        <div>
          <Link href="/users/create" title="">
            Create User
          </Link>
          <UserTableApi />
        </div>
      ),
    }),
  },
  {
    path: "/users/create",
    action: () => ({
      component: <CreateUser />,
    }),
  },
  {
    path: "/users/:id/edit",
    action: ({ params }) => ({
      component: <UpdateUser userId={params.id as string} />,
    }),
  },
  {
    path: "/classifications",
    action: () => ({
      component: <ClassificationTableApi />,
    }),
  },
  {
    path: "/cmo-assets",
    action: () => ({
      component: (
        <div>
          <Link href="/cmo-assets/create" title="">
            Create CMO Asset
          </Link>
          <CmoAssetTableApi />
        </div>
      ),
    }),
  },
  {
    path: "/cmo-assets/create",
    action: () => ({
      component: <CreateCmoAsset />,
    }),
  },
  {
    path: "/cmo-assets/:id/edit",
    action: ({ params }) => ({
      component: <UpdateCmoAsset cmoAssetId={params.id as string} />,
    }),
  },
  {
    path: "/operational-requirements",
    action: () => ({
      component: (
        <div>
          <Link href="/operational-requirements/create" title="">
            Create Operational Requirement
          </Link>
          <OperationalRequirementTableApi />
        </div>
      ),
    }),
  },
  {
    path: "/operational-requirements/create",
    action: () => ({
      component: <CreateOperationalRequirement />,
    }),
  },
  {
    path: "/operational-requirements/:id/edit",
    action: ({ params }) => ({
      component: (
        <UpdateOperationalRequirement
          operationalRequirementId={params.id as string}
        />
      ),
    }),
  },
  // TODO: Finish and add pool candidate table api component
  {
    path: "/pool-candidates",
    action: () => ({
      component: (
        <div>
          <Link href="/pool-candidates/create" title="">
            Create Pool Candidate
          </Link>
          <PoolCandidatesTableApi />
        </div>
      ),
    }),
  },
  {
    path: "/pool-candidates/create",
    action: () => ({
      component: <CreatePoolCandidate />,
    }),
  },
  {
    path: "/pool-candidates/:id/edit",
    action: ({ params }) => ({
      component: <UpdatePoolCandidate poolCandidateId={params.id as string} />,
    }),
  },
];

const menuItems = [
  <MenuLink key="home" href="" text="Home" isActive={exactMatch} />,
  <MenuLink key="users" href="/users" text="Users" />,
  <MenuLink
    key="classifications"
    href="/classifications"
    text="Classifications"
  />,
  <MenuLink key="cmo-assets" href="/cmo-assets" text="CMO Assets" />,
  <MenuLink
    key="operational-requirements"
    href="/operational-requirements"
    text="Operational Requirements"
  />,
  <MenuLink
    key="pool-candidates"
    href="/pool-candidates"
    text="Pool Candidates"
  />,
];

export const PoolDashboard: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <IntlContainer locale="en">
        <ErrorContainer>
          <ClientProvider>
            <Dashboard menuItems={menuItems} contentRoutes={routes} />
          </ClientProvider>
        </ErrorContainer>
      </IntlContainer>
    </div>
  );
};

export default PoolDashboard;
