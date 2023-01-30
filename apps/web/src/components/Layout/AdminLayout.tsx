import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useIntl } from "react-intl";
import { Bars3Icon } from "@heroicons/react/24/solid";

import SEO from "@common/components/SEO/SEO";
import useIsSmallScreen from "@common/hooks/useIsSmallScreen";
import { Button } from "@common/components";
import Footer from "@common/components/Footer";
import Header from "@common/components/Header";
import SkipLink from "@common/components/Link/SkipLink";
import { SideMenuContentWrapper } from "@common/components/SideMenu";
import useLocalStorage from "@common/hooks/useLocalStorage";

import AdminSideMenu from "../AdminSideMenu/AdminSideMenu";

interface OpenMenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  show: boolean;
}

const OpenMenuButton: React.FC<OpenMenuButtonProps> = ({
  show,
  onClick,
  children,
}) => (
  <div
    data-h2-visually-hidden="base(visible) l-tablet(hidden)"
    data-h2-position="base(fixed)"
    data-h2-location="base(auto, x.25, x.25, auto)"
    style={{ zIndex: 9998, opacity: show ? 1 : 0 }}
  >
    <Button
      mode="solid"
      color="secondary"
      data-h2-display="base(inline-flex)"
      data-h2-align-items="base(center)"
      data-h2-shadow="base(s)"
      onClick={onClick}
    >
      <Bars3Icon
        style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }}
      />
      <span>{children}</span>
    </Button>
  </div>
);

const AdminLayout = () => {
  const intl = useIntl();
  const isSmallScreen = useIsSmallScreen();

  // retain menu preference in storage
  const [isMenuOpen, setMenuOpen] = useLocalStorage(
    "digitaltalent-menustate",
    true,
  );
  React.useEffect(() => {
    if (isSmallScreen) {
      setMenuOpen(false); // collapse menu if window resized to small
    }
  }, [isSmallScreen, setMenuOpen]);

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleDismiss = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Admin",
          id: "wHX/8C",
          description: "Title tag for Admin site",
        })}
        description={intl.formatMessage({
          defaultMessage:
            "Recruit and manage IT employees in the Government of Canada.",
          id: "J8kIar",
          description: "Meta tag description for Admin site",
        })}
      />
      <SkipLink />
      <div data-h2-flex-grid="base(stretch, 0)">
        <AdminSideMenu
          isOpen={isMenuOpen}
          onToggle={handleMenuToggle}
          onDismiss={handleDismiss}
        />
        <SideMenuContentWrapper>
          <div
            data-h2-min-height="base(100%)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
          >
            <Header width="full" />
            <main
              id="main"
              data-h2-flex-grow="base(1)"
              data-h2-background-color="base(dt-gray.15)"
            >
              <div data-h2-min-height="base(100%)">
                <div data-h2-container="base(center, full, x2)">
                  <div data-h2-padding="base(0, 0, x3, 0)">
                    <Outlet />
                  </div>
                </div>
              </div>
            </main>
            <Footer width="full" />
          </div>
        </SideMenuContentWrapper>
      </div>
      <OpenMenuButton onClick={handleMenuToggle} show={!isMenuOpen}>
        {intl.formatMessage({
          defaultMessage: "Open Menu",
          id: "crzWxb",
          description: "Text label for header button that opens side menu.",
        })}
      </OpenMenuButton>
      <ScrollRestoration
        getKey={(location) => {
          return location.pathname;
        }}
      />
    </>
  );
};

export default AdminLayout;
