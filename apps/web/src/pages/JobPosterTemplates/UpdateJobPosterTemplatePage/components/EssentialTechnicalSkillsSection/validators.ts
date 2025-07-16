import { UpdateJobPosterTemplateEssentialTechnicalSkillsFragment } from "@gc-digital-talent/graphql";

import { filterEssentialTechnicalSkills } from "./utils";

export const hasAllEmptyFields = ({
  jobPosterTemplateSkills,
  essentialTechnicalSkillsNotes,
}: UpdateJobPosterTemplateEssentialTechnicalSkillsFragment): boolean => {
  const essentialTechnicalSkills = filterEssentialTechnicalSkills(
    jobPosterTemplateSkills,
  );
  return (
    essentialTechnicalSkills.length === 0 &&
    !essentialTechnicalSkillsNotes?.en &&
    !essentialTechnicalSkillsNotes?.fr
  );
};

export const hasEmptyRequiredFields = ({
  essentialTechnicalSkillsNotes,
}: UpdateJobPosterTemplateEssentialTechnicalSkillsFragment): boolean =>
  (!essentialTechnicalSkillsNotes?.en && !!essentialTechnicalSkillsNotes?.fr) ||
  (!!essentialTechnicalSkillsNotes?.en && !essentialTechnicalSkillsNotes?.fr);
