import React, { ReactElement } from "react";
import { Routes } from "universal-router";
import {
  Link,
  RouterResult,
  useLocation,
  useRouter,
} from "../helpers/router";
import SideMenu from "./menu/SideMenu";

export const startsWith = (ref: string, test: string): boolean =>
  test.startsWith(ref);

export const MenuHeading: React.FC<{text: string}> = ({ text }) => {
  return (
    <span
      data-h2-display="b(block)"
      data-h2-padding="b(top-bottom, xs) b(right-left, s)"
      data-h2-bg-color="b(lightnavy)"
      data-h2-text-align="b(center)"
      data-h2-font-color="b(white)"
      data-h2-font-size="b(caption) m(normal)"
      data-h2-font-weight="b(700)"
      style={{
        overflowWrap: "break-word",
        textTransform: "uppercase",
      }}
    >
      {text}
    </span>
  );
};

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
      <section>
        <div data-h2-padding="b(all, m)">
          <SideMenu items={menuItems} />
        </div>
        <div data-h2-padding="b(all, m)">
          {content}
        </div>
      </section>
  );
};
