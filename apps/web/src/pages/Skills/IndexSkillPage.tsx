import React from "react";
import { useIntl } from "react-intl";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";

import SkillTableApi from "./components/SkillTable";

export const IndexSkillPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Skills",
    id: "Dbqtm6",
    description: "Heading displayed above the Skill Table component.",
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
        defaultMessage: "Skills",
        id: "ynjzua",
        description: "Breadcrumb title for the skills page link.",
      }),
      url: routes.skillTable(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={AcademicCapIcon}>{pageTitle}</PageHeader>
      <SkillTableApi />
    </AdminContentWrapper>
  );
};

export default IndexSkillPage;
