import React from "react";
import { useIntl } from "react-intl";
import LightBulbIcon from "@heroicons/react/24/solid/LightBulbIcon";

import { Accordion, HeadingRank, Link } from "@gc-digital-talent/ui";

import { PersonalExperience } from "~/api/generated";

import { getDateRange } from "../../accordionUtils";
import SkillList from "../SkillList";

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
        data-h2-background-color="base(gray)"
        data-h2-height="base(1px)"
        data-h2-width="base(100%)"
        data-h2-border="base(none)"
        data-h2-margin="base(x1, 0)"
      />
      <SkillList skills={skills} />
      <hr
        data-h2-background-color="base(gray)"
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
  const { id, title, startDate, endDate, skills } = rest;

  return (
    <Accordion.Item value={id}>
      <Accordion.Trigger
        subtitle={getDateRange({ endDate, startDate, intl })}
        headerAs={headingLevel}
        context={
          skills?.length === 1
            ? intl.formatMessage({
                defaultMessage: "1 Skill",
                id: "A2KwTw",
                description: "Pluralization for one skill",
              })
            : intl.formatMessage(
                {
                  defaultMessage: "{skillsLength} Skills",
                  id: "l27ekQ",
                  description: "Pluralization for zero or multiple skills",
                },
                { skillsLength: skills?.length },
              )
        }
        Icon={LightBulbIcon}
      >
        {title || ""}
      </Accordion.Trigger>
      <Accordion.Content>
        <PersonalContent {...rest} />
        {editUrl && (
          <div>
            <hr
              data-h2-background-color="base(gray)"
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
