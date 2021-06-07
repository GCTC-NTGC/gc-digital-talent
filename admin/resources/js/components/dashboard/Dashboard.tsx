import React, { ReactElement, useMemo } from "react";
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

interface MenuLinkProps {
  href: string;
  text: string;
  title?: string;
  isActive?: (href: string, path: string) => boolean;
}

export const MenuLink: React.FC<MenuLinkProps> = ({
  href,
  text,
  title,
  isActive = startsWith,
}) => {
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

export const Dashboard: React.FC<{
  menuItems: ReactElement[];
  contentRoutes: Routes<RouterResult>;
}> = ({ menuItems, contentRoutes }) => {
  const content = useRouter(contentRoutes);
  return (
    <div>
      <SideMenu items={menuItems} />
      <div>{content}</div>
    </div>
  );
};

interface CrudDashboardProps {
  resources: {
    title: string;
    href: string;
    mainView: () => React.ReactElement;
    createView?: () => React.ReactElement;
    editView?: (id: string) => React.ReactElement;
    menuIsActive?: MenuLinkProps["isActive"];
  }[];
}

export const CrudDashboard: React.FC<CrudDashboardProps> = ({ resources }) => {
  const menuItems = useMemo(
    () =>
      resources.map(({ title, href, menuIsActive }) => {
        return (
          <MenuLink
            key={href}
            href={href}
            text={title}
            isActive={menuIsActive}
          />
        );
      }),
    [resources],
  );
  const content: Routes<RouterResult> = resources.flatMap((resource) => {
    const paths = [];
    paths.push({
      path: resource.href,
      action: () => ({
        component: resource.mainView(),
      }),
    });
    if (resource.createView) {
      const { createView } = resource;
      paths.push({
        path: `${resource.href}/create`,
        action: () => ({
          component: createView(),
        }),
      });
    }
    if (resource.editView) {
      const { editView } = resource;
      paths.push({
        path: `${resource.href}/:id/edit`,
        action: ({ params }: { params: any }) => ({
          component: editView(params.id),
        }),
      });
    }
    return paths;
  });
  return <Dashboard menuItems={menuItems} contentRoutes={content} />;
};
