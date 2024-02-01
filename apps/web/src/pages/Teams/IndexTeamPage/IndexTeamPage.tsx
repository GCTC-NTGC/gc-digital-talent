import React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import UsersOutlineIcon from "@heroicons/react/24/outline/UsersIcon";
import UsersSolidIcon from "@heroicons/react/24/solid/UsersIcon";

import { IconType } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";

import TeamTableApi from "./components/TeamTable/TeamTable";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Teams",
  id: "Ezh14X",
  description: "Title for the index team page",
});
export const pageOutlineIcon: IconType = UsersOutlineIcon;
export const pageSolidIcon: IconType = UsersSolidIcon;

const IndexTeamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: formattedPageTitle,
      url: routes.teamTable(),
    },
  ];

  return (
    <>
      <SEO title={formattedPageTitle} />
      <AdminHero
        title={formattedPageTitle}
        subtitle={intl.formatMessage({
          defaultMessage:
            "The following is a table of teams along with their details. You can also create a new team or edit existing ones.",
          id: "i4TGiO",
          description:
            "Descriptive text about the list of teams in the admin portal.",
        })}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <TeamTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export default IndexTeamPage;
