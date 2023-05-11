// Using graphql __TypeName property for type guard discriminator
/* eslint-disable no-underscore-dangle */
import React from "react";
import { useIntl } from "react-intl";

import { Accordion, HeadingRank } from "@gc-digital-talent/ui";

import { AnyExperience } from "~/types/experience";
import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";

import AwardAccordion from "./individualExperienceAccordions/AwardAccordion";
import CommunityAccordion from "./individualExperienceAccordions/CommunityAccordion";
import EducationAccordion from "./individualExperienceAccordions/EducationAccordion";
import PersonalAccordion from "./individualExperienceAccordions/PersonalAccordion";
import WorkAccordion from "./individualExperienceAccordions/WorkAccordion";
import { ExperienceAccordionHeader } from "./ExperienceAccordionHeader";

export interface ExperiencePaths {
  awardUrl: (id: string) => string;
  communityUrl: (id: string) => string;
  educationUrl: (id: string) => string;
  personalUrl: (id: string) => string;
  workUrl: (id: string) => string;
}

export interface AccordionProps {
  experience: AnyExperience;
  // use if you need a different edit path for each type (deprecated)
  editPaths?: ExperiencePaths;
  // use when you have one path for every type
  editPath?: string;
  // If the edit button is a button, pass the onClick function
  onEditClick?: () => void;
  headingLevel?: HeadingRank;
  showSkills?: boolean;
}

const ExperienceAccordion = ({
  experience,
  editPaths,
  editPath,
  onEditClick,
  headingLevel = "h2",
  showSkills = true,
}: AccordionProps) => {
  const intl = useIntl();

  // experience type is required with 5 possibilities, build different accordion around which type it is

  if (isAwardExperience(experience)) {
    const editUrl = editPath ?? editPaths?.awardUrl(experience.id);
    return AwardAccordion({
      ...experience,
      editUrl,
      onEditClick,
      headingLevel,
      showSkills,
    });
  }
  if (isCommunityExperience(experience)) {
    const editUrl = editPath ?? editPaths?.communityUrl(experience.id);
    return CommunityAccordion({
      ...experience,
      editUrl,
      onEditClick,
      headingLevel,
      showSkills,
    });
  }
  if (isEducationExperience(experience)) {
    const editUrl = editPath ?? editPaths?.educationUrl(experience.id);
    return EducationAccordion({
      ...experience,
      editUrl,
      onEditClick,
      headingLevel,
      showSkills,
    });
  }
  if (isPersonalExperience(experience)) {
    const editUrl = editPath ?? editPaths?.personalUrl(experience.id);
    return PersonalAccordion({
      ...experience,
      editUrl,
      onEditClick,
      headingLevel,
      showSkills,
    });
  }
  if (isWorkExperience(experience)) {
    const editUrl = editPath ?? editPaths?.workUrl(experience.id);
    return WorkAccordion({
      ...experience,
      editUrl,
      onEditClick,
      headingLevel,
      showSkills,
    });
  }

  // not one of the 5 experience types
  return (
    <Accordion.Item value="none">
      <ExperienceAccordionHeader headingAs={headingLevel}>
        {intl.formatMessage({
          defaultMessage: "Unknown Experience",
          id: "U/Lv8i",
          description: "Title for unknown experiences",
        })}
      </ExperienceAccordionHeader>
    </Accordion.Item>
  );
};

export default ExperienceAccordion;
