import React from "react";
import { useIntl } from "react-intl";
import ListBulletIcon from "@heroicons/react/24/outline/ListBulletIcon";

import { Heading, Separator, TableOfContents } from "@gc-digital-talent/ui";
import { Submit } from "@gc-digital-talent/forms";
import { Department, Skill } from "@gc-digital-talent/graphql";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import GeneralInformationSection from "./GeneralInformationSection";
import ScopeOfContractSection from "./ScopeOfContractSection";
import RequirementsSection from "./RequirementsSection";
import TechnologicalChangeSection from "./TechnologicalChangeSection";
import OperationsConsiderationsSection from "./OperationsConsiderationsSection";
import TalentSourcingDecisionSection from "./TalentSourcingDecisionSection";

type QuestionnaireSectionProps = {
  departments: Array<Omit<Department, "departmentNumber">>;
  skills: Array<Skill>;
  isSubmitting: boolean;
};

const QuestionnaireSection = ({
  departments,
  skills,
  isSubmitting,
}: QuestionnaireSectionProps) => {
  const intl = useIntl();
  return (
    <TableOfContents.Section id={PAGE_SECTION_ID.QUESTIONNAIRE}>
      <Heading
        Icon={ListBulletIcon}
        level="h2"
        size="h3"
        color="tertiary"
        className="font-normal"
      >
        {intl.formatMessage(getSectionTitle(PAGE_SECTION_ID.QUESTIONNAIRE))}
      </Heading>

      <GeneralInformationSection departments={departments} />
      <ScopeOfContractSection />
      <RequirementsSection skills={skills} />
      <TechnologicalChangeSection />
      <OperationsConsiderationsSection />
      <TalentSourcingDecisionSection />
      <Separator />
      <Submit isSubmitting={isSubmitting} />
    </TableOfContents.Section>
  );
};

export default QuestionnaireSection;
