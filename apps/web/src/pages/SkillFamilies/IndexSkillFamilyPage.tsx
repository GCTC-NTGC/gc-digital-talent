import React from "react";
import { useIntl } from "react-intl";

import AdminHero from "~/components/Hero/AdminHero";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";

import SkillFamilyTableApi from "./components/SkillFamilyTable";
import { indexSkillFamilyPageTitle as pageTitle } from "./navigation";

const IndexSkillFamilyPage = () => {
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
      url: routes.skillFamilyTable(),
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
        <SkillFamilyTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export default IndexSkillFamilyPage;
