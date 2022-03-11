import React from "react";
import { Accordion } from "@common/components/accordion/Accordion";
import BriefCaseIcon from "@heroicons/react/solid/BriefcaseIcon";
import { Button } from "@common/components";
import { EducationExperience } from "@common/api/generated";
import {
  educationTypeMessages,
  educationStatusMessages,
} from "@common/constants/localizedConstants";

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

  // turn enums into localized messages
  let educationTypeLocalized;
  if (type === "BACHELORS_DEGREE") {
    educationTypeLocalized =
      educationTypeMessages.BACHELORS_DEGREE.defaultMessage;
  }
  if (type === "CERTIFICATION") {
    educationTypeLocalized = educationTypeMessages.CERTIFICATION.defaultMessage;
  }
  if (type === "DIPLOMA") {
    educationTypeLocalized = educationTypeMessages.DIPLOMA.defaultMessage;
  }
  if (type === "MASTERS_DEGREE") {
    educationTypeLocalized =
      educationTypeMessages.MASTERS_DEGREE.defaultMessage;
  }
  if (type === "ONLINE_COURSE") {
    educationTypeLocalized = educationTypeMessages.ONLINE_COURSE.defaultMessage;
  }
  if (type === "OTHER") {
    educationTypeLocalized = educationTypeMessages.OTHER.defaultMessage;
  }
  if (type === "PHD") {
    educationTypeLocalized = educationTypeMessages.PHD.defaultMessage;
  }
  if (type === "POST_DOCTORAL_FELLOWSHIP") {
    educationTypeLocalized =
      educationTypeMessages.POST_DOCTORAL_FELLOWSHIP.defaultMessage;
  }

  let educationStatusLocalized;
  if (status === "AUDITED") {
    educationStatusLocalized = educationStatusMessages.AUDITED.defaultMessage;
  }
  if (status === "DID_NOT_COMPLETE") {
    educationStatusLocalized = educationStatusMessages.AUDITED.defaultMessage;
  }
  if (status === "IN_PROGRESS") {
    educationStatusLocalized = educationStatusMessages.AUDITED.defaultMessage;
  }
  if (status === "SUCCESS_CREDENTIAL") {
    educationStatusLocalized = educationStatusMessages.AUDITED.defaultMessage;
  }
  if (status === "SUCCESS_NO_CREDENTIAL") {
    educationStatusLocalized = educationStatusMessages.AUDITED.defaultMessage;
  }

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
          {educationTypeLocalized} {educationStatusLocalized}
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
