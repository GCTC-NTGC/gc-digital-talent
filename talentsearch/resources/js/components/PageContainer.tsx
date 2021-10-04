import React, { ReactElement } from "react";
import { Routes } from "universal-router";
import NavMenu from "@common/components/NavMenu";
import { Link, RouterResult, useLocation, useRouter } from "../helpers/router";
import Footer from "./Footer";
import Header from "./Header";

export const exactMatch = (ref: string, test: string): boolean => ref === test;

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
  isActive = exactMatch,
}) => {
  const location = useLocation();
  return (
    <Link
      href={href}
      title={title ?? ""}
      {...{
        "data-h2-color": "b(lightpurple)",
      }}
    >
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

export const PageContainer: React.FC<{
  menuItems: ReactElement[];
  contentRoutes: Routes<RouterResult>;
}> = ({ menuItems, contentRoutes }) => {
  const content = useRouter(contentRoutes);
  return (
    <>
      <Header />
      <NavMenu items={menuItems} />
      <div>{content}</div>
      <Footer />
    </>
  );
};

export default PageContainer;
