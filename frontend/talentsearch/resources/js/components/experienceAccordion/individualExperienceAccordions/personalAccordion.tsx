import React from "react";
import { Accordion } from "@common/components/accordion/Accordion";
import BriefCaseIcon from "@heroicons/react/solid/BriefcaseIcon";
import { Button } from "@common/components";
import { Maybe } from "@common/api/generated";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
  Skill,
  ExperienceSkill,
} from "../../../api/generated";

export interface Values {
  title?: Maybe<string>;
  startDate?: Maybe<string>;
  endDate?: Maybe<string>;
  description?: Maybe<string>;
  details?: Maybe<string>;
  experienceSkills: Maybe<ExperienceSkill>[] | null;
}

const PersonalAccordion: React.FunctionComponent<Values> = ({
  title,
  startDate,
  endDate,
  details,
  description,
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

  return (
    <Accordion
      title={title || ""}
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
        <p>{description}</p>
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

export default PersonalAccordion;
