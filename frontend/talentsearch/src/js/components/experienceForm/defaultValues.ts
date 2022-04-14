import type {
  ExperienceDetailsDefaultValues,
  ExperienceType,
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
      endDate,
    },
    education: {
      educationType: type,
      educationStatus: status,
      areaOfStudy,
      institution,
      thesisTitle,
      startDate,
      endDate,
    },
    personal: {
      experienceTitle: title,
      experienceDescription: description,
      startDate,
      endDate,
    },
    work: {
      role,
      organization,
      team: division,
      startDate,
      endDate,
    },
  };

  return {
    details,
    ...dataMap[experienceType],
    skills: skills
      ? skills.reduce((prev, curr) => {
          return {
            ...prev,
            [curr.id]: {
              details: curr.experienceSkillRecord?.details || "",
            },
          };
        }, {})
      : undefined,
  };
};

export default queryResultToDefaultValues;
