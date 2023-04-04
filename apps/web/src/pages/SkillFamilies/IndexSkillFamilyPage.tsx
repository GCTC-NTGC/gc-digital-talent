import React from "react";
import { useIntl } from "react-intl";
import { UserGroupIcon } from "@heroicons/react/24/outline";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";

import SkillFamilyTableApi from "./components/SkillFamilyTable";

const IndexSkillFamilyPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Skill families",
    id: "hUIqiV",
    description: "Page title for the skill family index page",
  });

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
      label: intl.formatMessage({
        defaultMessage: "Skill families",
        id: "yeXUjo",
        description: "Breadcrumb title for the skill families page link.",
      }),
      url: routes.skillFamilyTable(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={UserGroupIcon}>{pageTitle}</PageHeader>
      <SkillFamilyTableApi />
    </AdminContentWrapper>
  );
};

export default IndexSkillFamilyPage;
