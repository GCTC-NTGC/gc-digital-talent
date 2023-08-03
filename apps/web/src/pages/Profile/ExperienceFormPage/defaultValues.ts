import type { ExperienceType } from "~/types/experience";
import type {
  ExperienceDetailsDefaultValues,
  ExperienceQueryData,
} from "./types";

const queryResultToDefaultValues = (
  experienceType: ExperienceType,
  experience: ExperienceQueryData,
): ExperienceDetailsDefaultValues => {
  const {
    details,
    issuedBy,
    awardedDate,
    awardedTo,
    awardedScope,
    role,
    organization,
    project,
    division,
    startDate,
    endDate,
    status,
    type,
    areaOfStudy,
    institution,
    thesisTitle,
    title,
    description,
    skills,
  } = experience;

  const dataMap = {
    award: {
      awardTitle: title,
      issuedBy,
      awardedDate,
      awardedTo,
      awardedScope,
    },
    community: {
      role: title,
      organization,
      project,
      startDate,
      currentRole: endDate === null,
      endDate,
    },
    education: {
      educationType: type,
      educationStatus: status,
      areaOfStudy,
      institution,
      thesisTitle,
      startDate,
      currentRole: endDate === null,
      endDate,
    },
    personal: {
      experienceTitle: title,
      experienceDescription: description,
      startDate,
      currentRole: endDate === null,
      endDate,
    },
    work: {
      role,
      organization,
      team: division,
      startDate,
      currentRole: endDate === null,
      endDate,
    },
  };

  return {
    details,
    ...dataMap[experienceType],
    skills: skills
      ? skills.map(({ id, name, experienceSkillRecord }) => ({
          skillId: id,
          name,
          details: experienceSkillRecord?.details || "",
        }))
      : undefined,
  };
};

export default queryResultToDefaultValues;
