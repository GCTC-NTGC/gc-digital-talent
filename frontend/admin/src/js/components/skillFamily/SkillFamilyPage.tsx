import React from "react";
import { useIntl } from "react-intl";
import { UserGroupIcon } from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import SEO from "@common/components/SEO/SEO";

import { SkillFamilyTableApi } from "./SkillFamilyTable";
import DashboardContentContainer from "../DashboardContentContainer";

export const SkillFamilyPage: React.FC = () => {
  const intl = useIntl();

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Skill families",
          id: "hUIqiV",
          description: "Page title for the skill family index page",
        })}
      />
      <DashboardContentContainer>
        <PageHeader icon={UserGroupIcon}>
          {intl.formatMessage({
            defaultMessage: "Skill Families",
            id: "w73KdO",
            description:
              "Heading displayed above the Skill Family Table component.",
          })}
        </PageHeader>
        <SkillFamilyTableApi />
      </DashboardContentContainer>
    </>
  );
};

export default SkillFamilyPage;
