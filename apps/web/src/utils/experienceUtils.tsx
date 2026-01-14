import { IntlShape, useIntl } from "react-intl";
import BookOpenIcon from "@heroicons/react/20/solid/BookOpenIcon";
import BriefcaseIcon from "@heroicons/react/20/solid/BriefcaseIcon";
import LightBulbIcon from "@heroicons/react/20/solid/LightBulbIcon";
import StarIcon from "@heroicons/react/20/solid/StarIcon";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import { ReactNode } from "react";
import { parseISO } from "date-fns/parseISO";
import { differenceInMonths } from "date-fns/differenceInMonths";
import { isPast } from "date-fns/isPast";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { IconType } from "@gc-digital-talent/ui";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  EducationType,
  EmploymentCategory,
  GovEmployeeType,
  GovPositionType,
  LocalizedCafForce,
  LocalizedEducationType,
  LocalizedEmploymentCategory,
  LocalizedString,
  Maybe,
  PersonalExperience,
  Skill,
  WorkExperience,
} from "@gc-digital-talent/graphql";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import {
  nodeToString,
  uniqueItems,
  unpackMaybes,
  assertUnreachable,
  empty,
} from "@gc-digital-talent/helpers";
import { defaultLogger } from "@gc-digital-talent/logger";

import {
  AllExperienceFormValues,
  AnyExperience,
  ExperienceDetailsDefaultValues,
  ExperienceDetailsSubmissionData,
  ExperienceForDate,
  ExperienceFormValues,
  ExperienceType,
} from "~/types/experience";

import { formattedDate, getDateRange } from "./dateUtils";
import useRoutes from "../hooks/useRoutes";
import experienceMessages from "../messages/experienceMessages";

/**
 * Gets all of the experience form labels
 * based on the type of experience the user
 * is creating/editing
 *
 * @param intl IntlShape
 * @param experienceType  ExperienceType
 * @returns Record<string, ReactNode>
 */
export const getExperienceFormLabels = (
  intl: IntlShape,
  experienceType?: ExperienceType,
) => {
  let currentRole = intl.formatMessage({
    defaultMessage: "Current role",
    id: "n4pwef",
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
        defaultMessage: "Current education",
        id: "SZeO9P",
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

  let organization = intl.formatMessage(commonMessages.organization);

  if (experienceType === "community") {
    organization = intl.formatMessage({
      defaultMessage: "Group, organization, or community",
      id: "c11b35",
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
    typeNullSelection: intl.formatMessage({
      defaultMessage: "Select a type",
      id: "5PUycY",
      description: "Default selection for the experience type field",
    }),
    selectType: intl.formatMessage({
      defaultMessage: "Select a type of experience",
      id: "jw6Umr",
      description:
        "Heading for the experience type section fo the experience form",
    }),
    awardTitle: intl.formatMessage({
      defaultMessage: "Award title",
      id: "lhCCs2",
      description: "Label displayed on award form for award title input",
    }),
    awardedDate: intl.formatMessage({
      defaultMessage: "Date awarded",
      id: "RDkTqP",
      description: "Label displayed on award form for date awarded input",
    }),
    awardedTo: intl.formatMessage({
      defaultMessage: "Awarded to",
      id: "0H0CLx",
      description: "Label displayed on Award form for awarded to input",
    }),
    issuedBy: intl.formatMessage({
      defaultMessage: "Issuing organization",
      id: "NGEgVN",
      description: "Label displayed on award form for organization section",
    }),
    awardedScope: intl.formatMessage({
      defaultMessage: "Award scope",
      id: "gnEK8V",
      description: "Label displayed on Award form for award scope input",
    }),
    role: intl.formatMessage({
      defaultMessage: "My role",
      id: "nyQyqM",
      description: "Label displayed on an Experience form for role input",
    }),
    currentRole,
    organization,
    project: intl.formatMessage({
      defaultMessage: "Project or product",
      id: "5+J43O",
      description:
        "Label displayed on Community Experience form for project input",
    }),
    startDate: intl.formatMessage({
      defaultMessage: "Start date",
      id: "Yaxm1W",
      description: "Label displayed on an Experience form for start date input",
    }),
    endDate: intl.formatMessage({
      defaultMessage: "End date",
      id: "cD3QKi",
      description: "Label displayed on an Experience form for end date input",
    }),
    expectedEndDate: intl.formatMessage({
      defaultMessage: "Expected end date",
      id: "0qwyH4",
      description:
        "Label displayed on an Experience form for expected end date input",
    }),
    dateRange: intl.formatMessage({
      defaultMessage: "Start/end date",
      id: "PVzyQl",
      description: "Label for the start/end date for an experience",
    }),
    educationType: intl.formatMessage({
      defaultMessage: "Type of education",
      id: "AAvLM5",
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
    educationStatus: intl.formatMessage(commonMessages.status),
    thesisTitle: intl.formatMessage({
      defaultMessage: "Thesis title",
      id: "E9I34y",
      description: "Label displayed on education form for thesis title input",
    }),
    experienceTitle: intl.formatMessage({
      defaultMessage: "Short title for this experience",
      id: "97UAb8",
      description:
        "Label displayed on Personal Experience form for experience title input",
    }),
    experienceDescription: intl.formatMessage({
      defaultMessage: "Experience description",
      id: "rMJ7fd",
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
      defaultMessage: "Team, group, or division",
      id: "qn77WI",
      description:
        "Label displayed on Work Experience form for team/group/division input",
    }),
    details: intl.formatMessage({
      defaultMessage: "Additional details",
      id: "fPIZn9",
      description:
        "Label displayed on experience form/card for additional details input/section",
    }),
    howIUsed: intl.formatMessage({
      defaultMessage: "How I used",
      id: "jH5egG",
      description:
        "Label displayed on experience form/card for how a skill was applied section",
    }),
    classificationGroup: intl.formatMessage(commonMessages.group),
    classificationLevel: intl.formatMessage(commonMessages.level),
    extSizeOfOrganization: intl.formatMessage({
      defaultMessage: "Size of the organization",
      id: "HP5PEg",
      description: "Label for the size of the organization radio group",
    }),
    extRoleSeniority: intl.formatMessage({
      defaultMessage: "Seniority of the role",
      id: "34NvoS",
      description: "Label for the seniority of the role radio group",
    }),
    govEmploymentType: intl.formatMessage({
      defaultMessage: "Employment type",
      id: "uaEMMO",
      description: "Label for the employment type radio group",
    }),
    classification: intl.formatMessage({
      defaultMessage: "Classification",
      id: "d1FYv4",
      description: "Label displayed on Work Experience card for classification",
    }),
    positionType: intl.formatMessage({
      defaultMessage: "Position type",
      id: "0Dp1N4",
      description: "Label for the position type radio group",
    }),
    govContractorRoleSeniority: intl.formatMessage({
      defaultMessage: "Seniority of the role",
      id: "34NvoS",
      description: "Label for the seniority of the role radio group",
    }),
    govContractorType: intl.formatMessage({
      defaultMessage: "Contractor type",
      id: "Ym2fFN",
      description: "Label for the role seniority radio group",
    }),
    contractorFirmAgencyName: intl.formatMessage({
      defaultMessage: "Contracting firm or agency",
      id: "Mea0Vt",
      description: "Label for the contracting firm or agency text field",
    }),
    cafEmploymentType: intl.formatMessage({
      defaultMessage: "Employment type",
      id: "uaEMMO",
      description: "Label for the employment type radio group",
    }),
    cafRank: intl.formatMessage({
      defaultMessage: "Rank category",
      id: "4fV+wX",
      description: "Label for the rank category radio group",
    }),
    supervisoryPosition: intl.formatMessage({
      defaultMessage: "Management or supervisory status",
      id: "PSIaKn",
      description: "Label for supervisory position field",
    }),
    supervisedEmployees: intl.formatMessage({
      defaultMessage: "Employee supervision",
      id: "T5nYy9",
      description: "Label for employee supervision field",
    }),
    supervisedEmployeesNumber: intl.formatMessage({
      defaultMessage: "Number of employees",
      id: "0vNb2/",
      description: "Label for number of employees field",
    }),
    budgetManagement: intl.formatMessage({
      defaultMessage: "Budget management or delegated signing authority",
      id: "uVtmGg",
      description: "Label for budget management field",
    }),
    annualBudgetAllocation: intl.formatMessage({
      defaultMessage: "Annual budget allocation (CAD$)",
      id: "ZEmZm4",
      description: "Label for annual budget allocation field",
    }),
    seniorManagementStatus: intl.formatMessage({
      defaultMessage: "Senior management status",
      id: "UAscG1",
      description: "Label for senior management status field",
    }),
    cSuiteRoleTitle: intl.formatMessage({
      defaultMessage: "C-suite role title",
      id: "KgG9BM",
      description: "Label for c-suite role title field",
    }),
    otherCSuiteRoleTitle: intl.formatMessage({
      defaultMessage: "Other C-suite title",
      id: "ZLKng1",
      description: "Label for other c-suite role title field",
    }),
  };
};

/**
 * Massages the form values to a shape
 * that can we can POST to the API in
 * a mutation.
 *
 * A simpler copy exists for just creating a work experience in apps/web/src/pages/Auth/RegistrationPages/EmployeeInformationPage/EmployeeInformationPage.tsx with no skills.
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
    employmentCategory,
    extSizeOfOrganization,
    extRoleSeniority,
    department: departmentId,
    govEmploymentType,
    govPositionType,
    govContractorRoleSeniority,
    govContractorType,
    contractorFirmAgencyName,
    classificationLevel: classificationId,
    cafEmploymentType,
    cafForce,
    cafRank,
    workStreams,
    supervisoryPosition,
    supervisedEmployees,
    supervisedEmployeesNumber,
    budgetManagement,
    annualBudgetAllocation,
    seniorManagementStatus,
    cSuiteRoleTitle,
    otherCSuiteRoleTitle,
  } = data;

  // for government employee experiences only, expected end date is present in end date field
  // SUBSTANTIVE the exception, accessible solely through INDETERMINATE
  const allowExpectedEndDate =
    employmentCategory === EmploymentCategory.GovernmentOfCanada &&
    govPositionType !== GovPositionType.Substantive;

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
      endDate: !currentRole && endDate ? endDate : null,
    },
    education: {
      type: educationType,
      status: educationStatus,
      areaOfStudy,
      institution,
      thesisTitle,
      startDate,
      endDate: !currentRole && endDate ? endDate : null,
    },
    personal: {
      title: experienceTitle,
      description: experienceDescription,
      startDate,
      endDate: !currentRole && endDate ? endDate : null,
    },
    work: {
      role,
      organization,
      division: team,
      startDate,
      endDate:
        allowExpectedEndDate || (!currentRole && endDate) ? endDate : null,
      employmentCategory,
      extSizeOfOrganization,
      extRoleSeniority,
      department: departmentId ? { connect: departmentId } : null,
      govEmploymentType,
      govPositionType,
      govContractorRoleSeniority,
      govContractorType,
      contractorFirmAgencyName,
      classificationId: classificationId ?? null,
      cafEmploymentType,
      cafForce,
      cafRank,
      workStreams: {
        sync: workStreams,
      },
      supervisoryPosition,
      supervisedEmployees,
      supervisedEmployeesNumber: Number(supervisedEmployeesNumber),
      budgetManagement,
      annualBudgetAllocation: Number(annualBudgetAllocation),
      seniorManagementStatus,
      cSuiteRoleTitle,
      otherCSuiteRoleTitle,
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
                  details: skill.details ?? "",
                };
              })
            : []),
          ...(hiddenSkills
            ? hiddenSkills.map((skill) => {
                return {
                  id: skill.id,
                  details: skill.experienceSkillRecord?.details ?? "",
                };
              })
            : []),
        ]
      : undefined;
  }

  return {
    details: data.details,
    skills: { sync: skillSync },
    ...(type ? dataMap[type] : {}),
  };
};

export interface SimpleAnyExperience {
  __typename?:
    | "AwardExperience"
    | "CommunityExperience"
    | "EducationExperience"
    | "PersonalExperience"
    | "WorkExperience";
}

export const isAwardExperience = (
  e: SimpleAnyExperience,
): e is Omit<AwardExperience, "user"> => e.__typename === "AwardExperience";
export const isCommunityExperience = (
  e: SimpleAnyExperience,
): e is Omit<CommunityExperience, "user"> =>
  e.__typename === "CommunityExperience";
export const isEducationExperience = (
  e: SimpleAnyExperience,
): e is Omit<EducationExperience, "user"> =>
  e.__typename === "EducationExperience";
export const isPersonalExperience = (
  e: SimpleAnyExperience,
): e is Omit<PersonalExperience, "user"> =>
  e.__typename === "PersonalExperience";
export const isWorkExperience = (
  e: SimpleAnyExperience,
): e is Omit<WorkExperience, "user"> => e.__typename === "WorkExperience";
export const isGovWorkExperience = (
  e: SimpleAnyExperience,
): e is Omit<WorkExperience, "user"> =>
  isWorkExperience(e) &&
  e.employmentCategory?.value === EmploymentCategory.GovernmentOfCanada;

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
  experience: SimpleAnyExperience,
): ExperienceType | undefined => {
  const map = new Map<SimpleAnyExperience["__typename"], ExperienceType>([
    ["AwardExperience", "award"],
    ["EducationExperience", "education"],
    ["CommunityExperience", "community"],
    ["PersonalExperience", "personal"],
    ["WorkExperience", "work"],
  ]);

  if (!experience.__typename) {
    return undefined;
  }

  return map.get(experience.__typename);
};

/**
 * Massage AwardExperience API data to form values
 *
 * @param experience
 * @returns
 */
const getAwardExperienceDefaultValues = (
  experience: Omit<AwardExperience, "user">,
) => {
  const { title, issuedBy, awardedDate, awardedTo, awardedScope } = experience;
  return {
    awardTitle: title,
    issuedBy,
    awardedDate,
    awardedTo: awardedTo?.value,
    awardedScope: awardedScope?.value,
  };
};

/**
 * Massage CommunityExperience API data to form values
 *
 * @param experience
 * @returns
 */
const getCommunityExperienceDefaultValues = (
  experience: Omit<CommunityExperience, "user">,
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
  experience: Omit<EducationExperience, "user">,
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
    educationType: type?.value,
    educationStatus: status?.value,
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
const getPersonalExperienceDefaultValues = (
  experience: Omit<PersonalExperience, "user">,
) => {
  const { title, description, startDate, endDate } = experience;
  return {
    experienceTitle: title,
    experienceDescription: description,
    startDate,
    currentRole: endDate === null,
    endDate,
    disclaimer: true,
  };
};

/**
 * Massage WorkExperience API data to form values
 *
 * @param experience
 * @returns
 */
const getWorkExperienceDefaultValues = (
  experience: Omit<WorkExperience, "user">,
) => {
  const {
    role,
    organization,
    division,
    startDate,
    endDate,
    employmentCategory,
    extSizeOfOrganization,
    extRoleSeniority,
    department,
    classification,
    govEmploymentType,
    govPositionType,
    govContractorRoleSeniority,
    govContractorType,
    contractorFirmAgencyName,
    cafEmploymentType,
    cafForce,
    cafRank,
    workStreams,
    supervisoryPosition,
    supervisedEmployees,
    supervisedEmployeesNumber,
    budgetManagement,
    annualBudgetAllocation,
    seniorManagementStatus,
    cSuiteRoleTitle,
    otherCSuiteRoleTitle,
  } = experience;

  const isIndeterminate =
    govEmploymentType?.value === GovEmployeeType.Indeterminate;
  const indeterminateActing =
    isIndeterminate && govPositionType?.value === GovPositionType.Acting;
  const indeterminateAssignment =
    isIndeterminate && govPositionType?.value === GovPositionType.Assignment;
  const indeterminateSecondment =
    isIndeterminate && govPositionType?.value === GovPositionType.Secondment;

  const expectedEndDate =
    govEmploymentType?.value === GovEmployeeType.Student ||
    govEmploymentType?.value === GovEmployeeType.Casual ||
    govEmploymentType?.value === GovEmployeeType.Term ||
    indeterminateActing ||
    indeterminateAssignment ||
    indeterminateSecondment;

  let currentRole = false;

  if (endDate) {
    currentRole = false;
    if (expectedEndDate) {
      currentRole = endDate >= strToFormDate(new Date().toISOString());
    }
  } else {
    currentRole = true;
  }

  return {
    role,
    organization,
    team: division,
    startDate,
    currentRole,
    endDate,
    employmentCategory: employmentCategory?.value,
    extSizeOfOrganization: extSizeOfOrganization?.value,
    extRoleSeniority: extRoleSeniority?.value,
    department: department?.id,
    classificationGroup: classification?.group,
    classificationLevel: classification?.id,
    govEmploymentType: govEmploymentType?.value,
    govPositionType: govPositionType?.value,
    govContractorRoleSeniority: govContractorRoleSeniority?.value,
    govContractorType: govContractorType?.value,
    contractorFirmAgencyName,
    cafEmploymentType: cafEmploymentType?.value,
    cafForce: cafForce?.value,
    cafRank: cafRank?.value,
    workStreams: workStreams?.map((item) => item.id),
    supervisoryPosition,
    supervisedEmployees,
    supervisedEmployeesNumber,
    budgetManagement,
    annualBudgetAllocation,
    seniorManagementStatus,
    cSuiteRoleTitle: cSuiteRoleTitle?.value,
    otherCSuiteRoleTitle,
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
): ExperienceDetailsDefaultValues & { experienceType: ExperienceType } => {
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
    details: experience.details ?? "",
    ...unsharedValues,
    skills: experience.skills
      ? experience.skills.map(({ id, name, experienceSkillRecord }) => ({
          skillId: id,
          name,
          details: experienceSkillRecord?.details ?? "",
        }))
      : undefined,
    experienceType,
  };
};

export interface ExperienceName extends SimpleAnyExperience {
  title?: Maybe<string>;
  organization?: Maybe<string>;
  type?: Maybe<Partial<LocalizedEducationType>> | string;
  areaOfStudy?: Maybe<string>;
  institution?: Maybe<string>;
  role?: Maybe<string>;
  employmentCategory?: Maybe<Partial<LocalizedEmploymentCategory>>;
  department?: Maybe<{
    name?: Maybe<Partial<LocalizedString>>;
  }>;
  cafForce?: Maybe<Partial<LocalizedCafForce>>;
}

/**
 * Get the name of any experience type
 *
 * @param AnyExperience experience
 * @return string|ReactNode
 */
export const getExperienceName = <T extends ExperienceName>(
  experience: T,
  intl: IntlShape,
  html = false,
) => {
  if (isAwardExperience(experience) || isPersonalExperience(experience)) {
    return html ? (
      <span className="font-bold">{experience.title}</span>
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
    const { type, areaOfStudy, institution } = experience;

    // shape of type changed at some point from string to object. this is a imperfect solution.
    let educationType;
    if (typeof type !== "string") {
      educationType =
        type?.value === EducationType.Other
          ? intl.formatMessage({
              defaultMessage: "Other type of education",
              id: "wrKBLf",
              description:
                "First part of education experience title for other type",
            })
          : getLocalizedName(type?.label, intl);
      return intl.formatMessage(
        html
          ? experienceMessages.educationAtHtml
          : experienceMessages.educationAt,
        {
          educationType,
          areaOfStudy,
          institution,
        },
      );
    } else {
      return intl.formatMessage(
        html
          ? experienceMessages.educationAtWithoutTypeHtml
          : experienceMessages.educationAtWithoutType,
        {
          educationType,
          areaOfStudy,
          institution,
        },
      );
    }
  }

  if (isWorkExperience(experience)) {
    const { role, organization, employmentCategory, department, cafForce } =
      experience;
    switch (employmentCategory?.value) {
      case EmploymentCategory.ExternalOrganization:
        return intl.formatMessage(
          html ? experienceMessages.workWithHtml : experienceMessages.workWith,
          {
            role,
            group: organization,
          },
        );
      case EmploymentCategory.GovernmentOfCanada:
        return intl.formatMessage(
          html ? experienceMessages.workWithHtml : experienceMessages.workWith,
          {
            role,
            group: getLocalizedName(department?.name, intl),
          },
        );
      case EmploymentCategory.CanadianArmedForces:
        return intl.formatMessage(
          html ? experienceMessages.workWithHtml : experienceMessages.workWith,
          {
            role,
            group: getLocalizedName(cafForce?.label, intl),
          },
        );
      default:
        return intl.formatMessage(
          html ? experienceMessages.workAtHtml : experienceMessages.workAt,
          {
            role,
            organization,
          },
        );
    }
  }

  // We should never get here but just in case we do, return no provided
  return intl.formatMessage(commonMessages.notProvided);
};

/**
 * Get the formatted date of any experience type
 *
 * @param {AnyExperience} experience
 * @param {IntlShape} intl
 * @return {string|ReactNode}
 */
export const getExperienceDate = (
  experience: AnyExperience,
  intl: IntlShape,
): undefined | ReactNode => {
  let dateString;
  if (!experience) {
    return dateString;
  }

  if (isAwardExperience(experience)) {
    return experience.awardedDate
      ? formattedDate(experience.awardedDate, intl)
      : undefined;
  }

  const { startDate, endDate } = experience;

  if (isWorkExperience(experience)) {
    const isIndeterminate =
      experience.govEmploymentType?.value === GovEmployeeType.Indeterminate;
    const indeterminateActing =
      isIndeterminate &&
      experience.govPositionType?.value === GovPositionType.Acting;
    const indeterminateAssignment =
      isIndeterminate &&
      experience.govPositionType?.value === GovPositionType.Assignment;
    const indeterminateSecondment =
      isIndeterminate &&
      experience.govPositionType?.value === GovPositionType.Secondment;

    const todayDate = strToFormDate(new Date().toISOString());
    const expectedEndDate =
      endDate &&
      endDate >= todayDate &&
      (experience.govEmploymentType?.value === GovEmployeeType.Student ||
        experience.govEmploymentType?.value === GovEmployeeType.Casual ||
        experience.govEmploymentType?.value === GovEmployeeType.Term ||
        indeterminateActing ||
        indeterminateAssignment ||
        indeterminateSecondment);

    return expectedEndDate
      ? `${getDateRange({ startDate, endDate, intl })} (${getExperienceFormLabels(intl, "work").expectedEndDate})`
      : getDateRange({ startDate, endDate, intl });
  }

  return getDateRange({ startDate, endDate, intl });
};

interface ExperienceInfo {
  title: string;
  titleHtml: ReactNode;
  editPath?: string;
  typeMessage: ReactNode;
  icon: IconType;
  date?: ReactNode;
}

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
  const paths = useRoutes();
  const experienceType = deriveExperienceType(experience);
  const defaults = {
    title: intl.formatMessage(commonMessages.notProvided).toString(),
    titleHtml: intl.formatMessage(commonMessages.notProvided),
    typeMessage: intl.formatMessage(experienceMessages.unknown),
    icon: InformationCircleIcon,
  };

  if (!experienceType) return defaults;

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
    title: nodeToString(getExperienceName(experience, intl)) ?? defaults.title,
    titleHtml: getExperienceName(experience, intl, true),
    editPath: paths.editExperience(experience.id),
    typeMessage: typeMessages.get(experienceType) ?? defaults.typeMessage,
    icon: icons.get(experienceType) ?? defaults.icon,
    date: getExperienceDate(experience, intl),
  };
};

/**
 * Returns a unique array of organization or similar names pulled from all experiences except personal
 *
 * @param experiences SimpleAnyExperience
 * @return string[]
 */
export const organizationSuggestionsFromExperiences = (
  experiences: SimpleAnyExperience[],
): string[] => {
  const experiencesWithoutPersonal = experiences.filter(
    (exp) => exp?.__typename && exp.__typename !== "PersonalExperience",
  );
  const organizationsForAutocomplete = experiencesWithoutPersonal.map((exp) => {
    if (isAwardExperience(exp)) {
      return exp.issuedBy;
    }
    if (isCommunityExperience(exp)) {
      return exp.organization;
    }
    if (isEducationExperience(exp)) {
      return exp.institution;
    }
    if (isWorkExperience(exp)) {
      return exp.organization;
    }
    return undefined;
  });
  const organizationsForAutocompleteFiltered: string[] = unpackMaybes(
    organizationsForAutocomplete,
  );

  return uniqueItems(organizationsForAutocompleteFiltered);
};

export const experienceDurationMonths = (experience: AnyExperience): number => {
  if (experience.__typename == null || experience.__typename == undefined) {
    return 0;
  }
  if (isAwardExperience(experience)) {
    // award experiences don't have a date range
    return 0;
  }
  if (
    isCommunityExperience(experience) ||
    isEducationExperience(experience) ||
    isPersonalExperience(experience) ||
    isWorkExperience(experience)
  ) {
    // if missing start date, we can't do anything with it
    if (empty(experience.startDate)) {
      defaultLogger.warning(
        "Tried to get the duration of an experience with no start date",
      );
      return 0;
    }

    const startDate = parseISO(experience.startDate);
    const endDate =
      !empty(experience.endDate) && isPast(experience.endDate)
        ? parseISO(experience.endDate)
        : new Date().toLocaleDateString(); // if end date is unknown or in the future, calculate duration based on ending today

    const completeMonths = differenceInMonths(endDate, startDate);
    // add an extra month to account for the final, incomplete month
    const ceilingMonths = completeMonths + 1;

    return ceilingMonths;
  }
  assertUnreachable(experience);
  return 0;
};

export const experiencesDurationMonths = (
  experiences: AnyExperience[],
): number =>
  experiences
    .map((experience) => experienceDurationMonths(experience))
    .reduce((acc, months) => acc + months, 0);

export interface SnapshotExperience extends Omit<AnyExperience, "user"> {
  __typename?: AnyExperience["__typename"];
}
