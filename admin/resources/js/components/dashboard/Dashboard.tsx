import React from "react";
import { Routes } from "universal-router";
import {
  Link,
  RouterResult,
  useLocation,
  useRouter,
} from "../../helpers/router";
import SideMenu from "../menu/SideMenu";

export const exactMatch = (ref: string, test: string): boolean => ref === test;
export const startsWith = (ref: string, test: string): boolean =>
  test.startsWith(ref);

export const MenuLink: React.FC<{
  href: string;
  text: string;
  title?: string;
  isActive?: (href: string, path: string) => boolean;
}> = ({ href, text, title, isActive = startsWith }) => {
  const location = useLocation();
  return (
    <Link href={href} title={title ?? ""}>
      <div
        data-h2-font-weight={
          isActive(href, location.pathname) ? "b(700)" : "b(100)"
        }
      >
        {text}
      </div>
    </Link>
  );
};

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
    path: "/dashboard/pools",
    action: () => ({
      component: (
        <div>
          <h2>Welcome to my Pool</h2>
          <p>All our pools are the best here.</p>
        </div>
      ),
    }),
  },
];

export const Dashboard: React.FC = () => {
  const location = useLocation();

  const content = useRouter(routes);
  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <SideMenu
        items={[
          <MenuLink
            key="home"
            href="/dashboard"
            text="Home"
            isActive={exactMatch}
          />,
          <MenuLink key="users" href="/dashboard/users" text="Users" />,
          <MenuLink key="pools" href="/dashboard/pools" text="Pools" />,
        ]}
      />
      <div>{content}</div>
    </div>
  );
};
