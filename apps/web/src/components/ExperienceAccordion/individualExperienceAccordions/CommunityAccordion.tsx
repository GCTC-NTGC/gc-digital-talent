import React from "react";
import { useIntl } from "react-intl";

import { Accordion, HeadingRank, Separator } from "@gc-digital-talent/ui";
import { incrementHeadingRank } from "@gc-digital-talent/ui/src/utils";

import { CommunityExperience } from "~/api/generated";
import { getDateRange } from "~/utils/accordionUtils";

import { ExperienceAccordionHeader } from "../ExperienceAccordionHeader";
import ContentSection from "../ExperienceAccordionContentSection";
import SkillSection from "../SkillSection";

interface CommunityContentProps
  extends Pick<CommunityExperience, "details" | "project" | "skills"> {
  headingLevel?: HeadingRank;
  showSkills?: boolean; // show or hide the skills block
}

export const CommunityContent = ({
  details,
  project,
  skills,
  headingLevel,
  showSkills = true,
}: CommunityContentProps) => {
  const intl = useIntl();

  return (
    <>
      <ContentSection
        title={intl.formatMessage({
          defaultMessage: "Project / product",
          id: "gEBoM0",
          description:
            "Label displayed on Community Experience form for Project / product section",
        })}
        headingLevel={headingLevel}
      >
        {project}
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

type CommunityAccordionProps = CommunityExperience & {
  headingLevel?: HeadingRank;
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
  showSkills?: boolean; // show or hide the skills block
};

const CommunityAccordion = ({
  editUrl,
  headingLevel = "h2",
  showSkills = true,
  ...rest
}: CommunityAccordionProps) => {
  const intl = useIntl();
  const { id, endDate, startDate, title, organization } = rest;
  const contentHeadingLevel = incrementHeadingRank(headingLevel);

  return (
    <Accordion.Item value={id}>
      <ExperienceAccordionHeader
        headingAs={headingLevel}
        dateRange={getDateRange({ endDate, startDate, intl })}
        category={intl.formatMessage({
          defaultMessage: "Community participation",
          id: "Uy5Dg2",
          description: "Title for community experience section",
        })}
        editUrl={editUrl}
      >
        {intl.formatMessage(
          {
            defaultMessage: "<strong>{title}</strong> with {organization}",
            id: "TmWbke",
            description: "Title with organization",
          },
          { title, organization },
        )}
      </ExperienceAccordionHeader>
      <Accordion.Content>
        <CommunityContent
          headingLevel={contentHeadingLevel}
          showSkills={showSkills}
          {...rest}
        />
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default CommunityAccordion;
