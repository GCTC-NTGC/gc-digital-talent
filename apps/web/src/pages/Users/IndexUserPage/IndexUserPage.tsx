import { defineMessage, useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import permissionConstants from "~/constants/permissionConstants";
import Hero from "~/components/Hero";

import UserTable from "./components/UserTable";

export const subTitle = defineMessage({
  defaultMessage:
    "The following is a list of active users along with some of their details.",
  id: "UvKDXK",
  description: "Descriptive text about the list of users in the admin portal.",
});

export const IndexUserPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitles.users);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.userTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedSubTitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        crumbs={navigationCrumbs}
      />
      <AdminContentWrapper table>
        <UserTable title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.viewUsers}>
    <IndexUserPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexUserPage";

export default IndexUserPage;
