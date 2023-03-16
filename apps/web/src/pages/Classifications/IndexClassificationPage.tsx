import React from "react";
import { useIntl } from "react-intl";
import { TagIcon } from "@heroicons/react/24/outline";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";

import ClassificationTableApi from "./components/ClassificationTable";

export const IndexClassificationPage: React.FC = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Classifications",
    id: "xJm72U",
    description: "Page title for the classification index page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <PageHeader icon={TagIcon}>{pageTitle}</PageHeader>
      <ClassificationTableApi />
    </>
  );
};

export default IndexClassificationPage;
