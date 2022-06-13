import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { useRouter, RouterResult } from "@common/helpers/router";
import { Routes } from "universal-router";
import { Button } from "@common/components";
import NotFound from "@common/components/NotFound";
import Header from "@common/components/Header";
import Footer from "@common/components/Footer";
import useIsSmallScreen from "@common/hooks/useIsSmallScreen";
import { SideMenuContentWrapper } from "@common/components/SideMenu";

import { MenuIcon } from "@heroicons/react/outline";
import NotAuthorized from "@common/components/NotAuthorized";
import AdminSideMenu from "../menu/AdminSideMenu";
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

const AdminNotAuthorized: React.FC = () => {
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

interface OpenMenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  show: boolean;
}

const OpenMenuButton: React.FC<OpenMenuButtonProps> = ({
  show,
  onClick,
  children,
}) => (
  <div
    data-h2-visibility="b(visible) m(hidden)"
    data-h2-position="b(fixed)"
    data-h2-offset="b(auto, x.25, x.25, auto)"
    style={{ zIndex: 9998, opacity: show ? 1 : 0 }}
  >
    <Button
      mode="solid"
      color="secondary"
      data-h2-display="b(inline-flex)"
      data-h2-align-items="b(center)"
      data-h2-shadow="b(s)"
      onClick={onClick}
    >
      <MenuIcon
        style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }}
      />
      <span>{children}</span>
    </Button>
  </div>
);

interface DashboardProps {
  contentRoutes: Routes<RouterResult>;
}

const Dashboard: React.FC<DashboardProps> = ({ contentRoutes }) => {
  const isSmallScreen = useIsSmallScreen();
  const [isMenuOpen, setMenuOpen] = React.useState(!isSmallScreen);
  const intl = useIntl();
  // stabilize component that will not change during life of app, avoid render loops in router
  const notFoundComponent = useRef(<AdminNotFound />);
  const notAuthorizedComponent = useRef(<AdminNotAuthorized />);
  const content = useRouter(
    contentRoutes,
    notFoundComponent.current,
    notAuthorizedComponent.current,
  );

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleDismiss = () => {
    setMenuOpen(false);
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
        <AdminSideMenu
          isOpen={isMenuOpen}
          onToggle={handleMenuToggle}
          onDismiss={handleDismiss}
        />
        <SideMenuContentWrapper>
          <div
            className="content-inner"
            data-h2-display="b(flex)"
            data-h2-flex-direction="b(column)"
            data-h2-align-items="b(space-between)"
          >
            <Header baseUrl={ADMIN_APP_DIR} />
            <main id="main" data-h2-margin="b(0, 0, 0, auto)">
              {content}
            </main>
            <Footer baseUrl={ADMIN_APP_DIR} />
          </div>
        </SideMenuContentWrapper>
      </div>
      <OpenMenuButton onClick={handleMenuToggle} show={!isMenuOpen}>
        {intl.formatMessage({
          defaultMessage: "Open Menu",
          description: "Text label for header button that opens side menu.",
        })}
      </OpenMenuButton>
    </>
  );
};

export default Dashboard;
