import {
  AllFormValues,
  ExperienceDetailsSubmissionData,
  ExperienceType,
  FormValues,
} from "./types";

const formValuesToSubmitData = (
  type: ExperienceType,
  data: FormValues<AllFormValues>,
): ExperienceDetailsSubmissionData => {
  const {
    issuedBy,
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
  } = data;

  const dataMap: Record<ExperienceType, ExperienceDetailsSubmissionData> = {
    award: {
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
      endDate,
    },
    education: {
      type: educationType,
      status: educationStatus,
      areaOfStudy,
      institution,
      thesisTitle,
      startDate,
      endDate,
    },
    personal: {
      title: experienceTitle,
      description: experienceDescription,
      startDate,
      endDate,
    },
    work: {
      role,
      organization,
      division: team,
      startDate,
      endDate,
    },
  };

  let skillSync;
  if (data.skills) {
    skillSync = Object.keys(data.skills).map((key: string) => {
      if (!data.skills) {
        return undefined;
      }
      const skill = data.skills[key];
      return {
        id: key,
        details: skill.details,
      };
    });
  }

  return {
    details: data.details,
    skills: data.skills ? { sync: skillSync } : null,
    ...dataMap[type],
  };
};

export default formValuesToSubmitData;
