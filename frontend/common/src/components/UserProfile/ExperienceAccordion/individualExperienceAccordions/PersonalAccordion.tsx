import React from "react";
import { useIntl } from "react-intl";
import LightBulbIcon from "@heroicons/react/24/solid/LightBulbIcon";
import LineBreaks from "@common/components/LineBreaks/LineBreaks";
import Accordion from "../../../accordion/Accordion";
import { Link } from "../../..";
import { getLocale } from "../../../../helpers/localize";
import { getDateRange } from "../../../../helpers/dateUtils";
import { PersonalExperience } from "../../../../api/generated";

type PersonalAccordionProps = PersonalExperience & {
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
  defaultOpen?: boolean;
};

const PersonalAccordion: React.FunctionComponent<PersonalAccordionProps> = ({
  title,
  startDate,
  endDate,
  details,
  description,
  skills,
  editUrl,
  defaultOpen = false,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

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
              <LineBreaks>
                <p data-h2-margin="base(0, 0, x.25, 0)">
                  {skill.description[locale]}
                </p>
              </LineBreaks>
            )}
            {skill.experienceSkillRecord &&
              skill.experienceSkillRecord.details && (
                <LineBreaks>
                  <p>{skill.experienceSkillRecord.details}</p>
                </LineBreaks>
              )}
          </li>
        </ul>
      ))
    : "";

  return (
    <Accordion
      title={title || ""}
      subtitle={getDateRange({ endDate, startDate, intl, locale })}
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
      defaultOpen={defaultOpen}
    >
      <p>{description}</p>
      <hr
        data-h2-background-color="base(dt-gray)"
        data-h2-height="base(1px)"
        data-h2-width="base(100%)"
        data-h2-border="base(none)"
        data-h2-margin="base(x1, 0)"
      />
      {skillsList?.length > 0 ? (
        skillsList
      ) : (
        <p>
          {intl.formatMessage({
            defaultMessage:
              "No skills have been linked to this experience yet.",
            id: "c4r/Zv",
            description:
              "A message explaining that the experience has no associated skills",
          })}
        </p>
      )}
      <hr
        data-h2-background-color="base(dt-gray)"
        data-h2-height="base(1px)"
        data-h2-width="base(100%)"
        data-h2-border="base(none)"
        data-h2-margin="base(x1, 0)"
      />
      <p
        data-h2-color="base(dt-primary)"
        data-h2-font-weight="base(700)"
        data-h2-margin="base(x1, 0, x.25, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "Additional information:",
          id: "gLioY2",
          description: "Additional information if provided",
        })}
      </p>
      <LineBreaks>
        <p>{details}</p>
      </LineBreaks>
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
    </Accordion>
  );
};

export default PersonalAccordion;
