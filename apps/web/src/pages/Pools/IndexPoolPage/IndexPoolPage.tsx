import React from "react";
import { useIntl } from "react-intl";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";
import AdminHero from "~/components/Hero/AdminHero";

import PoolTableApi from "./components/PoolTable";

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
    <>
      <SEO title={pageTitle} />
      <AdminHero
        title={pageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <PoolTableApi title={pageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export default PoolPage;
