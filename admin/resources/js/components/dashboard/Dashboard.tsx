import React, { ReactElement } from "react";
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
    <div
      data-h2-flex-grid="b(stretch, contained, flush, none)"
      style={{
        minHeight: "100vh",
      }}
    >
      <div
        data-h2-flex-item="b(1of1) m(2of12)"
        data-h2-padding="b(all, m)"
        style={{
          background: "linear-gradient(90deg, #674C90 0%, #1D2C4C 100%)",
        }}
      >
        <SideMenu items={menuItems} />
      </div>
      <div data-h2-flex-item="b(1of1) m(10of12)" data-h2-padding="b(all, m)">
        {content}
      </div>
    </div>
  );
};
