import React from "react";
import { Routes } from "universal-router";
import { createClient } from "urql";
import { Link, RouterResult, useLocation } from "../helpers/router";
import ClientProvider from "./ClientProvider";
import CreateUser from "./CreateUser";
import { Dashboard, exactMatch, MenuLink } from "./dashboard/Dashboard";
import { UpdateUser } from "./UpdateUser";
import UserTableNetworked from "./UserTable";

const routes: Routes<RouterResult> = [
  {
    path: "/dashboard",
    action: () => ({
      component: <p>Welcome Home</p>,
    }),
  },
  {
    path: "/dashboard/users",
    action: () => ({
      component: <UserTableNetworked />,
    }),
  },
  {
    path: "/dashboard/users/create",
    action: () => ({
      component: <CreateUser />,
    }),
  },
  {
    path: "/dashboard/users/:id/edit",
    action: ({ params }) => ({
      component: <UpdateUser userId={params.id as string} />,
    }),
  },
  {
    path: "/dashboard/pools",
    action: () => ({
      component: (
        <div>
          <h2>Welcome to my Pool</h2>
          <p>All our pools are the best here.</p>
          <p>
            <Link href="/dashboard/pools/create" title="">
              Create
            </Link>
          </p>
          <p>
            <Link href="/dashboard/pools/1/edit" title="">
              Edit 1
            </Link>
          </p>
        </div>
      ),
    }),
  },
  {
    path: "/dashboard/pools/create",
    action: () => ({
      component: (
        <div>
          <h2>Here is where you can create a Pool</h2>
          <p>(Create form still pending...)</p>
        </div>
      ),
    }),
  },
  {
    path: "/dashboard/pools/:id/edit",
    action: ({ params }) => ({
      component: (
        <div>
          <h2>{`You are now editing Pool ${params.id}`}</h2>
          <p>
            <Link href="/dashboard/pools" title="">
              Back
            </Link>
          </p>
        </div>
      ),
    }),
  },
];

const menuItems = [
  <MenuLink key="home" href="/dashboard" text="Home" isActive={exactMatch} />,
  <MenuLink key="users" href="/dashboard/users" text="Users" />,
  <MenuLink key="pools" href="/dashboard/pools" text="Pools" />,
];

const client = createClient({
  url: "http://localhost:8000/graphql",
});

export const PoolDashboard: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <ClientProvider client={client}>
        <Dashboard menuItems={menuItems} contentRoutes={routes} />
      </ClientProvider>
    </div>
  );
};

export default PoolDashboard;
