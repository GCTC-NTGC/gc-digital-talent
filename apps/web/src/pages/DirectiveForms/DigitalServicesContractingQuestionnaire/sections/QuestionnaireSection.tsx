import React from "react";
import { useIntl } from "react-intl";

import ListBulletIcon from "@heroicons/react/24/outline/ListBulletIcon";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import { Submit } from "@gc-digital-talent/forms";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { IdNamePair } from "../types";
import GeneralInformationSection from "./GeneralInformationSection";
import ScopeOfContractSection from "./ScopeOfContractSection";

type QuestionnaireSectionProps = {
  departments: Array<IdNamePair>;
  isSubmitting: boolean;
};

const QuestionnaireSection = ({
  departments,
  isSubmitting,
}: QuestionnaireSectionProps) => {
  const intl = useIntl();
  return (
    <TableOfContents.Section
      id={PAGE_SECTION_ID.QUESTIONNAIRE}
      data-h2-padding-top="base(x2)"
    >
      <Heading Icon={ListBulletIcon} level="h2" color="tertiary">
        {intl.formatMessage(getSectionTitle(PAGE_SECTION_ID.QUESTIONNAIRE))}
      </Heading>

      {/* <GeneralInformationSection departments={departments} /> */}
      <ScopeOfContractSection />

      <TableOfContents.Section
        id={PAGE_SECTION_ID.CONTRACT_REQUIREMENTS}
        data-h2-padding-top="base(x2)"
      >
        <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
          {intl.formatMessage(
            getSectionTitle(PAGE_SECTION_ID.CONTRACT_REQUIREMENTS),
          )}
        </Heading>
        TODO: CONTRACT_REQUIREMENTS
      </TableOfContents.Section>
      <TableOfContents.Section
        id={PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE}
        data-h2-padding-top="base(x2)"
      >
        <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
          {intl.formatMessage(
            getSectionTitle(PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE),
          )}
        </Heading>
        TODO: TECHNOLOGICAL_CHANGE
      </TableOfContents.Section>
      <TableOfContents.Section
        id={PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS}
        data-h2-padding-top="base(x2)"
      >
        <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
          {intl.formatMessage(
            getSectionTitle(PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS),
          )}
        </Heading>
        TODO: OPERATIONS_CONSIDERATIONS
      </TableOfContents.Section>
      <TableOfContents.Section
        id={PAGE_SECTION_ID.TALENT_SOURCING_DECISION}
        data-h2-padding-top="base(x2)"
      >
        <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
          {intl.formatMessage(
            getSectionTitle(PAGE_SECTION_ID.TALENT_SOURCING_DECISION),
          )}
        </Heading>
        TODO: TALENT_SOURCING_DECISION
      </TableOfContents.Section>
      <Submit isSubmitting={isSubmitting} />
    </TableOfContents.Section>
  );
};

export default QuestionnaireSection;
