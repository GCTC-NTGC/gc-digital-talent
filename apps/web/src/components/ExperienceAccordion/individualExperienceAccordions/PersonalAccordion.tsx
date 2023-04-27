import React from "react";
import { useIntl } from "react-intl";

import { Accordion, HeadingRank, Link } from "@gc-digital-talent/ui";

import { PersonalExperience } from "~/api/generated";
import { getDateRange } from "~/utils/accordionUtils";

import SkillList from "../SkillList";
import { ExperienceAccordionHeader } from "../ExperienceAccordionHeader";

export const PersonalContent = ({
  details,
  description,
  skills,
}: PersonalExperience) => {
  const intl = useIntl();

  return (
    <>
      <p>{description}</p>
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

  return (
    <Accordion.Item value={id}>
      <ExperienceAccordionHeader
        dateRange={getDateRange({ endDate, startDate, intl })}
        headingAs={headingLevel}
        category={intl.formatMessage({
          defaultMessage: "Personal experience",
          id: "wTFUPE",
          description: "Title for personal experience section",
        })}
      >
        <span data-h2-font-weight="base(700)">{title || ""}</span>
      </ExperienceAccordionHeader>
      <Accordion.Content>
        <PersonalContent {...rest} />
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

export default PersonalAccordion;
