import React from "react";
import { useIntl } from "react-intl";

import AdminHero from "~/components/Hero/AdminHero";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";

import SkillFamilyTableApi from "./components/SkillFamilyTable";

const IndexSkillFamilyPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const pageTitle = intl.formatMessage(adminMessages.skillFamilies);

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
      label: intl.formatMessage(adminMessages.skillFamilies),
      url: routes.skillFamilyTable(),
    },
  ];

  return (
    <>
      <SEO title={pageTitle} />
      <AdminHero
        title={pageTitle}
        nav={{ mode: "subNav", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <SkillFamilyTableApi title={pageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export default IndexSkillFamilyPage;
