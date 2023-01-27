import React from "react";
import { useIntl } from "react-intl";
import { UserGroupIcon } from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import SEO from "@common/components/SEO/SEO";

import SkillFamilyTableApi from "./components/SkillFamilyTable";

const IndexSkillFamilyPage: React.FC = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Skill families",
    id: "hUIqiV",
    description: "Page title for the skill family index page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <PageHeader icon={UserGroupIcon}>{pageTitle}</PageHeader>
      <SkillFamilyTableApi />
    </>
  );
};

export default IndexSkillFamilyPage;
