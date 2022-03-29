// Using graphql __TypeName property for type guard discriminator
/* eslint-disable no-underscore-dangle */
import React from "react";
import { Accordion } from "@common/components/accordion/Accordion";
import { useIntl } from "react-intl";
import AwardAccordion from "./individualExperienceAccordions/AwardAccordion";
import CommunityAccordion from "./individualExperienceAccordions/CommunityAccordion";
import EducationAccordion from "./individualExperienceAccordions/EducationAccordion";
import PersonalAccordion from "./individualExperienceAccordions/PersonalAccordion";
import WorkAccordion from "./individualExperienceAccordions/WorkAccordion";
import {
  AnyExperience,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "../../types/ExperienceUtils";

export interface AccordionProps {
  experience: AnyExperience;
}

const ExperienceAccordion: React.FunctionComponent<AccordionProps> = ({
  experience,
}) => {
  const intl = useIntl();

  // experience type is required with 5 possibilities, build different accordion around which type it is

  if (isAwardExperience(experience)) return AwardAccordion(experience);
  if (isCommunityExperience(experience)) return CommunityAccordion(experience);
  if (isEducationExperience(experience)) return EducationAccordion(experience);
  if (isPersonalExperience(experience)) return PersonalAccordion(experience);
  if (isWorkExperience(experience)) return WorkAccordion(experience);

  // not one of the 5 experience types
  return (
    <Accordion
      title={intl.formatMessage({
        defaultMessage: "Unknown Experience",
        description: "Title for unknown experiences",
      })}
    />
  );
};

export default ExperienceAccordion;
