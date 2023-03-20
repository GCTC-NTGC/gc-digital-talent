import React from "react";
import { useIntl } from "react-intl";
import { TagIcon } from "@heroicons/react/24/outline";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";

import ClassificationTableApi from "./components/ClassificationTable";

export const IndexClassificationPage: React.FC = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Classifications",
    id: "xJm72U",
    description: "Page title for the classification index page",
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
        defaultMessage: "Classifications",
        id: "kyMlnN",
        description: "Breadcrumb title for the classifications page link.",
      }),
      url: routes.classificationTable(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={TagIcon}>{pageTitle}</PageHeader>
      <ClassificationTableApi />
    </AdminContentWrapper>
  );
};

export default IndexClassificationPage;
