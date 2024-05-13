import React from "react";
import { defineMessage, useIntl } from "react-intl";
import UsersOutlineIcon from "@heroicons/react/24/outline/UsersIcon";
import UsersSolidIcon from "@heroicons/react/24/solid/UsersIcon";

import { IconType } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import TeamTableApi from "./components/TeamTable/TeamTable";

export const pageTitle = defineMessage({
  defaultMessage: "Teams",
  id: "Ezh14X",
  description: "Title for the index team page",
});
const subTitle = defineMessage({
  defaultMessage:
    "The following is a table of teams along with their details. You can also create a new team or edit existing ones.",
  id: "i4TGiO",
  description: "Descriptive text about the list of teams in the admin portal.",
});

export const pageOutlineIcon: IconType = UsersOutlineIcon;
export const pageSolidIcon: IconType = UsersSolidIcon;

const IndexTeamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.teamTable(),
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
        <TeamTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.CommunityManager,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <IndexTeamPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexTeamPage";

export default IndexTeamPage;
