import React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import PaperAirplaneOutlineIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";
import PaperAirplaneSolidIcon from "@heroicons/react/24/solid/PaperAirplaneIcon";

import { IconType } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import SearchRequestTable from "~/components/SearchRequestTable/SearchRequestTable";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Talent requests",
  id: "3NW70Q",
  description: "Title for the index search request page",
});
export const pageOutlineIcon: IconType = PaperAirplaneOutlineIcon;
export const pageSolidIcon: IconType = PaperAirplaneSolidIcon;

export const IndexSearchRequestPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.searchRequestTable(),
      },
    ],
    isAdmin: true,
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <AdminHero
        title={formattedPageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <SearchRequestTable title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.RequestResponder]}>
    <IndexSearchRequestPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexSearchRequestPage";

export default IndexSearchRequestPage;
