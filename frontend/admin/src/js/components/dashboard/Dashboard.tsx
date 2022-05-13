import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { useLocation, useRouter, RouterResult } from "@common/helpers/router";
import { Routes } from "universal-router";
import { Button, Link } from "@common/components";
import NotFound from "@common/components/NotFound";
import Header from "@common/components/Header";
import Footer from "@common/components/Footer";
import useIsSmallScreen from "@common/hooks/useIsSmallScreen";
import { SideMenuContentWrapper } from "@common/components/SideMenu";

import { MenuIcon } from "@heroicons/react/outline";
import SideMenu from "../menu/SideMenu";
import { ADMIN_APP_DIR } from "../../adminConstants";

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

interface DashboardProps {
  contentRoutes: Routes<RouterResult>;
}

const Dashboard: React.FC<DashboardProps> = ({ contentRoutes }) => {
  const isSmallScreen = useIsSmallScreen();
  const [isMenuOpen, setMenuOpen] = React.useState(!isSmallScreen);
  const intl = useIntl();
  // stabilize component that will not change during life of app, avoid render loops in router
  const notFoundComponent = useRef(<AdminNotFound />);
  const content = useRouter(contentRoutes, notFoundComponent.current);

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <a href="#main" data-h2-visibility="b(hidden)">
        {intl.formatMessage({
          defaultMessage: "Skip to main content",
          description: "Assistive technology skip link",
        })}
      </a>

      <div data-h2-display="b(flex)" data-h2-align-items="b(stretch)">
        <SideMenu isOpen={isMenuOpen} onToggle={handleMenuToggle} />
        <SideMenuContentWrapper>
          <div
            data-h2-flex-item="b(1of1) m(9of12) l(10of12)"
            data-h2-display="b(flex)"
            data-h2-flex-direction="b(column)"
            data-h2-align-items="b(space-between)"
          >
            <Header baseUrl={ADMIN_APP_DIR} />
            <main id="main">{content}</main>
            <Footer baseUrl={ADMIN_APP_DIR} />
          </div>
        </SideMenuContentWrapper>
      </div>
      <div
        data-h2-visibility="b(visible) m(hidden)"
        data-h2-position="b(fixed)"
        data-h2-location="b(bottom-right, xs)"
        style={{ zIndex: 9998 }}
      >
        <Button
          mode="solid"
          color="secondary"
          data-h2-display="b(inline-flex)"
          data-h2-align-items="b(center)"
          data-h2-shadow="b(s)"
          onClick={handleMenuToggle}
        >
          <MenuIcon
            style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }}
          />
          <span>
            {intl.formatMessage({
              defaultMessage: "Open Menu",
              description: "Text label for header button that opens side menu.",
            })}
          </span>
        </Button>
      </div>
    </>
  );
};

export default Dashboard;
