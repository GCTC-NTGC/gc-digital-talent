import * as React from "react";
import { getLocale } from "@common/helpers/localize";
import Accordion from "@common/components/accordion";
import { useIntl } from "react-intl";
import {
  Skill,
  Experience,
  PersonalExperience,
  WorkExperience,
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  Maybe,
} from "../../../api/generated";
import exp from "constants";
import { isEducationExperience, isPersonalExperience } from "../../ExperienceAccordion/AnyExperience";


export interface SkillAccordionProps {
  skill: Skill;
}

const SkillAccordion: React.FunctionComponent<SkillAccordionProps> = ({
  skill,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const { name, experienceSkills } = skill;

  let experiences:Maybe<Array<Maybe<Experience>>>;

  experiences = experienceSkills?.map((item => item?.experience));

  const getPersonalExperience = (experience: PersonalExperience) => {
    const {
      title,
      description,
      startDate,
      endDate,
      details,
    } = experience;
    return (
      <div>
        <p> {title} </p>
        <p>
          {" "}
          {startDate} - {endDate} {" "}
        </p>
        <p> {description} </p>
        <p> {details} </p>
      </div>
    );
  };

  const getEducationExperience = (experience: EducationExperience) => {
    const {
      type,
      thesisTitle,
      startDate,
      endDate,
      details,
      status,
      areaOfStudy,
      institution,
    } = experience;
    return (
      <div>
        <p> {areaOfStudy} at {institution}</p>
        <p> {type} {" "} {status} </p>
        <p> Thesis: {thesisTitle} </p>
        <p> {startDate} - {endDate} {" "} </p>
        <p> {details} </p>
      </div>
    );
  };


  return (
    <Accordion
      title={`${name[locale]}`}
      context={
        experiences?.length === 1
          ? `1 Experience`
          : `${experiences?.length} Experiences`
      }
    >
      <div data-h2-padding="b(left, l)">
        { experiences?.map((experience, index) => (
        <ul>
          <li>
            <p>
              { isPersonalExperience(experience!) ? getPersonalExperience(experience!) : ""   }
              { isEducationExperience(experience!) ? getEducationExperience(experience!) : ""   }
          </p>
        </li>
        </ul>
        )) }
      </div>
      <div data-h2-padding="b(left, l)" />
    </Accordion>
  );
};

export default SkillAccordion;
