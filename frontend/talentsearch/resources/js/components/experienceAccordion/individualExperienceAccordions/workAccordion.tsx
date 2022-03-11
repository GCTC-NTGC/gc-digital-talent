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
  division: Maybe<string>;
  organization?: Maybe<string>;
  startDate?: Maybe<string>;
  endDate?: Maybe<string>;
  details?: Maybe<string>;
  role?: Maybe<string>;
  experienceSkills: Maybe<ExperienceSkill>[] | null;
}

const WorkAccordion: React.FunctionComponent<Values> = ({
  role,
  organization,
  startDate,
  endDate,
  details,
  division,
  experienceSkills,
}) => {
  // create unordered list element of skills DOM Element
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
      title={`${role || ""} at ${organization || ""}`}
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
          {role} at {division}
        </p>
        <p>{organization}</p>
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

export default WorkAccordion;
