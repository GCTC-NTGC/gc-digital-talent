import React from "react";
import { useIntl } from "react-intl";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";

import SkillTableApi from "./components/SkillTable";

export const IndexSkillPage = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Skills",
    id: "Dbqtm6",
    description: "Heading displayed above the Skill Table component.",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <PageHeader icon={AcademicCapIcon}>{pageTitle}</PageHeader>
      <SkillTableApi />
    </>
  );
};

export default IndexSkillPage;
