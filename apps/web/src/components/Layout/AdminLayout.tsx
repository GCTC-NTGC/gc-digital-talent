import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useIntl } from "react-intl";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";

import { useIsSmallScreen } from "@gc-digital-talent/helpers";
import { useLocalStorage } from "@gc-digital-talent/storage";
import { Button, SideMenuContentWrapper } from "@gc-digital-talent/ui";
import { useLocale } from "@gc-digital-talent/i18n";

import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import SEO, { Favicon } from "~/components/SEO/SEO";
import useLayoutTheme from "~/hooks/useLayoutTheme";

import AdminSideMenu from "../AdminSideMenu/AdminSideMenu";
import MaintenanceBanner from "./MaintenanceBanner";
import SkipLink from "./SkipLink";

interface OpenMenuButtonProps extends React.HTMLProps<HTMLButtonElement> {
  show: boolean;
}

const OpenMenuButton = React.forwardRef<
  HTMLButtonElement,
  Omit<OpenMenuButtonProps, "ref">
>(({ children, onClick, show }, ref) =>
  show ? (
    <Button
      ref={ref}
      icon={Bars3Icon}
      onClick={onClick}
      type="button"
      color="secondary"
      data-h2-text-align="base(left)"
      data-h2-radius="base(0)"
      data-h2-align-self="base(flex-start)"
      data-h2-align-items="base(flex-start)"
      data-h2-position="base(sticky)"
      data-h2-top="base(0)"
      data-h2-width="base(100%)"
      data-h2-z-index="base(1)"
    >
      {children}
    </Button>
  ) : null,
);

const AdminLayout = () => {
  const intl = useIntl();
  const { locale } = useLocale();
  const isSmallScreen = useIsSmallScreen();
  useLayoutTheme("admin");

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

  return (
    <>
      <Favicon locale={locale} project="admin" />
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
        <AdminSideMenu isOpen={isMenuOpen} onToggle={setMenuOpen} />
        <SideMenuContentWrapper>
          <div
            data-h2-min-height="base(100%)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
          >
            <Header width="full" />
            <MaintenanceBanner />
            <OpenMenuButton
              onClick={() => setMenuOpen(true)}
              show={isSmallScreen}
            >
              {intl.formatMessage({
                defaultMessage: "Open Menu",
                id: "crzWxb",
                description:
                  "Text label for header button that opens side menu.",
              })}
            </OpenMenuButton>
            <main
              id="main"
              data-h2-flex-grow="base(1)"
              data-h2-background-color="base(background)"
            >
              <div data-h2-min-height="base(100%)">
                <Outlet />
              </div>
            </main>
            <Footer width="full" />
          </div>
        </SideMenuContentWrapper>
      </div>

      <ScrollRestoration
        getKey={(location) => {
          return location.pathname;
        }}
      />
    </>
  );
};

export default AdminLayout;
