import React from "react";
import BookOpenIcon from "@heroicons/react/24/solid/BookOpenIcon";
import { useIntl } from "react-intl";
import Accordion from "../../../accordion/Accordion";
import { Link } from "../../..";
import { EducationExperience } from "../../../../api/generated";
import {
  getEducationStatus,
  getEducationType,
} from "../../../../constants/localizedConstants";
import { getLocale } from "../../../../helpers/localize";
import { getDateRange } from "../../../../helpers/dateUtils";

type EducationAccordionProps = EducationExperience & {
  editUrl?: string; // A link to edit the experience will only appear if editUrl is defined.
  defaultOpen?: boolean;
};

const EducationAccordion: React.FunctionComponent<EducationAccordionProps> = ({
  areaOfStudy,
  institution,
  startDate,
  endDate,
  details,
  type,
  status,
  thesisTitle,
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
          defaultMessage: "{areaOfStudy} at {institution}",
          id: "UrsGGK",
          description: "Study at institution",
        },
        { areaOfStudy, institution },
      )}
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
      Icon={BookOpenIcon}
      defaultOpen={defaultOpen}
    >
      <p>
        {type ? intl.formatMessage(getEducationType(type)) : ""}{" "}
        {status ? intl.formatMessage(getEducationStatus(status)) : ""}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "{areaOfStudy} at {institution}",
            id: "UrsGGK",
            description: "Study at institution",
          },
          { areaOfStudy, institution },
        )}
      </p>
      <p>
        {thesisTitle
          ? intl.formatMessage(
              {
                defaultMessage: "Thesis: {thesisTitle}",
                id: "omDlZN",
                description: "Thesis, if applicable",
              },
              { thesisTitle },
            )
          : ""}
      </p>
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
            id: "OvJwG6",
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
              id: "phbDSx",
              description: "Edit Experience button label",
            })}
          </Link>
        </div>
      )}
    </Accordion>
  );
};

export default EducationAccordion;
