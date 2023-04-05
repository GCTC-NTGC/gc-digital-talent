import { Maybe, Skill } from "~/api/generated";
import {
  AllExperienceFormValues,
  ExperienceDetailsSubmissionData,
  ExperienceType,
  ExperienceFormValues,
} from "~/types/experience";

const formValuesToSubmitData = (
  type: ExperienceType,
  data: ExperienceFormValues<AllExperienceFormValues>,
  hiddenSkills: Maybe<Skill[]>,
): ExperienceDetailsSubmissionData => {
  const {
    issuedBy,
    awardTitle,
    awardedDate,
    awardedTo,
    awardedScope,
    role,
    organization,
    project,
    team,
    startDate,
    endDate,
    educationStatus,
    educationType,
    areaOfStudy,
    institution,
    thesisTitle,
    experienceTitle,
    experienceDescription,
    currentRole,
  } = data;

  const newEndDate = !currentRole && endDate ? endDate : null;

  const dataMap: Record<ExperienceType, ExperienceDetailsSubmissionData> = {
    award: {
      title: awardTitle,
      issuedBy,
      awardedDate,
      awardedTo,
      awardedScope,
    },
    community: {
      title: role,
      organization,
      project,
      startDate,
      endDate: newEndDate,
    },
    education: {
      type: educationType,
      status: educationStatus,
      areaOfStudy,
      institution,
      thesisTitle,
      startDate,
      endDate: newEndDate,
    },
    personal: {
      title: experienceTitle,
      description: experienceDescription,
      startDate,
      endDate: newEndDate,
    },
    work: {
      role,
      organization,
      division: team,
      startDate,
      endDate: newEndDate,
    },
  };

  let skillSync;
  if (data.skills) {
    skillSync = data.skills
      ? [
          ...(data.skills
            ? data.skills.map((skill) => {
                return {
                  id: skill.skillId,
                  details: skill.details,
                };
              })
            : []),
          ...(hiddenSkills
            ? hiddenSkills.map((skill) => {
                return {
                  id: skill.id,
                  details: skill.experienceSkillRecord?.details,
                };
              })
            : []),
        ]
      : undefined;
  }

  return {
    details: data.details,
    skills: data.skills ? { sync: skillSync } : undefined,
    ...dataMap[type],
  };
};

export default formValuesToSubmitData;
