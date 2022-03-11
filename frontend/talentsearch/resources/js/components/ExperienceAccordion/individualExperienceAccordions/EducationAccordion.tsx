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

const EducationAccordion: React.FunctionComponent<EducationExperience> = ({
  areaOfStudy,
  institution,
  startDate,
  endDate,
  details,
  type,
  status,
  thesisTitle,
  experienceSkills,
}) => {
  const intl = useIntl();

  const skillsList = experienceSkills
    ? experienceSkills.map((skill, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ul key={index}>
          <li>
            <p>
              {skill?.skill.name.en}
              <br />
              {skill?.details}
            </p>
          </li>
        </ul>
      ))
    : "";

  return (
    <Accordion
      title={`${areaOfStudy || ""} at ${institution || ""}`}
      subtitle={
        endDate
          ? `${startDate || ""} - ${endDate || ""}`
          : `Since: ${startDate || ""}`
      }
      context={
        experienceSkills?.length === 1
          ? `1 Skill`
          : `${experienceSkills?.length} Skills`
      }
      Icon={BriefCaseIcon}
    >
      <div data-h2-padding="b(left, l)">
        <p>
          {type ? intl.formatMessage(getEducationType(type)) : ""}{" "}
          {status ? intl.formatMessage(getEducationStatus(status)) : ""}
        </p>
        <p>
          {areaOfStudy} at {institution}
        </p>
        <p>{thesisTitle ? `Thesis: ${thesisTitle}` : ""}</p>
      </div>
      <hr />
      <div data-h2-padding="b(left, l)">{skillsList}</div>
      <div data-h2-padding="b(left, l)">
        <p>{`Additional information: ${details || "None"}`}</p>
      </div>
      <div data-h2-padding="b(left, l)">
        <Button color="primary" mode="outline">
          Edit Experience
        </Button>
      </div>
    </Accordion>
  );
};

export default EducationAccordion;
