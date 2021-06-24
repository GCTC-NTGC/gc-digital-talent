import React from "react";
import { Routes } from "universal-router";
import { Link, RouterResult, useLocation } from "../helpers/router";
import { Dashboard, exactMatch, MenuLink } from "./dashboard/Dashboard";

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
          <p>Users Here</p>
          <ul>
            <li>user 1</li>
            <li>user 2</li>
            <li>user 3</li>
            <li>user 4</li>
            <li>user 5</li>
          </ul>
        </div>
      ),
    }),
  },
  {
    path: "/pools",
    action: () => ({
      component: (
        <div>
          <h2>Welcome to my Pool</h2>
          <p>All our pools are the best here.</p>
          <p>
            <Link href="/pools/create" title="">
              Create
            </Link>
          </p>
          <p>
            <Link href="/pools/1/edit" title="">
              Edit 1
            </Link>
          </p>
        </div>
      ),
    }),
  },
  {
    path: "/pools/create",
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
    path: "/pools/:id/edit",
    action: ({ params }) => ({
      component: (
        <div>
          <h2>{`You are now editing Pool ${params.id}`}</h2>
          <p>
            <Link href="/pools" title="">
              Back
            </Link>
          </p>
        </div>
      ),
    }),
  },
];

const menuItems = [
  <MenuLink key="home" href="/" text="Home" isActive={exactMatch} />,
  <MenuLink key="users" href="/users" text="Users" />,
  <MenuLink key="pools" href="/pools" text="Pools" />,
];

export const PoolDashboard: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <Dashboard menuItems={menuItems} contentRoutes={routes} />
    </div>
  );
};

export default PoolDashboard;
