import { defineMessage, useIntl } from "react-intl";
import UserCircleOutlineIcon from "@heroicons/react/24/outline/UserCircleIcon";
import UserCircleSolidIcon from "@heroicons/react/24/solid/UserCircleIcon";

import { IconType } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import UserTable from "./components/UserTable";

export const pageTitle = defineMessage({
  defaultMessage: "All users",
  id: "bVQ/rm",
  description: "Title for the index user page",
});
export const subTitle = defineMessage({
  defaultMessage:
    "The following is a list of active users along with some of their details.",
  id: "UvKDXK",
  description: "Descriptive text about the list of users in the admin portal.",
});

export const pageOutlineIcon: IconType = UserCircleOutlineIcon;
export const pageSolidIcon: IconType = UserCircleSolidIcon;

export const IndexUserPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.userTable(),
      },
    ],
    isAdmin: true,
  });

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedSubTitle} />
      <AdminHero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <UserTable title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.RequestResponder,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <IndexUserPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexUserPage";

export default IndexUserPage;
