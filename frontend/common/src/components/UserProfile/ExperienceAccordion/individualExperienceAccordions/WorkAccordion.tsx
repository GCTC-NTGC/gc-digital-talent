import React from "react";
import BriefCaseIcon from "@heroicons/react/solid/BriefcaseIcon";
import { useIntl } from "react-intl";
import Accordion from "../../../accordion/Accordion";
import { Link } from "../../..";
import { getLocale } from "../../../../helpers/localize";
import { getDateRange } from "../../../../helpers/dateUtils";
import { WorkExperience } from "../../../../api/generated";

type WorkAccordionProps = WorkExperience & {
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
  defaultOpen?: boolean;
};

const WorkAccordion: React.FunctionComponent<WorkAccordionProps> = ({
  role,
  organization,
  startDate,
  endDate,
  details,
  division,
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
          defaultMessage: "{role} at {organization}",
          description: "Role at organization",
        },
        { role, organization },
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
      Icon={BriefCaseIcon}
      defaultOpen={defaultOpen}
    >
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "{role} at {division}",
            description: "Role at division",
          },
          { role, division },
        )}
      </p>
      <p>{organization}</p>
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
        <p>No skills have been linked to this experience yet.</p>
      )}
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

export default WorkAccordion;
