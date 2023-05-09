import React from "react";
import { useIntl } from "react-intl";
import BuildingOffice2Icon from "@heroicons/react/24/outline/BuildingOffice2Icon";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import PageHeader from "~/components/PageHeader/PageHeader";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import adminMessages from "~/messages/adminMessages";
import TeamTableApi from "./components/TeamTable/TeamTable";

const IndexTeamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const pageTitle = intl.formatMessage(adminMessages.teams);

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
      label: intl.formatMessage(adminMessages.teams),
      url: routes.teamTable(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={BuildingOffice2Icon}>{pageTitle}</PageHeader>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "The following is a table of teams along with their details. You can also create a new team or edit existing ones.",
          id: "i4TGiO",
          description:
            "Descriptive text about the list of teams in the admin portal.",
        })}
      </p>
      <TeamTableApi title={pageTitle} />
    </AdminContentWrapper>
  );
};

export default IndexTeamPage;
