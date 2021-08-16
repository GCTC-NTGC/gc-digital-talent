import React, { ReactElement } from "react";
import { Routes } from "universal-router";
import {
  Link,
  RouterResult,
  useLocation,
  useRouter,
} from "../../helpers/router";
import Footer from "../Footer";
import Button from "../H2Components/Button";
import SideMenu from "../menu/SideMenu";

export const exactMatch = (ref: string, test: string): boolean => ref === test;
export const startsWith = (ref: string, test: string): boolean =>
  test.startsWith(ref);

interface MenuHeadingProps {
  text: string;
}

export const MenuHeading: React.FC<MenuHeadingProps> = ({ text }) => {
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
        <Button color="white" mode="inline" block>
          {text}
        </Button>
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
    <div className="container">
      <section
        className="dashboard"
        data-h2-flex-grid="b(stretch, contained, flush, none)"
      >
        <div
          data-h2-flex-item="b(1of1) m(4of12) l(2of12)"
          style={{
            background: "linear-gradient(90deg, #674C90 0%, #1D2C4C 100%)",
          }}
        >
          <SideMenu items={menuItems} />
        </div>
        <div
          data-h2-flex-item="b(1of1) m(8of12) l(10of12)"
          data-h2-padding="b(all, m)"
        >
          {content}
        </div>
      </section>
      <Footer />
    </div>
  );
};
