import React from "react";
import { Accordion } from "@common/components/accordion/Accordion";
import BriefCaseIcon from "@heroicons/react/solid/BriefcaseIcon";
import { Button } from "@common/components";
import { EducationExperience } from "@common/api/generated";
import {
  getEducationStatus,
  getEducationType,
} from "@common/constants/localizedConstants";
import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";
import { getDateRange } from "@common/helpers/dateUtils";

const EducationAccordion: React.FunctionComponent<EducationExperience> = ({
  areaOfStudy,
  institution,
  startDate,
  endDate,
  details,
  type,
  status,
  thesisTitle,
  skills,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const skillsList = skills
    ? skills.map((skill, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ul key={index}>
          <li>
            <p data-h2-font-color="b(lightpurple)">{skill.name?.[locale]}</p>
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
    >
      <div data-h2-padding="b(left, l)">
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
      <div data-h2-padding="b(left, l)">
        <Button color="primary" mode="outline">
          {intl.formatMessage({
            defaultMessage: "Edit Experience",
            description: "Edit Experience button label",
          })}
        </Button>
      </div>
    </Accordion>
  );
};

export default EducationAccordion;
