import React from "react";
import { useIntl } from "react-intl";
import TagIcon from "@heroicons/react/24/outline/TagIcon";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";

import adminMessages from "~/messages/adminMessages";
import ClassificationTableApi from "./components/ClassificationTable";

export const IndexClassificationPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const pageTitle = intl.formatMessage(adminMessages.classifications);

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
      label: intl.formatMessage(adminMessages.classifications),
      url: routes.classificationTable(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={TagIcon}>{pageTitle}</PageHeader>
      <ClassificationTableApi title={pageTitle} />
    </AdminContentWrapper>
  );
};

export default IndexClassificationPage;
