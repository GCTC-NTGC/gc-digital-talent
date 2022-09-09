import React, { ReactElement, useRef } from "react";
import { Routes } from "universal-router";
import { useIntl } from "react-intl";
import NavMenu from "@common/components/NavMenu";
import { Link } from "@common/components";
import NotFound from "@common/components/NotFound";
import {
  RouterResult,
  useLocation,
  useRouter,
  ScrollToTop,
} from "@common/helpers/router";
import Header from "@common/components/Header";
import Footer from "@common/components/Footer";
import NotAuthorized from "@common/components/NotAuthorized";
import TALENTSEARCH_APP_DIR from "../talentSearchConstants";
import { useApplicantProfileRoutes } from "../applicantProfileRoutes";

export const exactMatch = (ref: string | null, test: string): boolean =>
  ref === test;

interface MenuLinkProps {
  href?: string;
  text: string;
  title?: string;
  as?: "a" | "button" | typeof Link;
  isActive?: (href: string | null, path: string) => boolean;
  onClick?: () => void;
}

export const MenuLink: React.FC<MenuLinkProps> = ({
  href,
  text,
  title,
  as = Link,
  isActive = exactMatch,
  ...rest
}) => {
  const location = useLocation();
  const El = as;
  const activeWeight: Record<string, unknown> = isActive(
    href ?? null,
    location.pathname,
  )
    ? { "data-h2-font-weight": "base(700)" }
    : { "data-h2-font-weight": "base(100)" };
  return (
    <El
      href={href}
      title={title ?? undefined}
      data-h2-color="base(dt-primary)"
      data-h2-font-size="base(normal)"
      style={{
        border: "none",
        background: "none",
        textDecoration: "underline",
      }}
      {...rest}
    >
      <span {...activeWeight}>{text}</span>
    </El>
  );
};

const TalentSearchNotFound: React.FC = () => {
  const intl = useIntl();
  return (
    <NotFound
      headingMessage={intl.formatMessage({
        description: "Heading for the message saying the page was not found.",
        defaultMessage: "Sorry, we can't find the page you were looking for.",
        id: "pBJzgi",
      })}
    >
      <p>
        {intl.formatMessage({
          description: "Detailed message saying the page was not found.",
          defaultMessage:
            "Oops, it looks like you've landed on a page that either doesn't exist or has moved.",
          id: "pgHTkX",
        })}
      </p>
    </NotFound>
  );
};

const TalentSearchNotAuthorized: React.FC = () => {
  const intl = useIntl();
  return (
    <NotAuthorized
      headingMessage={intl.formatMessage({
        description:
          "Heading for the message saying the page to view is not authorized.",
        defaultMessage: "Sorry, you are not authorized to view this page.",
        id: "jPLaDk",
      })}
    >
      <p>
        {intl.formatMessage({
          description:
            "Detailed message saying the page to view is not authorized.",
          defaultMessage:
            "Oops, it looks like you've landed on a page that you are not authorized to view.",
          id: "gKyog2",
        })}
      </p>
    </NotAuthorized>
  );
};

export const PageContainer: React.FC<{
  menuItems: ReactElement[];
  authLinks: ReactElement[];
  contentRoutes: Routes<RouterResult>;
}> = ({ menuItems, contentRoutes, authLinks }) => {
  const intl = useIntl();
  const paths = useApplicantProfileRoutes();
  // stabilize components that will not change during life of app, avoid render loops in router
  const notFoundComponent = useRef(<TalentSearchNotFound />);
  const notAuthorizedComponent = useRef(<TalentSearchNotAuthorized />);
  const content = useRouter(
    contentRoutes,
    notFoundComponent.current,
    notAuthorizedComponent.current,
    paths.createAccount(),
  );
  return (
    <ScrollToTop>
      <>
        <a
          href="#main"
          data-h2-visibility="base(invisible) base:focus-visible(visible)"
        >
          {intl.formatMessage({
            defaultMessage: "Skip to main content",
            id: "Srs7a4",
            description: "Assistive technology skip link",
          })}
        </a>
        <div
          className="container"
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-height="base(100vh)"
          data-h2-margin="base(0)"
        >
          <div>
            <Header baseUrl={TALENTSEARCH_APP_DIR} />
            <NavMenu mainItems={menuItems} utilityItems={authLinks} />
          </div>
          <main id="main">{content}</main>
          <div style={{ marginTop: "auto" }}>
            <Footer baseUrl={TALENTSEARCH_APP_DIR} />
          </div>
        </div>
      </>
    </ScrollToTop>
  );
};

export default PageContainer;
