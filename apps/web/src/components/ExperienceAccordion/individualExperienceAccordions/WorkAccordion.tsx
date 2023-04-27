import React from "react";
import { useIntl } from "react-intl";

import { Accordion, HeadingRank, Link } from "@gc-digital-talent/ui";

import { WorkExperience } from "~/api/generated";
import { getDateRange } from "~/utils/accordionUtils";

import SkillList from "../SkillList";
import { ExperienceAccordionHeader } from "../ExperienceAccordionHeader";

export const WorkContent = ({
  role,
  organization,
  details,
  division,
  skills,
}: WorkExperience) => {
  const intl = useIntl();

  return (
    <>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "{role} at {division}",
            id: "6RiVQA",
            description: "Role at division",
          },
          { role, division },
        )}
      </p>
      <p>{organization}</p>
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

type WorkAccordionProps = WorkExperience & {
  headingLevel?: HeadingRank;
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
};

const WorkAccordion = ({
  editUrl,
  headingLevel,
  ...rest
}: WorkAccordionProps) => {
  const intl = useIntl();
  const { id, role, organization, startDate, endDate } = rest;

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
        <WorkContent {...rest} />
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

export default WorkAccordion;
