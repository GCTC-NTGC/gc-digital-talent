import { IntlShape } from "react-intl";
import { Maybe, Skill } from "~/api/generated";
import {
  AnyExperience,
  AllExperienceFormValues,
  ExperienceDetailsSubmissionData,
  ExperienceFormValues,
  ExperienceType,
} from "~/types/experience";

// NOTE: File will grow
// eslint-disable-next-line import/prefer-default-export
export const getExperienceTitle = (
  experience: AnyExperience,
  intl: IntlShape,
): string => {
  if ("title" in experience && experience.title) {
    return experience.title;
  }

  if ("areaOfStudy" in experience && experience.areaOfStudy) {
    return experience.areaOfStudy;
  }

  if ("role" in experience && "organization" in experience) {
    if (experience.role && experience.organization) {
      return `${experience.role} (${experience.organization})`;
    }

    if (experience.role) {
      return experience.role;
    }

    if (experience.organization) {
      return experience.organization;
    }
  }

  return intl.formatMessage(
    {
      defaultMessage: "Unknown experience ({id})",
      id: "v9j3+u",
      description:
        "Message displayed when we cannot retrieve an experience title",
    },
    {
      id: experience.id,
    },
  );
};

/**
 * Gets all of the experience form labels
 * based on the type of experience the user
 * is creating/editing
 *
 * @param intl IntlShape
 * @param experienceType  ExperienceType
 * @returns Record<string, React.ReactNode>
 */
export const getExperienceFormLabels = (
  intl: IntlShape,
  experienceType?: ExperienceType,
) => {
  let currentRole = intl.formatMessage({
    defaultMessage: "Current Role",
    id: "4f5qcw",
    description:
      "Label displayed on an Experience form for current role bounded box",
  });
  switch (experienceType) {
    case "award":
      break;
    case "community":
      break;
    case "education":
      currentRole = intl.formatMessage({
        defaultMessage: "Current Education",
        id: "aDRIDD",
        description:
          "Label displayed on Education Experience form for current education bounded box",
      });
      break;
    case "personal":
      currentRole = intl.formatMessage({
        defaultMessage: "Current Experience",
        id: "OAOnyY",
        description:
          "Label displayed on Personal Experience form for current experience bounded box",
      });
      break;
    case "work":
      break;
    default:
      break;
  }

  let organization = intl.formatMessage({
    defaultMessage: "Organization",
    id: "9UZ/eS",
    description:
      "Label displayed on Work Experience form for organization input",
  });

  if (experienceType === "community") {
    organization = intl.formatMessage({
      defaultMessage: "Group / Organization / Community",
      id: "Badvbb",
      description:
        "Label displayed on Community Experience form for organization input",
    });
  }

  return {
    type: intl.formatMessage({
      defaultMessage: "Experience type",
      id: "chnoRd",
      description: "Label for the type of experience a user is creating",
    }),
    awardTitle: intl.formatMessage({
      defaultMessage: "Award Title",
      id: "qeD2p/",
      description: "Label displayed on award form for award title input",
    }),
    awardedDate: intl.formatMessage({
      defaultMessage: "Date Awarded",
      id: "5CONbw",
      description: "Label displayed on award form for date awarded input",
    }),
    awardedTo: intl.formatMessage({
      defaultMessage: "Awarded to",
      id: "0H0CLx",
      description: "Label displayed on Award form for awarded to input",
    }),
    issuedBy: intl.formatMessage({
      defaultMessage: "Issuing Organization or Institution",
      id: "YJdsMY",
      description:
        "Label displayed on award form for issuing organization input",
    }),
    awardedScope: intl.formatMessage({
      defaultMessage: "Award Scope",
      id: "DyaaHi",
      description: "Label displayed on Award form for award scope input",
    }),
    role: intl.formatMessage({
      defaultMessage: "My Role",
      id: "wl8GI6",
      description: "Label displayed on an Experience form for role input",
    }),
    currentRole,
    organization,
    project: intl.formatMessage({
      defaultMessage: "Project / Product",
      id: "0RlNw7",
      description:
        "Label displayed on Community Experience form for project input",
    }),
    startDate: intl.formatMessage({
      defaultMessage: "Start Date",
      id: "1UYQaC",
      description: "Label displayed on an Experience form for start date input",
    }),
    endDate: intl.formatMessage({
      defaultMessage: "End Date",
      id: "X8JZSG",
      description: "Label displayed on an Experience form for end date input",
    }),
    educationType: intl.formatMessage({
      defaultMessage: "Type of Education",
      id: "elFbzT",
      description: "Label displayed on Education form for education type input",
    }),
    areaOfStudy: intl.formatMessage({
      defaultMessage: "Area of study",
      id: "nzw1ry",
      description: "Label displayed on education form for area of study input",
    }),
    institution: intl.formatMessage({
      defaultMessage: "Institution",
      id: "o0Yt8Q",
      description: "Label displayed on education form for institution input",
    }),
    educationStatus: intl.formatMessage({
      defaultMessage: "Status",
      id: "OQhL7A",
      description: "Label displayed on Education form for status input",
    }),
    thesisTitle: intl.formatMessage({
      defaultMessage: "Thesis Title",
      id: "N87bC7",
      description: "Label displayed on education form for thesis title input",
    }),
    experienceTitle: intl.formatMessage({
      defaultMessage: "Short title for this experience",
      id: "97UAb8",
      description:
        "Label displayed on Personal Experience form for experience title input",
    }),
    experienceDescription: intl.formatMessage({
      defaultMessage: "Experience Description",
      id: "q5rd9x",
      description:
        "Label displayed on Personal Experience form for experience description input",
    }),
    disclaimer: intl.formatMessage({
      defaultMessage: "Disclaimer",
      id: "sapxcU",
      description:
        "Label displayed on Personal Experience form for disclaimer bounded box",
    }),
    team: intl.formatMessage({
      defaultMessage: "Team, Group, or Division",
      id: "xJulQ4",
      description:
        "Label displayed on Work Experience form for team/group/division input",
    }),
    details: intl.formatMessage({
      defaultMessage: "Additional Information",
      id: "KmKbA6",
      description:
        "Label displayed on experience form for additional information input",
    }),
  };
};

/**
 * Massages the form values to a shape
 * that can we can POST to the API in
 * a mutation
 *
 * @param type  ExperienceType
 * @param data  ExperienceFormValues<AllExperienceFormValues>
 * @param hiddenSkills Maybe<Skill[]>
 * @returns ExperienceDetailsSubmissionData
 */
export const formValuesToSubmitData = (
  type: ExperienceType | "",
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
    ...(type ? dataMap[type] : {}),
  };
};
