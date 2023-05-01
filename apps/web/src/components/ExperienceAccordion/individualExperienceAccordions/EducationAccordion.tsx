import React from "react";
import { useIntl } from "react-intl";

import { Accordion, HeadingRank, Separator } from "@gc-digital-talent/ui";
import { incrementHeadingRank } from "@gc-digital-talent/ui/src/utils";
import {
  commonMessages,
  getEducationStatus,
  getEducationType,
} from "@gc-digital-talent/i18n";

import { EducationExperience } from "~/api/generated";
import { getDateRange } from "~/utils/accordionUtils";

import { ExperienceAccordionHeader } from "../ExperienceAccordionHeader";
import ContentSection from "../ExperienceAccordionContentSection";
import SkillSection from "../SkillSection";

interface EducationContentProps
  extends Pick<
    EducationExperience,
    "areaOfStudy" | "details" | "status" | "thesisTitle" | "skills"
  > {
  headingLevel?: HeadingRank;
}

export const EducationContent = ({
  areaOfStudy,
  details,
  status,
  thesisTitle,
  skills,
  headingLevel,
}: EducationContentProps) => {
  const intl = useIntl();
  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(row)"
        data-h2-justify-content="base(space-between)"
        data-h2-margin-right="base(x1)"
      >
        <ContentSection
          title={intl.formatMessage({
            defaultMessage: "Area of study",
            id: "nzw1ry",
            description:
              "Label displayed on education form for area of study input",
          })}
          headingLevel={headingLevel}
        >
          {areaOfStudy}
        </ContentSection>

        <ContentSection
          title={intl.formatMessage({
            defaultMessage: "Status",
            id: "OQhL7A",
            description: "Label displayed on Education form for status input",
          })}
          headingLevel={headingLevel}
        >
          {intl.formatMessage(
            status ? getEducationStatus(status) : commonMessages.notAvailable,
          )}
        </ContentSection>

        <ContentSection
          title={intl.formatMessage({
            defaultMessage: "Thesis title",
            id: "E9I34y",
            description:
              "Label displayed on education form for thesis title input",
          })}
          headingLevel={headingLevel}
        >
          {thesisTitle}
        </ContentSection>
      </div>

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

type EducationAccordionProps = EducationExperience & {
  headingLevel?: HeadingRank;
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
};

const EducationAccordion = ({
  editUrl,
  headingLevel = "h2",
  ...rest
}: EducationAccordionProps) => {
  const intl = useIntl();
  const { id, areaOfStudy, institution, startDate, endDate } = rest;
  const contentHeadingLevel = incrementHeadingRank(headingLevel);

  return (
    <Accordion.Item value={id}>
      <ExperienceAccordionHeader
        dateRange={getDateRange({ endDate, startDate, intl })}
        headingAs={headingLevel}
        category={intl.formatMessage({
          defaultMessage: "Education and certificates",
          id: "PFoM2I",
          description: "Title for education experience section",
        })}
        editUrl={editUrl}
      >
        {intl.formatMessage(
          {
            defaultMessage: "<strong>{areaOfStudy}</strong> at {institution}",
            id: "yGFdWK",
            description: "Study at institution",
          },
          { areaOfStudy, institution },
        )}
      </ExperienceAccordionHeader>
      <Accordion.Content>
        <EducationContent headingLevel={contentHeadingLevel} {...rest} />
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default EducationAccordion;
