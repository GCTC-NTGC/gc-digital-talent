// Using graphql __TypeName property for type guard discriminator
/* eslint-disable no-underscore-dangle */
import React from "react";
import { useIntl } from "react-intl";

import { Accordion, HeadingRank } from "@gc-digital-talent/ui";

import {
  AnyExperience,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/types/experience";

import AwardAccordion from "./individualExperienceAccordions/AwardAccordion";
import CommunityAccordion from "./individualExperienceAccordions/CommunityAccordion";
import EducationAccordion from "./individualExperienceAccordions/EducationAccordion";
import PersonalAccordion from "./individualExperienceAccordions/PersonalAccordion";
import WorkAccordion from "./individualExperienceAccordions/WorkAccordion";

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
  headingLevel?: HeadingRank;
}

const ExperienceAccordion = ({
  experience,
  editPaths,
  headingLevel = "h2",
}: AccordionProps) => {
  const intl = useIntl();

  // experience type is required with 5 possibilities, build different accordion around which type it is

  if (isAwardExperience(experience)) {
    const editUrl = editPaths ? editPaths.awardUrl(experience.id) : undefined;
    return AwardAccordion({
      ...experience,
      editUrl,
      headingLevel,
    });
  }
  if (isCommunityExperience(experience)) {
    const editUrl = editPaths
      ? editPaths.communityUrl(experience.id)
      : undefined;
    return CommunityAccordion({
      ...experience,
      editUrl,
      headingLevel,
    });
  }
  if (isEducationExperience(experience)) {
    const editUrl = editPaths
      ? editPaths.educationUrl(experience.id)
      : undefined;
    return EducationAccordion({
      ...experience,
      editUrl,
      headingLevel,
    });
  }
  if (isPersonalExperience(experience)) {
    const editUrl = editPaths
      ? editPaths.personalUrl(experience.id)
      : undefined;
    return PersonalAccordion({
      ...experience,
      editUrl,
      headingLevel,
    });
  }
  if (isWorkExperience(experience)) {
    const editUrl = editPaths ? editPaths.workUrl(experience.id) : undefined;
    return WorkAccordion({
      ...experience,
      editUrl,
      headingLevel,
    });
  }

  // not one of the 5 experience types
  return (
    <Accordion.Item value="none">
      <Accordion.Trigger headerAs={headingLevel}>
        {intl.formatMessage({
          defaultMessage: "Unknown Experience",
          id: "U/Lv8i",
          description: "Title for unknown experiences",
        })}
      </Accordion.Trigger>
    </Accordion.Item>
  );
};

export default ExperienceAccordion;
