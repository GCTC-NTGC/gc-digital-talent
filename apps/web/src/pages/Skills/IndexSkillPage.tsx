import React from "react";
import { useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";

import SkillTableApi from "./components/SkillTable";
import AdminHero from "../../components/Hero/AdminHero";
import { indexSkillPageTitle as pageTitle } from "./navigation";

export const IndexSkillPage = () => {
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
      url: routes.skillTable(),
    },
  ];

  return (
    <>
      <SEO title={formattedPageTitle} />
      <AdminHero
        title={formattedPageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <SkillTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export default IndexSkillPage;
