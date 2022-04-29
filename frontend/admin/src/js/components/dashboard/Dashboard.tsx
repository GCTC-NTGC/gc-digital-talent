import React, { ReactElement, useContext, useRef } from "react";
import { useIntl } from "react-intl";
import { useLocation, useRouter, RouterResult } from "@common/helpers/router";
import { getLocale } from "@common/helpers/localize";
import { Routes } from "universal-router";
import { Button, Link } from "@common/components";
import NotFound from "@common/components/NotFound";
import Header from "@common/components/Header";
import Footer from "@common/components/Footer";
import { ADMIN_APP_DIR } from "../../adminConstants";
import { useAdminRoutes } from "../../adminRoutes";
import { useApiRoutes } from "../../apiRoutes";
import { useGetPoolsQuery } from "../../api/generated";
import SideMenu from "../menu/SideMenu";
import { AuthContext } from "../AuthContainer";

export const exactMatch = (ref: string, test: string): boolean => ref === test;
export const startsWith = (ref: string, test: string): boolean =>
  test.startsWith(ref);

export const MenuHeading: React.FC<{ text: string }> = ({ text }) => {
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
    <Link
      href={href}
      title={title ?? ""}
      color="white"
      mode="inline"
      block
      tabIndex={-1}
      type="button"
      {...(isActive(href, location.pathname)
        ? { "data-h2-font-style": "b(reset)" }
        : { "data-h2-font-style": "b(underline)" })}
    >
      <span
        {...(isActive(href, location.pathname)
          ? { "data-h2-font-weight": "b(700)" }
          : { "data-h2-font-weight": "b(200)" })}
      >
        {text}
      </span>
    </Link>
  );
};

const PoolListApi = () => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const [result] = useGetPoolsQuery();
  const { data, fetching, error } = result;
  const items = [];

  if (!fetching && !error) {
    items.push(
      <MenuHeading
        key="pool-candidates"
        text={intl.formatMessage({
          defaultMessage: "Pool Candidates",
          description: "Label displayed on the Pool Candidates menu item.",
        })}
      />,
    );
    data?.pools.map((pool) =>
      items.push(
        <MenuLink
          key={`pools/${pool?.id}/pool-candidates`}
          href={paths.poolCandidateTable(pool?.id ?? "")}
          text={(pool?.name && pool?.name[getLocale(intl)]) ?? ""}
        />,
      ),
    );
  }

  return items;
};

const LoginOrLogout = () => {
  const intl = useIntl();
  const location = useLocation();
  const apiRoutes = useApiRoutes();
  const { loggedIn, logout } = useContext(AuthContext);

  if (loggedIn) {
    return (
      <Button
        color="white"
        mode="inline"
        block
        tabIndex={-1}
        onClick={() => {
          // Display a confirmation dialog before logging the user out
          // At some point we may change this to use a modal
          const message = intl.formatMessage({
            defaultMessage: "Are you sure you want to logout?",
            description: "Label displayed on the Logout confirmation dialog.",
          });

          // eslint-disable-next-line no-restricted-globals, no-alert
          if (confirm(message)) {
            logout();
          }
        }}
      >
        {intl.formatMessage({
          defaultMessage: "Logout",
          description: "Label displayed on the Logout menu item.",
        })}
      </Button>
    );
  }

  return (
    <Button
      color="white"
      mode="inline"
      block
      tabIndex={-1}
      onClick={() => {
        window.location.href = apiRoutes.login(
          location.pathname,
          getLocale(intl),
        );
      }}
    >
      {intl.formatMessage({
        defaultMessage: "Login",
        description: "Label displayed on the Login menu item.",
      })}
    </Button>
  );
};

const AdminNotFound: React.FC = () => {
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

export const Dashboard: React.FC<{
  menuItems: ReactElement[];
  contentRoutes: Routes<RouterResult>;
}> = ({ menuItems, contentRoutes }) => {
  const intl = useIntl();
  // stabilize component that will not change during life of app, avoid render loops in router
  const notFoundComponent = useRef(<AdminNotFound />);
  const content = useRouter(contentRoutes, notFoundComponent.current);
  return (
    <>
      <a href="#main" data-h2-visibility="b(hidden)">
        {intl.formatMessage({
          defaultMessage: "Skip to main content",
          description: "Assistive technology skip link",
        })}
      </a>

      <div className="container">
        <section
          className="dashboard"
          data-h2-flex-grid="b(stretch, contained, flush, none)"
        >
          <div
            data-h2-bg-color="b(lightnavy)"
            data-h2-flex-item="b(1of1) m(1of4) l(1of6)"
          >
            <div
              data-h2-padding="b(right-left, m)"
              data-h2-position="b(static) m(sticky)"
              style={{ top: "0", maxHeight: "100vh", overflow: "auto" }}
            >
              <SideMenu
                items={[...menuItems, ...PoolListApi(), LoginOrLogout()]}
              />
            </div>
          </div>
          <div
            data-h2-flex-item="b(1of1) m(9of12) l(10of12)"
            data-h2-display="b(flex)"
            style={{ flexDirection: "column" }}
          >
            <Header baseUrl={ADMIN_APP_DIR} />
            <main id="main">{content}</main>
            <Footer baseUrl={ADMIN_APP_DIR} />
          </div>
        </section>
      </div>
    </>
  );
};
