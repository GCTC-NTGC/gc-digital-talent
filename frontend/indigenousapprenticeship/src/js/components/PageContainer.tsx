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
import INDIGENOUSAPPRENTICESHIP_APP_DIR from "../indigenousApprenticeshipConstants";

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
      data-h2-font-color="b(ia-pink)"
      data-h2-font-weight={
        isActive(href, location.pathname) ? "b(700)" : "b(100)"
      }
    >
      {text}
    </Link>
  );
};

const IndigenousApprenticeshipNotFound: React.FC = () => {
  const intl = useIntl();
  return (
    <NotFound
      headingMessage={intl.formatMessage({
        description: "Heading for the message saying the page was not found.",
        defaultMessage: "Sorry, we can't find the page you were looking for.",
      })}
    >
      <p>
        {intl.formatMessage({
          description: "Detailed message saying the page was not found.",
          defaultMessage:
            "Oops, it looks like you've landed on a page that either doesn't exist or has moved.",
        })}
      </p>
    </NotFound>
  );
};

const IndigenousApprenticeshipNotAuthorized: React.FC = () => {
  const intl = useIntl();
  return (
    <NotAuthorized
      headingMessage={intl.formatMessage({
        description:
          "Heading for the message saying the page to view is not authorized.",
        defaultMessage: "Sorry, you are not authorized to view this page.",
      })}
    >
      <p>
        {intl.formatMessage({
          description:
            "Detailed message saying the page to view is not authorized.",
          defaultMessage:
            "Oops, it looks like you've landed on a page that you are not authorized to view.",
        })}
      </p>
    </NotAuthorized>
  );
};

export const PageContainer: React.FC<{
  menuItems: ReactElement[];
  contentRoutes: Routes<RouterResult>;
}> = ({ menuItems, contentRoutes }) => {
  const intl = useIntl();

  // stabilize components that will not change during life of app, avoid render loops in router
  const notFoundComponent = useRef(<IndigenousApprenticeshipNotFound />);
  const notAuthorizedComponent = useRef(
    <IndigenousApprenticeshipNotAuthorized />,
  );
  const content = useRouter(
    contentRoutes,
    notFoundComponent.current,
    notAuthorizedComponent.current,
  );
  return (
    <ScrollToTop>
      <>
        <a href="#main" data-h2-visibility="b(hidden)">
          {intl.formatMessage({
            defaultMessage: "Skip to main content",
            description: "Assistive technology skip link",
          })}
        </a>
        <div
          className="container"
          data-h2-display="b(flex)"
          data-h2-flex-direction="b(column)"
          style={{ height: "100vh", margin: "0" }}
        >
          <div>
            <Header baseUrl={INDIGENOUSAPPRENTICESHIP_APP_DIR} />
            <NavMenu mainItems={menuItems} />
          </div>
          <main id="main">{content}</main>
          <div style={{ marginTop: "auto" }}>
            <Footer baseUrl={INDIGENOUSAPPRENTICESHIP_APP_DIR} />
          </div>
        </div>
      </>
    </ScrollToTop>
  );
};

export default PageContainer;
