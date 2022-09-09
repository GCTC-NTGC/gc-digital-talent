import React from "react";
import { useIntl } from "react-intl";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import Accordion from "../../../accordion/Accordion";
import { Link } from "../../..";
import { CommunityExperience } from "../../../../api/generated";
import { getLocale } from "../../../../helpers/localize";
import { getDateRange } from "../../../../helpers/dateUtils";

type CommunityAccordionProps = CommunityExperience & {
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
  defaultOpen?: boolean;
};

const CommunityAccordion: React.FunctionComponent<CommunityAccordionProps> = ({
  title,
  organization,
  startDate,
  endDate,
  details,
  project,
  skills,
  editUrl,
  defaultOpen = false,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  // create unordered list element of skills DOM Element
  const skillsList = skills
    ? skills.map((skill, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ul data-h2-padding="base(0, 0, 0, x1)" key={index}>
          <li>
            {skill.name[locale] && (
              <p
                data-h2-color="base(dt-primary)"
                data-h2-font-weight="base(700)"
                data-h2-margin="base(x1, 0, x.25, 0)"
              >
                {skill.name[locale]}
              </p>
            )}
            {skill.description && skill.description[locale] && (
              <p data-h2-margin="base(0, 0, x.25, 0)">
                {skill.description[locale]}
              </p>
            )}
            {skill.experienceSkillRecord &&
              skill.experienceSkillRecord.details && (
                <p>{skill.experienceSkillRecord.details}</p>
              )}
          </li>
        </ul>
      ))
    : "";

  return (
    <Accordion
      title={intl.formatMessage(
        {
          defaultMessage: "{title} at {organization}",
          description: "Title at organization",
        },
        { title, organization },
      )}
      subtitle={getDateRange({ endDate, startDate, intl, locale })}
      context={
        skills?.length === 1
          ? intl.formatMessage({
              defaultMessage: "1 Skill",
              description: "Pluralization for one skill",
            })
          : intl.formatMessage(
              {
                defaultMessage: "{skillsLength} Skills",
                description: "Pluralization for zero or multiple skills",
              },
              { skillsLength: skills?.length },
            )
      }
      Icon={UserGroupIcon}
      defaultOpen={defaultOpen}
    >
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "{title} at {organization}",
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
      {skillsList?.length > 0 ? skillsList : undefined}
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
            description: "Additional information if provided",
          },
          { details },
        )}
      </p>
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
              description: "Edit Experience button label",
            })}
          </Link>
        </div>
      )}
    </Accordion>
  );
};

export default CommunityAccordion;
