import React from "react";
import { useIntl } from "react-intl";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";

import { Accordion, HeadingRank, Link } from "@gc-digital-talent/ui";
import { StandardHeader as StandardAccordionHeader } from "@gc-digital-talent/ui/src/components/Accordion/StandardHeader";

import { CommunityExperience } from "~/api/generated";
import { getDateRange } from "~/utils/accordionUtils";

import SkillList from "../SkillList";

export const CommunityContent = ({
  title,
  organization,
  details,
  project,
  skills,
}: CommunityExperience) => {
  const intl = useIntl();

  return (
    <>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "{title} at {organization}",
            id: "vV0SDz",
            description: "Title at organization",
          },
          { title, organization },
        )}
      </p>
      <p>{project}</p>
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

type CommunityAccordionProps = CommunityExperience & {
  headingLevel?: HeadingRank;
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
};

const CommunityAccordion = ({
  editUrl,
  headingLevel = "h2",
  ...rest
}: CommunityAccordionProps) => {
  const intl = useIntl();
  const { id, endDate, startDate, skills, title, organization } = rest;

  return (
    <Accordion.Item value={id}>
      <StandardAccordionHeader
        headingAs={headingLevel}
        subtitle={getDateRange({ endDate, startDate, intl })}
        Icon={UserGroupIcon}
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
      >
        {intl.formatMessage(
          {
            defaultMessage: "{title} at {organization}",
            id: "vV0SDz",
            description: "Title at organization",
          },
          { title, organization },
        )}
      </StandardAccordionHeader>
      <Accordion.Content>
        <CommunityContent {...rest} />
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

export default CommunityAccordion;
