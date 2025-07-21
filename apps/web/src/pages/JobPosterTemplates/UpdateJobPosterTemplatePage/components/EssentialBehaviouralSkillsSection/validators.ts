import { UpdateJobPosterTemplateEssentialBehaviouralSkillsFragment } from "@gc-digital-talent/graphql";

import { filterEssentialBehaviouralSkills } from "../../utils";

export const hasAllEmptyFields = ({
  jobPosterTemplateSkills,
  essentialBehaviouralSkillsNotes,
}: UpdateJobPosterTemplateEssentialBehaviouralSkillsFragment): boolean => {
  const essentialBehaviouralSkills = filterEssentialBehaviouralSkills(
    jobPosterTemplateSkills,
  );
  return (
    essentialBehaviouralSkills.length === 0 &&
    !essentialBehaviouralSkillsNotes?.en &&
    !essentialBehaviouralSkillsNotes?.fr
  );
};

export const hasEmptyRequiredFields = ({
  essentialBehaviouralSkillsNotes,
}: UpdateJobPosterTemplateEssentialBehaviouralSkillsFragment): boolean =>
  (!essentialBehaviouralSkillsNotes?.en &&
    !!essentialBehaviouralSkillsNotes?.fr) ||
  (!!essentialBehaviouralSkillsNotes?.en &&
    !essentialBehaviouralSkillsNotes?.fr);
