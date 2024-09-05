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

interface QuestionnaireSectionProps {
  departments: Omit<Department, "departmentNumber">[];
  skills: Skill[];
  isSubmitting: boolean;
}

const QuestionnaireSection = ({
  departments,
  skills,
  isSubmitting,
}: QuestionnaireSectionProps) => {
  const intl = useIntl();
  return (
    <TableOfContents.Section
      id={PAGE_SECTION_ID.QUESTIONNAIRE}
      data-h2-padding-top="base(x2)"
    >
      <Heading
        Icon={ListBulletIcon}
        level="h2"
        size="h3"
        color="tertiary"
        data-h2-font-weight="base(400)"
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
      <Submit data-h2-margin-top="base(x2)" isSubmitting={isSubmitting} />
    </TableOfContents.Section>
  );
};

export default QuestionnaireSection;
