import React from "react";
import { useIntl } from "react-intl";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import SEO from "@common/components/SEO/SEO";

import { SkillTableApi } from "./SkillTable";
import DashboardContentContainer from "../DashboardContentContainer";

export const SkillPage: React.FC = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Skills",
    id: "Dbqtm6",
    description: "Heading displayed above the Skill Table component.",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <DashboardContentContainer>
        <PageHeader icon={AcademicCapIcon}>{pageTitle}</PageHeader>
        <SkillTableApi />
      </DashboardContentContainer>
    </>
  );
};

export default SkillPage;
