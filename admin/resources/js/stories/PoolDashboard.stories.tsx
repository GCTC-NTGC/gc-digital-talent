import React from "react";
import { storiesOf } from "@storybook/react";
import { Routes } from "universal-router";
import { createClient } from "urql";
import { Link, RouterResult } from "../helpers/router";
import {
  Dashboard,
  exactMatch,
  MenuLink,
} from "../components/dashboard/Dashboard";
import { ClassificationTableApi } from "../components/ClassificationTable";
import { CreateCmoAsset } from "../components/cmoAssets/CreateCmoAsset";
import { UpdateCmoAsset } from "../components/cmoAssets/UpdateCmoAsset";
import { CmoAssetTableApi } from "../components/CmoAssetTable";
import { CreateUser } from "../components/CreateUser";
import { CreateOperationalRequirement } from "../components/operationalRequirements/CreateOperationalRequirement";
import { UpdateOperationalRequirement } from "../components/operationalRequirements/UpdateOperationalRequirement";
import { OperationalRequirementTableApi } from "../components/OperationalRequirementTable";
import UpdateUser from "../components/UpdateUser";
import { UserTableApi } from "../components/UserTable";
import ClientProvider from "../components/ClientProvider";

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
];

const client = createClient({
  url: "http://localhost:8000/graphql",
});

storiesOf("Dashboard", module).add("Demo Dashboard", () => (
  <ClientProvider client={client}>
    <Dashboard menuItems={menuItems} contentRoutes={routes} />
  </ClientProvider>
));
