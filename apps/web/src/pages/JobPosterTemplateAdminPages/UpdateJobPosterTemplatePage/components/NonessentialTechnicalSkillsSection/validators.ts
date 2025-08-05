import { UpdateJobPosterTemplateNonessentialTechnicalSkillsFragment } from "@gc-digital-talent/graphql";

import { filterNonessentialTechnicalSkills } from "../../utils";

export const hasAllEmptyFields = ({
  jobPosterTemplateSkills,
  nonessentialTechnicalSkillsNotes,
}: UpdateJobPosterTemplateNonessentialTechnicalSkillsFragment): boolean => {
  const nonessentialTechnicalSkills = filterNonessentialTechnicalSkills(
    jobPosterTemplateSkills,
  );
  return (
    nonessentialTechnicalSkills.length === 0 &&
    !nonessentialTechnicalSkillsNotes?.en &&
    !nonessentialTechnicalSkillsNotes?.fr
  );
};

export const hasEmptyRequiredFields = ({
  nonessentialTechnicalSkillsNotes,
}: UpdateJobPosterTemplateNonessentialTechnicalSkillsFragment): boolean =>
  (!nonessentialTechnicalSkillsNotes?.en &&
    !!nonessentialTechnicalSkillsNotes?.fr) ||
  (!!nonessentialTechnicalSkillsNotes?.en &&
    !nonessentialTechnicalSkillsNotes?.fr);
