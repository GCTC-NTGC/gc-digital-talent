import React from "react";
import { useIntl } from "react-intl";

import { Accordion, HeadingRank, Link } from "@gc-digital-talent/ui";
import { getEducationStatus, getEducationType } from "@gc-digital-talent/i18n";

import { EducationExperience } from "~/api/generated";
import { getDateRange } from "~/utils/accordionUtils";

import SkillList from "../SkillList";
import { ExperienceAccordionHeader } from "../ExperienceAccordionHeader";

export const EducationContent = ({
  areaOfStudy,
  institution,
  details,
  type,
  status,
  thesisTitle,
  skills,
}: EducationExperience) => {
  const intl = useIntl();

  return (
    <>
      <p>
        {type ? intl.formatMessage(getEducationType(type)) : ""}{" "}
        {status ? intl.formatMessage(getEducationStatus(status)) : ""}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "{areaOfStudy} at {institution}",
            id: "UrsGGK",
            description: "Study at institution",
          },
          { areaOfStudy, institution },
        )}
      </p>
      <p>
        {thesisTitle
          ? intl.formatMessage(
              {
                defaultMessage: "Thesis: {thesisTitle}",
                id: "omDlZN",
                description: "Thesis, if applicable",
              },
              { thesisTitle },
            )
          : ""}
      </p>
      <hr
        data-h2-background-color="base(gray.lighter)"
        data-h2-height="base(1px)"
        data-h2-width="base(100%)"
        data-h2-border="base(none)"
        data-h2-margin="base(x1, 0)"
      />
      <SkillList skills={skills} />
      <hr
        data-h2-background-color="base(gray.lighter)"
        data-h2-height="base(1px)"
        data-h2-width="base(100%)"
        data-h2-border="base(none)"
        data-h2-margin="base(x1, 0)"
      />
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "Additional information: {details}",
            id: "OvJwG6",
            description: "Additional information if provided",
          },
          { details },
        )}
      </p>
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

  return (
    <Accordion.Item value={id}>
      <ExperienceAccordionHeader
        dateRange={getDateRange({ endDate, startDate, intl })}
        headingAs={headingLevel}
        category={intl.formatMessage({
          defaultMessage: "Education experience",
          id: "u6LIbY",
          description: "Title for education experience section",
        })}
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
        <EducationContent {...rest} />
        {editUrl && (
          <div>
            <hr
              data-h2-background-color="base(gray.lighter)"
              data-h2-height="base(1px)"
              data-h2-width="base(100%)"
              data-h2-border="base(none)"
              data-h2-margin="base(x1, 0)"
            />
            <Link href={editUrl} color="primary" mode="outline" type="button">
              {intl.formatMessage({
                defaultMessage: "Edit Experience",
                id: "phbDSx",
                description: "Edit Experience button label",
              })}
            </Link>
          </div>
        )}
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default EducationAccordion;
