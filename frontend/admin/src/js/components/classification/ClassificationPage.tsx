import React from "react";
import { useIntl } from "react-intl";
import { TagIcon } from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import SEO from "@common/components/SEO/SEO";

import { ClassificationTableApi } from "./ClassificationTable";
import DashboardContentContainer from "../DashboardContentContainer";

export const ClassificationPage: React.FC = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Classifications",
    id: "xJm72U",
    description: "Page title for the classification index page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <DashboardContentContainer>
        <PageHeader icon={TagIcon}>{pageTitle}</PageHeader>
        <ClassificationTableApi />
      </DashboardContentContainer>
    </>
  );
};

export default ClassificationPage;
