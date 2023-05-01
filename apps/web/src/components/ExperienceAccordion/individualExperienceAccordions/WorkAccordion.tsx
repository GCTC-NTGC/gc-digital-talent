import React from "react";
import { useIntl } from "react-intl";

import { Accordion, HeadingRank, Separator } from "@gc-digital-talent/ui";
import { incrementHeadingRank } from "@gc-digital-talent/ui/src/utils";

import { WorkExperience } from "~/api/generated";
import { getDateRange } from "~/utils/accordionUtils";

import { ExperienceAccordionHeader } from "../ExperienceAccordionHeader";
import ContentSection from "../ExperienceAccordionContentSection";
import SkillSection from "../SkillSection";

interface WorkContentProps
  extends Pick<WorkExperience, "details" | "division" | "skills"> {
  headingLevel?: HeadingRank;
  showSkills?: boolean; // show or hide the skills block
}

export const WorkContent = ({
  details,
  division,
  skills,
  headingLevel,
  showSkills = true,
}: WorkContentProps) => {
  const intl = useIntl();
  return (
    <>
      <ContentSection
        title={intl.formatMessage({
          defaultMessage: "Team, group, or division",
          id: "qn77WI",
          description:
            "Label displayed on Work Experience form for team/group/division input",
        })}
        headingLevel={headingLevel}
      >
        {division}
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

      {showSkills &&
        skills?.map((skill) => {
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

type WorkAccordionProps = WorkExperience & {
  headingLevel?: HeadingRank;
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
  showSkills?: boolean; // show or hide the skills block
};

const WorkAccordion = ({
  editUrl,
  headingLevel = "h2",
  showSkills = true,
  ...rest
}: WorkAccordionProps) => {
  const intl = useIntl();
  const { id, role, organization, startDate, endDate } = rest;
  const contentHeadingLevel = incrementHeadingRank(headingLevel);

  return (
    <Accordion.Item value={id}>
      <ExperienceAccordionHeader
        dateRange={getDateRange({ endDate, startDate, intl })}
        headingAs={headingLevel}
        category={intl.formatMessage({
          defaultMessage: "Work experience",
          id: "giUfys",
          description: "Title for work experience section",
        })}
        editUrl={editUrl}
      >
        {intl.formatMessage(
          {
            defaultMessage: "<strong>{role}</strong> at {organization}",
            id: "JYWwCE",
            description: "Role at organization",
          },
          { role, organization },
        )}
      </ExperienceAccordionHeader>
      <Accordion.Content>
        <WorkContent
          headingLevel={contentHeadingLevel}
          showSkills={showSkills}
          {...rest}
        />
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default WorkAccordion;
