import React from "react";
import BriefCaseIcon from "@heroicons/react/solid/BriefcaseIcon";
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
        <ul key={index}>
          <li>
            <p data-h2-color="base(dt-primary)">{skill.name?.[locale]}</p>
            <p>{skill.description?.[locale]}</p>
          </li>
        </ul>
      ))
    : "";

  return (
    <Accordion
      title={intl.formatMessage(
        {
          defaultMessage: "{areaOfStudy} at {institution}",
          description: "Study at institution",
        },
        { areaOfStudy, institution },
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
      <div data-h2-padding="base(0, 0, 0, x2)">
        <p>
          {type ? intl.formatMessage(getEducationType(type)) : ""}{" "}
          {status ? intl.formatMessage(getEducationStatus(status)) : ""}
        </p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "{areaOfStudy} at {institution}",
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
                  description: "Thesis, if applicable",
                },
                { thesisTitle },
              )
            : ""}
        </p>
      </div>
      <hr />
      <div data-h2-padding="base(0, 0, 0, x2)">{skillsList}</div>
      <div data-h2-padding="base(0, 0, 0, x2)">
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
        <div data-h2-padding="base(0, 0, 0, x2)">
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

export default EducationAccordion;
