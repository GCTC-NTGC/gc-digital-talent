import React from "react";
import { useIntl } from "react-intl";
import UserGroupIcon from "@heroicons/react/solid/UserGroupIcon";
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
        <ul key={index}>
          <li>
            <p data-h2-font-color="b(lightpurple)">{skill.name?.[locale]}</p>
            <p>{skill.description?.[locale]}</p>
            <p>{skill.experienceSkillRecord?.details}</p>
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
      {" "}
      <div data-h2-padding="b(left, l)">
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
      </div>
      <hr />
      <div data-h2-padding="b(left, l)">{skillsList}</div>
      <div data-h2-padding="b(left, l)">
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "Additional information: {details}",
              description: "Additional information if provided",
            },
            { details },
          )}
        </p>
      </div>
      {editUrl && (
        <div data-h2-padding="b(left, l)">
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
