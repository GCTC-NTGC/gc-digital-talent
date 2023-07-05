/* eslint-disable no-underscore-dangle */
import { IntlShape, useIntl } from "react-intl";
import BookOpenIcon from "@heroicons/react/20/solid/BookOpenIcon";
import BriefcaseIcon from "@heroicons/react/20/solid/BriefcaseIcon";
import LightBulbIcon from "@heroicons/react/20/solid/LightBulbIcon";
import StarIcon from "@heroicons/react/20/solid/StarIcon";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";

import {
  AllExperienceFormValues,
  AnyExperience,
  ExperienceDetailsDefaultValues,
  ExperienceDetailsSubmissionData,
  ExperienceForDate,
  ExperienceFormValues,
  ExperienceType,
} from "~/types/experience";
import { commonMessages } from "@gc-digital-talent/i18n";
import React from "react";
import { useAuthorization } from "@gc-digital-talent/auth";
import { IconType } from "@gc-digital-talent/ui";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  Maybe,
  PersonalExperience,
  Skill,
  WorkExperience,
} from "../api/generated";
import useRoutes from "../hooks/useRoutes";
import experienceMessages from "../messages/experienceMessages";

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
  data: ExperienceFormValues<AllExperienceFormValues>,
  hiddenSkills: Maybe<Skill[]>,
  type?: ExperienceType | "",
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

export const isAwardExperience = (e: AnyExperience): e is AwardExperience =>
  e.__typename === "AwardExperience";
export const isCommunityExperience = (
  e: AnyExperience,
): e is CommunityExperience => e.__typename === "CommunityExperience";
export const isEducationExperience = (
  e: AnyExperience,
): e is EducationExperience => e.__typename === "EducationExperience";
export const isPersonalExperience = (
  e: AnyExperience,
): e is PersonalExperience => e.__typename === "PersonalExperience";
export const isWorkExperience = (e: AnyExperience): e is WorkExperience =>
  e.__typename === "WorkExperience";

export const compareByDate = (e1: ExperienceForDate, e2: ExperienceForDate) => {
  // fit AwardExperience to startDate - endDate format
  const e1Adjusted = e1;
  const e2Adjusted = e2;
  if (e1.__typename === "AwardExperience") {
    e1Adjusted.startDate = e1.awardedDate;
    e1Adjusted.endDate = e1.awardedDate;
  }
  if (e2.__typename === "AwardExperience") {
    e2Adjusted.startDate = e2.awardedDate;
    e2Adjusted.endDate = e2.awardedDate;
  }

  const e1EndDate = e1Adjusted.endDate
    ? new Date(e1Adjusted.endDate).getTime()
    : null;
  const e2EndDate = e2Adjusted.endDate
    ? new Date(e2Adjusted.endDate).getTime()
    : null;
  const e1StartDate = e1Adjusted.startDate
    ? new Date(e1Adjusted.startDate).getTime()
    : -1;
  const e2StartDate = e2Adjusted.startDate
    ? new Date(e2Adjusted.startDate).getTime()
    : -1;

  // All items with no end date should be at the top and sorted by most recent start date.
  if (!e1EndDate && !e2EndDate) {
    return e2StartDate - e1StartDate;
  }

  if (!e1EndDate) {
    return -1;
  }

  if (!e2EndDate) {
    return 1;
  }

  // Items with end date should be sorted by most recent end date at top.
  return e2EndDate - e1EndDate;
};

/**
 * Convert the API experience type to
 * something more useable
 *
 * @param experience
 * @returns
 */
export const deriveExperienceType = (
  experience: AnyExperience,
): ExperienceType | undefined => {
  const map = new Map<AnyExperience["__typename"], ExperienceType>([
    ["AwardExperience", "award"],
    ["EducationExperience", "education"],
    ["CommunityExperience", "community"],
    ["PersonalExperience", "personal"],
    ["WorkExperience", "work"],
  ]);

  // eslint-disable-next-line no-underscore-dangle
  if (!experience.__typename) {
    return undefined;
  }

  // eslint-disable-next-line no-underscore-dangle
  return map.get(experience.__typename);
};

/**
 * Massage AwardExperience API data to form values
 *
 * @param experience
 * @returns
 */
const getAwardExperienceDefaultValues = (experience: AwardExperience) => {
  const { title, issuedBy, awardedDate, awardedTo, awardedScope } = experience;
  return {
    awardTitle: title,
    issuedBy,
    awardedDate,
    awardedTo,
    awardedScope,
  };
};

/**
 * Massage CommunityExperience API data to form values
 *
 * @param experience
 * @returns
 */
const getCommunityExperienceDefaultValues = (
  experience: CommunityExperience,
) => {
  const { title, organization, project, startDate, endDate } = experience;
  return {
    role: title,
    organization,
    project,
    startDate,
    currentRole: endDate === null,
    endDate,
  };
};

/**
 * Massage EducationExperience API data to form values
 *
 * @param experience
 * @returns
 */
const getEducationExperienceDefaultValues = (
  experience: EducationExperience,
) => {
  const {
    type,
    status,
    areaOfStudy,
    institution,
    thesisTitle,
    startDate,
    endDate,
  } = experience;
  return {
    educationType: type,
    educationStatus: status,
    areaOfStudy,
    institution,
    thesisTitle,
    startDate,
    currentRole: endDate === null,
    endDate,
  };
};

/**
 * Massage PersonalExperience API data to form values
 *
 * @param experience
 * @returns
 */
const getPersonalExperienceDefaultValues = (experience: PersonalExperience) => {
  const { title, description, startDate, endDate } = experience;
  return {
    experienceTitle: title,
    experienceDescription: description,
    startDate,
    currentRole: endDate === null,
    endDate,
  };
};

/**
 * Massage WorkExperience API data to form values
 *
 * @param experience
 * @returns
 */
const getWorkExperienceDefaultValues = (experience: WorkExperience) => {
  const { role, organization, division, startDate, endDate } = experience;
  return {
    role,
    organization,
    team: division,
    startDate,
    currentRole: endDate === null,
    endDate,
  };
};

/**
 * Massage API response into form values
 *
 * @param experienceType
 * @param experience
 * @returns
 */
export const queryResultToDefaultValues = (
  experienceType: ExperienceType,
  experience: AnyExperience,
): ExperienceDetailsDefaultValues => {
  let unsharedValues = {};
  if (isAwardExperience(experience)) {
    unsharedValues = getAwardExperienceDefaultValues(experience);
  }
  if (isCommunityExperience(experience)) {
    unsharedValues = getCommunityExperienceDefaultValues(experience);
  }
  if (isEducationExperience(experience)) {
    unsharedValues = getEducationExperienceDefaultValues(experience);
  }
  if (isPersonalExperience(experience)) {
    unsharedValues = getPersonalExperienceDefaultValues(experience);
  }
  if (isWorkExperience(experience)) {
    unsharedValues = getWorkExperienceDefaultValues(experience);
  }

  return {
    details: experience.details || "",
    ...unsharedValues,
  };
};

/**
 * Get the name of any experience type
 *
 * @param AnyExperience experience
 * @return string|React.ReactNode
 */
export const getExperienceName = (
  experience: AnyExperience,
  intl: IntlShape,
  html = false,
) => {
  if (isAwardExperience(experience) || isPersonalExperience(experience)) {
    return html ? (
      <span data-h2-font-weight="base(700)">{experience.title}</span>
    ) : (
      experience.title
    );
  }

  if (isCommunityExperience(experience)) {
    const { title, organization } = experience;
    return intl.formatMessage(
      html
        ? experienceMessages.communityAtHtml
        : experienceMessages.communityAt,
      {
        title,
        organization,
      },
    );
  }

  if (isEducationExperience(experience)) {
    const { areaOfStudy, institution } = experience;
    return intl.formatMessage(
      html
        ? experienceMessages.educationAtHtml
        : experienceMessages.educationAt,
      {
        areaOfStudy,
        institution,
      },
    );
  }

  if (isWorkExperience(experience)) {
    const { role, organization } = experience;
    return intl.formatMessage(
      html ? experienceMessages.workAtHtml : experienceMessages.workAt,
      {
        role,
        organization,
      },
    );
  }

  // We should never get here but just in case we do, return no provided
  return intl.formatMessage(commonMessages.notProvided);
};

type ExperienceInfo = {
  title: string;
  titleHtml: React.ReactNode;
  editPath?: string;
  typeMessage: React.ReactNode;
  icon: IconType;
};

type UseExperienceInfo = (experience: AnyExperience) => ExperienceInfo;

/**
 * Use experience info
 *
 * Returns information about an experience based
 * on the type
 *
 * @param AnyExperience experience
 * @return
 */
export const useExperienceInfo: UseExperienceInfo = (experience) => {
  const intl = useIntl();
  const { user } = useAuthorization();
  const paths = useRoutes();
  const experienceType = deriveExperienceType(experience);
  const userId = experience?.user?.id || user?.id || "";
  const defaults = {
    title: intl.formatMessage(commonMessages.notProvided).toString(),
    titleHtml: intl.formatMessage(commonMessages.notProvided),
    typeMessage: intl.formatMessage(experienceMessages.unknown),
    icon: InformationCircleIcon,
  };

  if (!experienceType) return defaults;

  const editPaths = new Map<ExperienceType, string>([
    ["award", paths.editExperience(userId, "award", experience.id)],
    ["community", paths.editExperience(userId, "community", experience.id)],
    ["education", paths.editExperience(userId, "education", experience.id)],
    ["personal", paths.editExperience(userId, "personal", experience.id)],
    ["work", paths.editExperience(userId, "work", experience.id)],
  ]);

  const typeMessages = new Map<ExperienceType, string>([
    ["award", intl.formatMessage(experienceMessages.award)],
    ["community", intl.formatMessage(experienceMessages.community)],
    ["education", intl.formatMessage(experienceMessages.education)],
    ["personal", intl.formatMessage(experienceMessages.personal)],
    ["work", intl.formatMessage(experienceMessages.work)],
  ]);

  const icons = new Map<ExperienceType, IconType>([
    ["award", StarIcon],
    ["community", UserGroupIcon],
    ["education", BookOpenIcon],
    ["personal", LightBulbIcon],
    ["work", BriefcaseIcon],
  ]);

  return {
    title: getExperienceName(experience, intl)?.toString() ?? defaults.title,
    titleHtml: getExperienceName(experience, intl, true),
    editPath: editPaths.get(experienceType),
    typeMessage: typeMessages.get(experienceType) || defaults.typeMessage,
    icon: icons.get(experienceType) || defaults.icon,
  };
};
