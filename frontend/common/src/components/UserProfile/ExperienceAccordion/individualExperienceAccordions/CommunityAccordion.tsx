import React from "react";
import { useIntl } from "react-intl";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import Accordion from "../../../Accordion";
import { Link } from "../../..";
import { CommunityExperience } from "../../../../api/generated";
import { getLocale } from "../../../../helpers/localize";
import { getDateRange } from "../../../../helpers/dateUtils";
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
        data-h2-background-color="base(dt-gray)"
        data-h2-height="base(1px)"
        data-h2-width="base(100%)"
        data-h2-border="base(none)"
        data-h2-margin="base(x1, 0)"
      />
      <SkillList skills={skills} />
      <hr
        data-h2-background-color="base(dt-gray)"
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
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
};

const CommunityAccordion = ({ editUrl, ...rest }: CommunityAccordionProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { id, endDate, startDate, skills, title, organization } = rest;

  return (
    <Accordion.Item value={id}>
      <Accordion.Trigger
        subtitle={getDateRange({ endDate, startDate, intl, locale })}
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
      </Accordion.Trigger>
      <Accordion.Content>
        <CommunityContent {...rest} />
        {editUrl && (
          <div>
            <hr
              data-h2-background-color="base(dt-gray)"
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
