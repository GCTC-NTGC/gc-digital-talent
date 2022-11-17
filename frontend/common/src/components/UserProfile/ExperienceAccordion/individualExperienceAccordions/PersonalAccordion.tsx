import React from "react";
import { useIntl } from "react-intl";
import LightBulbIcon from "@heroicons/react/24/solid/LightBulbIcon";
import Accordion from "../../../Accordion";
import { Link } from "../../..";
import { getLocale } from "../../../../helpers/localize";
import { getDateRange } from "../../../../helpers/dateUtils";
import { PersonalExperience } from "../../../../api/generated";
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

type PersonalAccordionProps = PersonalExperience & {
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
};

const PersonalAccordion = ({ editUrl, ...rest }: PersonalAccordionProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { id, title, startDate, endDate, skills } = rest;

  return (
    <Accordion.Item value={id}>
      <Accordion.Trigger
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
      >
        {title || ""}
      </Accordion.Trigger>
      <Accordion.Content>
        <PersonalContent {...rest} />
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

export default PersonalAccordion;
