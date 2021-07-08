import React from "react";
import { Routes } from "universal-router";
import { Link, RouterResult, useLocation } from "../helpers/router";
import { ClassificationTableApi } from "./ClassificationTable";
import ClientProvider from "./ClientProvider";
import { CreateUser } from "./CreateUser";
import { Dashboard, exactMatch, MenuLink } from "./dashboard/Dashboard";
import ErrorContainer, { ErrorToast } from "./ErrorContainer";
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
          <UserTableApi />,
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
];

const menuItems = [
  <MenuLink key="home" href="" text="Home" isActive={exactMatch} />,
  <MenuLink key="users" href="/users" text="Users" />,
  <MenuLink
    key="classifications"
    href="/classifications"
    text="Classifications"
  />,
];

export const PoolDashboard: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <ErrorContainer>
        <ErrorToast />
        <ClientProvider>
          <Dashboard menuItems={menuItems} contentRoutes={routes} />
        </ClientProvider>
      </ErrorContainer>
    </div>
  );
};

export default PoolDashboard;
