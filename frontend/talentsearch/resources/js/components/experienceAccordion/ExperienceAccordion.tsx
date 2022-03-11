import React from "react";
import { Accordion } from "@common/components/accordion/Accordion";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
  Skill,
} from "../../api/generated";
import AwardAccordion from "./individualExperienceAccordions/awardAccordion";
import CommunityAccordion from "./individualExperienceAccordions/communityAccordion";
import EducationAccordion from "./individualExperienceAccordions/educationAccordion";
import PersonalAccordion from "./individualExperienceAccordions/personalAccordion";
import WorkAccordion from "./individualExperienceAccordions/workAccordion";

type AnExperience =
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

export interface AccordionProps {
  anExperience: AnExperience;
}
const determineIfAward = (
  anExperience: AnExperience,
): anExperience is AwardExperience => {
  //
  // eslint-disable-next-line no-underscore-dangle
  if (anExperience.__typename === "AwardExperience") {
    return true;
  }
  return false;
};

const determineIfCommunity = (
  anExperience: AnExperience,
): anExperience is CommunityExperience => {
  //
  // eslint-disable-next-line no-underscore-dangle
  if (anExperience.__typename === "CommunityExperience") {
    return true;
  }
  return false;
};

const determineIfEducation = (
  anExperience: AnExperience,
): anExperience is EducationExperience => {
  //
  // eslint-disable-next-line no-underscore-dangle
  if (anExperience.__typename === "EducationExperience") {
    return true;
  }
  return false;
};
const determineIfPersonal = (
  anExperience: AnExperience,
): anExperience is PersonalExperience => {
  //
  // eslint-disable-next-line no-underscore-dangle
  if (anExperience.__typename === "PersonalExperience") {
    return true;
  }
  return false;
};

const determineIfWork = (
  anExperience: AnExperience,
): anExperience is WorkExperience => {
  //
  // eslint-disable-next-line no-underscore-dangle
  if (anExperience.__typename === "WorkExperience") {
    return true;
  }
  return false;
};

const ExperienceAccordion: React.FunctionComponent<AccordionProps> = ({
  anExperience,
}) => {
  // experience type is required with 5 possibilities, build different accordion around which type it is
  let experienceInstance;
  if (determineIfAward(anExperience)) {
    const {
      title,
      awardedDate,
      issuedBy,
      details,
      awardedTo,
      awardedScope,
      experienceSkills = [],
    } = anExperience;

    experienceInstance = AwardAccordion({
      title,
      awardedDate,
      issuedBy,
      details,
      awardedTo,
      awardedScope,
      experienceSkills,
    });
  } else if (determineIfCommunity(anExperience)) {
    const {
      title,
      organization,
      startDate,
      endDate,
      details,
      project,
      experienceSkills = [],
    } = anExperience;

    experienceInstance = CommunityAccordion({
      title,
      organization,
      startDate,
      endDate,
      details,
      project,
      experienceSkills,
    });
  } else if (determineIfEducation(anExperience)) {
    const {
      areaOfStudy,
      institution,
      startDate,
      endDate,
      details,
      type,
      status,
      thesisTitle,
      experienceSkills = [],
    } = anExperience;

    experienceInstance = EducationAccordion({
      areaOfStudy,
      institution,
      startDate,
      endDate,
      details,
      type,
      status,
      thesisTitle,
      experienceSkills,
    });
  } else if (determineIfPersonal(anExperience)) {
    const {
      title,
      startDate,
      endDate,
      details,
      description,
      experienceSkills = [],
    } = anExperience;

    experienceInstance = PersonalAccordion({
      title,
      startDate,
      endDate,
      details,
      description,
      experienceSkills,
    });
  } else if (determineIfWork(anExperience)) {
    const {
      role,
      organization,
      startDate,
      endDate,
      details,
      division,
      experienceSkills = [],
    } = anExperience;

    experienceInstance = WorkAccordion({
      role,
      organization,
      startDate,
      endDate,
      details,
      division,
      experienceSkills,
    });
  } else {
    // not one of the 5 experience types
    experienceInstance = <Accordion title="Unknown experience" />;
  }

  return <div>{experienceInstance}</div>;
};

export default ExperienceAccordion;
