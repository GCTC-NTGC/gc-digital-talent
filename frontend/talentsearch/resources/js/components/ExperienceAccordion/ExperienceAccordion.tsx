// Using graphql __TypeName property for type guard discriminator
/* eslint-disable no-underscore-dangle */
import React from "react";
import { Accordion } from "@common/components/accordion/Accordion";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
} from "../../api/generated";
import AwardAccordion from "./individualExperienceAccordions/AwardAccordion";
import CommunityAccordion from "./individualExperienceAccordions/CommunityAccordion";
import EducationAccordion from "./individualExperienceAccordions/EducationAccordion";
import PersonalAccordion from "./individualExperienceAccordions/PersonalAccordion";
import WorkAccordion from "./individualExperienceAccordions/WorkAccordion";

type AnyExperience =
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

const isAwardExperience = (e: AnyExperience): e is AwardExperience =>
  e.__typename === "AwardExperience";

const isCommunityExperience = (e: AnyExperience): e is CommunityExperience =>
  e.__typename === "CommunityExperience";

const isEducationExperience = (e: AnyExperience): e is EducationExperience =>
  e.__typename === "EducationExperience";

const isPersonalExperience = (e: AnyExperience): e is PersonalExperience =>
  e.__typename === "PersonalExperience";

const isWorkExperience = (e: AnyExperience): e is WorkExperience =>
  e.__typename === "WorkExperience";

export interface AccordionProps {
  experience: AnyExperience;
}

const ExperienceAccordion: React.FunctionComponent<AccordionProps> = ({
  experience,
}) => {
  // experience type is required with 5 possibilities, build different accordion around which type it is

  if (isAwardExperience(experience)) return AwardAccordion(experience);
  if (isCommunityExperience(experience)) return CommunityAccordion(experience);
  if (isEducationExperience(experience)) return EducationAccordion(experience);
  if (isPersonalExperience(experience)) return PersonalAccordion(experience);
  if (isWorkExperience(experience)) return WorkAccordion(experience);

  // not one of the 5 experience types
  return <Accordion title="Unknown experience" />;
};

export default ExperienceAccordion;
