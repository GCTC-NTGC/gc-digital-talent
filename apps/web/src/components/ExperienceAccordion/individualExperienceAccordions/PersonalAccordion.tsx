import React from "react";
import { useIntl } from "react-intl";

import { Accordion, HeadingRank, Separator } from "@gc-digital-talent/ui";
import { incrementHeadingRank } from "@gc-digital-talent/ui/src/utils";

import { PersonalExperience } from "~/api/generated";
import { getDateRange } from "~/utils/accordionUtils";

import { ExperienceAccordionHeader } from "../ExperienceAccordionHeader";
import ContentSection from "../ExperienceAccordionContentSection";
import SkillSection from "../SkillSection";

interface PersonalContentProps
  extends Pick<PersonalExperience, "details" | "description" | "skills"> {
  headingLevel?: HeadingRank;
}

export const PersonalContent = ({
  details,
  description,
  skills,
  headingLevel,
}: PersonalContentProps) => {
  const intl = useIntl();

  return (
    <>
      <ContentSection
        title={intl.formatMessage({
          defaultMessage: "Learning description",
          id: "szVmh/",
          description:
            "Label displayed on Personal Experience form for learning description section",
        })}
        headingLevel={headingLevel}
      >
        {description}
      </ContentSection>

      <Separator
        orientation="horizontal"
        decorative
        data-h2-background-color="base(gray.lighter)"
      />

      <ContentSection
        title={intl.formatMessage({
          defaultMessage: "Tasks and responsibilities",
          id: "jDvu8u",
          description: "Heading for the tasks section of the experience form",
        })}
        headingLevel={headingLevel}
      >
        {details}
      </ContentSection>

      {skills?.map((skill) => {
        return (
          <div key={skill.id}>
            <Separator
              orientation="horizontal"
              decorative
              data-h2-background-color="base(gray.lighter)"
            />

            <SkillSection
              name={skill.name}
              record={skill.experienceSkillRecord}
              headingLevel={headingLevel}
            />
          </div>
        );
      })}
    </>
  );
};

type PersonalAccordionProps = PersonalExperience & {
  headingLevel?: HeadingRank;
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
};

const PersonalAccordion = ({
  editUrl,
  headingLevel = "h2",
  ...rest
}: PersonalAccordionProps) => {
  const intl = useIntl();
  const { id, title, startDate, endDate } = rest;
  const contentHeadingLevel = incrementHeadingRank(headingLevel);

  return (
    <Accordion.Item value={id}>
      <ExperienceAccordionHeader
        dateRange={getDateRange({ endDate, startDate, intl })}
        headingAs={headingLevel}
        category={intl.formatMessage({
          defaultMessage: "Personal learning",
          id: "+AUFyC",
          description: "Title for personal learning section",
        })}
        editUrl={editUrl}
      >
        <span data-h2-font-weight="base(700)">{title || ""}</span>
      </ExperienceAccordionHeader>
      <Accordion.Content>
        <PersonalContent headingLevel={contentHeadingLevel} {...rest} />
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default PersonalAccordion;
