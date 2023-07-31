import React from "react";
import { useIntl } from "react-intl";
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";

import useRoutes from "~/hooks/useRoutes";
import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";

import PoolTable from "./components/PoolTable";

export const PoolPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const pageTitle = intl.formatMessage(adminMessages.pools);

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
      label: intl.formatMessage(adminMessages.pools),
      url: routes.poolTable(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={Squares2X2Icon}>{pageTitle}</PageHeader>
      <PoolTable title={pageTitle} />
    </AdminContentWrapper>
  );
};

export default PoolPage;
