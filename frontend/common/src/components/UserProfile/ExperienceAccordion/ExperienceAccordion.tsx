// Using graphql __TypeName property for type guard discriminator
/* eslint-disable no-underscore-dangle */
import React from "react";
import { useIntl } from "react-intl";
import Accordion from "../../accordion/Accordion";
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
} from "../../../types/ExperienceUtils";

export interface ExperiencePaths {
  awardUrl: (id: string) => string;
  communityUrl: (id: string) => string;
  educationUrl: (id: string) => string;
  personalUrl: (id: string) => string;
  workUrl: (id: string) => string;
}

export interface AccordionProps {
  experience: AnyExperience;
  editPaths?: ExperiencePaths;
}

const ExperienceAccordion: React.FunctionComponent<AccordionProps> = ({
  experience,
  editPaths,
}) => {
  const intl = useIntl();

  // experience type is required with 5 possibilities, build different accordion around which type it is

  if (isAwardExperience(experience)) {
    const editUrl = editPaths ? editPaths.awardUrl(experience.id) : undefined;
    return AwardAccordion({
      ...experience,
      editUrl,
    });
  }
  if (isCommunityExperience(experience)) {
    const editUrl = editPaths
      ? editPaths.communityUrl(experience.id)
      : undefined;
    return CommunityAccordion({
      ...experience,
      editUrl,
    });
  }
  if (isEducationExperience(experience)) {
    const editUrl = editPaths
      ? editPaths.educationUrl(experience.id)
      : undefined;
    return EducationAccordion({
      ...experience,
      editUrl,
    });
  }
  if (isPersonalExperience(experience)) {
    const editUrl = editPaths
      ? editPaths.personalUrl(experience.id)
      : undefined;
    return PersonalAccordion({
      ...experience,
      editUrl,
    });
  }
  if (isWorkExperience(experience)) {
    const editUrl = editPaths ? editPaths.workUrl(experience.id) : undefined;
    return WorkAccordion({
      ...experience,
      editUrl,
    });
  }

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
