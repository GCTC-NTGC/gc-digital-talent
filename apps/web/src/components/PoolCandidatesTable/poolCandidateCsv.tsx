import { IntlShape } from "react-intl";

import { DownloadCsvProps } from "@gc-digital-talent/ui";
import {
  getLocale,
  getEducationRequirementOption,
  getLocalizedName,
  commonMessages,
} from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  Maybe,
  PoolCandidate,
  PositionDuration,
  Pool,
  PoolSkillType,
} from "@gc-digital-talent/graphql";

import {
  yesOrNo,
  getLocationPreference,
  getOperationalRequirements,
  flattenExperiencesToSkills,
  skillKeyAndJustifications,
  getExperienceTitles,
  getGeneralQuestionResponses,
  getIndigenousCommunities,
  sanitizeCSVString,
} from "~/utils/csvUtils";
import adminMessages from "~/messages/adminMessages";
import processMessages from "~/messages/processMessages";
import { groupPoolSkillByType, poolSkillsToSkills } from "~/utils/skillUtils";

import { getLabels } from "../Profile/components/LanguageProfile/utils";

export const getPoolCandidateCsvData = (
  candidates: PoolCandidate[],
  intl: IntlShape,
) => {
  const data: DownloadCsvProps["data"] = candidates.map(
    ({
      status,
      notes,
      submittedAt,
      archivedAt,
      expiryDate,
      suspendedAt,
      educationRequirementOption,
      educationRequirementExperiences,
      generalQuestionResponses,
      user,
      pool: poolAd,
    }) => {
      const locale = getLocale(intl);
      const poolSkills = poolSkillsToSkills(poolAd.poolSkills);

      return {
        status: getLocalizedName(status?.label, intl, true),
        priority: getLocalizedName(user.priority?.label, intl, true),
        availability: suspendedAt
          ? intl.formatMessage({
              defaultMessage: "Inactive",
              id: "u5UAJn",
              description: "Status message if the application is suspended",
            })
          : intl.formatMessage({
              defaultMessage: "Active",
              id: "4L9rHO",
              description: "Status message if the application is not suspended",
            }),
        notes: sanitizeCSVString(notes),
        dateReceived: submittedAt || "",
        expiryDate: expiryDate || "",
        archivedAt: archivedAt || "",
        firstName: sanitizeCSVString(user.firstName),
        lastName: sanitizeCSVString(user.lastName),
        email: sanitizeCSVString(user.email),
        preferredCommunicationLanguage: getLocalizedName(
          user.preferredLang?.label,
          intl,
          true,
        ),
        preferredLanguageForInterview: getLocalizedName(
          user.preferredLanguageForInterview?.label,
          intl,
          true,
        ),
        preferredLanguageForExam: getLocalizedName(
          user.preferredLanguageForExam?.label,
          intl,
          true,
        ),
        currentCity: user.currentCity || "",
        currentProvince: getLocalizedName(
          user.currentProvince?.label,
          intl,
          true,
        ),
        armedForcesStatus: getLocalizedName(
          user.armedForcesStatus?.label,
          intl,
          true,
        ),
        citizenship: getLocalizedName(user.citizenship?.label, intl, true),
        comprehensionLevel: getLocalizedName(
          user.comprehensionLevel?.label,
          intl,
          true,
        ),
        firstOfficialLanguage: getLocalizedName(
          user.firstOfficialLanguage?.label,
          intl,
          true,
        ),
        secondLanguageExamCompleted: yesOrNo(
          user.secondLanguageExamCompleted,
          intl,
        ),
        secondLanguageExamValidity: yesOrNo(
          user.secondLanguageExamValidity,
          intl,
        ),
        writtenLevel: getLocalizedName(user.writtenLevel?.label, intl, true),
        verbalLevel: getLocalizedName(user.verbalLevel?.label, intl, true),
        estimatedLanguageAbility: getLocalizedName(
          user.estimatedLanguageAbility?.label,
          intl,
          true,
        ),
        isGovEmployee: yesOrNo(user.isGovEmployee, intl),
        hasPriorityEntitlement: yesOrNo(user.hasPriorityEntitlement, intl),
        priorityNumber: sanitizeCSVString(user.priorityNumber),
        department: getLocalizedName(user.department?.name, intl, true),
        govEmployeeType: getLocalizedName(
          user.govEmployeeType?.label,
          intl,
          true,
        ),
        currentClassification: user.currentClassification
          ? `${user.currentClassification.group}-${user.currentClassification.level}`
          : "",
        locationPreferences: getLocationPreference(
          user.locationPreferences,
          intl,
        ),
        locationExemptions: sanitizeCSVString(user.locationExemptions),
        wouldAcceptTemporary: yesOrNo(
          user.positionDuration?.includes(PositionDuration.Temporary),
          intl,
        ),
        acceptedOperationalRequirements: getOperationalRequirements(
          user.acceptedOperationalRequirements,
          intl,
        ),
        isWoman: yesOrNo(user.isWoman, intl),
        indigenousCommunities: getIndigenousCommunities(
          user.indigenousCommunities,
          intl,
        ),
        isVisibleMinority: yesOrNo(user.isVisibleMinority, intl),
        hasDisability: yesOrNo(user.hasDisability, intl),
        educationRequirementOption: educationRequirementOption?.value
          ? intl.formatMessage(
              getEducationRequirementOption(
                educationRequirementOption.value,
                user.currentClassification?.group,
              ),
            )
          : "",
        educationRequirementExperiences: getExperienceTitles(
          educationRequirementExperiences,
          intl,
        ),
        ...getGeneralQuestionResponses(generalQuestionResponses),
        skills: flattenExperiencesToSkills(user.experiences, locale),
        ...skillKeyAndJustifications(user.experiences, poolSkills || [], intl),
      };
    },
  );

  return data;
};

export const getPoolCandidateCsvHeaders = (
  intl: IntlShape,
  pool?: Maybe<Pick<Pool, "poolSkills" | "generalQuestions">>,
): DownloadCsvProps["headers"] => {
  const poolSkills = groupPoolSkillByType(unpackMaybes(pool?.poolSkills));
  const essentialSkillHeaders =
    poolSkills.get(PoolSkillType.Essential)?.map((skill) => {
      return {
        id: skill.key,
        displayName: intl.formatMessage(
          {
            defaultMessage: "{skillName} (Essential)",
            id: "nsm/uC",
            description: "CSV Header, Essential skill column.",
          },
          { skillName: getLocalizedName(skill.name, intl) },
        ),
      };
    }) ?? [];
  const nonEssentialSkillHeaders =
    poolSkills.get(PoolSkillType.Nonessential)?.map((skill) => {
      return {
        id: skill.key,
        displayName: intl.formatMessage(
          {
            defaultMessage: "{skillName} (Asset)",
            id: "exYii8",
            description: "CSV Header, Asset skill column.",
          },
          { skillName: getLocalizedName(skill.name, intl) },
        ),
      };
    }) ?? [];

  const generalQuestionHeaders = pool?.generalQuestions
    ? pool.generalQuestions.filter(notEmpty).map((generalQuestion, index) => ({
        id: generalQuestion.id,
        displayName: `${intl.formatMessage(
          {
            defaultMessage: "General question {index}",
            id: "EWvBgF",
            description: "CSV Header, general question column. ",
          },
          {
            index: generalQuestion.sortOrder || index + 1,
          },
        )}${intl.formatMessage(commonMessages.dividingColon)}${getLocalizedName(generalQuestion.question, intl)}`,
      }))
    : [];

  return [
    {
      id: "status",
      displayName: intl.formatMessage(commonMessages.status),
    },
    {
      id: "priority",
      displayName: intl.formatMessage(adminMessages.category),
    },
    {
      id: "availability",
      displayName: intl.formatMessage({
        defaultMessage: "Availability",
        id: "l62TJM",
        description: "CSV Header, Availability column",
      }),
    },
    {
      id: "notes",
      displayName: intl.formatMessage(adminMessages.notes),
    },
    {
      id: "currentProvince",
      displayName: intl.formatMessage({
        defaultMessage: "Current Province",
        id: "Xo0M3N",
        description: "CSV Header, Current Province column",
      }),
    },
    {
      id: "dateReceived",
      displayName: intl.formatMessage({
        defaultMessage: "Date Received",
        id: "j9m5qA",
        description: "CSV Header, Date Received column",
      }),
    },
    {
      id: "expiryDate",
      displayName: intl.formatMessage({
        defaultMessage: "Expiry Date",
        id: "BNEY8G",
        description: "CSV Header, Expiry Date column",
      }),
    },
    {
      id: "archivedAt",
      displayName: intl.formatMessage({
        defaultMessage: "Archival Date",
        id: "nxsvto",
        description: "CSV Header, Archival Date column",
      }),
    },
    {
      id: "firstName",
      displayName: intl.formatMessage({
        defaultMessage: "First Name",
        id: "ukL9do",
        description: "CSV Header, First Name column",
      }),
    },
    {
      id: "lastName",
      displayName: intl.formatMessage({
        defaultMessage: "Last Name",
        id: "DlBusi",
        description: "CSV Header, Last Name column",
      }),
    },
    {
      id: "email",
      displayName: intl.formatMessage(commonMessages.email),
    },
    {
      id: "preferredCommunicationLanguage",
      displayName: intl.formatMessage(
        commonMessages.preferredCommunicationLanguage,
      ),
    },
    {
      id: "preferredLanguageForInterview",
      displayName: intl.formatMessage({
        defaultMessage: "Preferred spoken interview language",
        id: "DB9pFd",
        description: "Title for preferred spoken interview language",
      }),
    },
    {
      id: "preferredLanguageForExam",
      displayName: intl.formatMessage({
        defaultMessage: "Preferred written exam language",
        id: "fg2wla",
        description: "Title for preferred written exam language",
      }),
    },
    {
      id: "currentCity",
      displayName: intl.formatMessage({
        defaultMessage: "Current City",
        id: "CLOuJF",
        description: "CSV Header, Current City column",
      }),
    },
    {
      id: "armedForcesStatus",
      displayName: intl.formatMessage({
        defaultMessage: "Armed Forces Status",
        id: "A1QU9O",
        description: "CSV Header, Armed Forces column",
      }),
    },
    {
      id: "citizenship",
      displayName: intl.formatMessage({
        defaultMessage: "Citizenship",
        id: "FWftu5",
        description: "CSV Header, Citizenship column",
      }),
    },
    {
      id: "firstOfficialLanguage",
      displayName: intl.formatMessage({
        defaultMessage: "First official language",
        id: "tK7cGP",
        description: "CSV Header, first official language column",
      }),
    },
    {
      id: "secondLanguageExamCompleted",
      displayName: intl.formatMessage({
        defaultMessage:
          "I have completed a Public Service Commission evaluation of my second official language.",
        id: "pXLPjN",
        description:
          "Statement for completion of a Public Service Commission evaluation of a second official language",
      }),
    },
    {
      id: "secondLanguageExamValidity",
      displayName: getLabels(intl).secondLanguageExamValidityLabel,
    },
    {
      id: "comprehensionLevel",
      displayName: getLabels(intl).comprehensionLevel,
    },
    {
      id: "writtenLevel",
      displayName: getLabels(intl).writtenLevel,
    },
    {
      id: "verbalLevel",
      displayName: getLabels(intl).verbalLevel,
    },
    {
      id: "estimatedLanguageAbility",
      displayName: getLabels(intl).estimatedLanguageAbility,
    },
    {
      id: "isGovEmployee",
      displayName: intl.formatMessage({
        defaultMessage: "Government Employee",
        id: "DHfumB",
        description: "CSV Header, Government Employee column",
      }),
    },
    {
      id: "department",
      displayName: intl.formatMessage(commonMessages.department),
    },
    {
      id: "govEmployeeType",
      displayName: intl.formatMessage({
        defaultMessage: "Employee Type",
        id: "DwTEsB",
        description: "CSV Header, Employee Type column",
      }),
    },
    {
      id: "currentClassification",
      displayName: intl.formatMessage({
        defaultMessage: "Current Classification",
        id: "hMRpmG",
        description: "CSV Header, Current Classification column",
      }),
    },
    {
      id: "hasPriorityEntitlement",
      displayName: intl.formatMessage({
        defaultMessage: "Priority Entitlement",
        id: "h9dLBX",
        description: "CSV Header, Priority Entitlement column",
      }),
    },
    {
      id: "priorityNumber",
      displayName: intl.formatMessage({
        defaultMessage: "Priority Number",
        id: "gKXZaj",
        description: "CSV Header, Priority Number column",
      }),
    },
    {
      id: "locationPreferences",
      displayName: intl.formatMessage({
        defaultMessage: "Location Preferences",
        id: "114gjj",
        description: "CSV Header, Location Preferences column",
      }),
    },
    {
      id: "locationExemptions",
      displayName: intl.formatMessage({
        defaultMessage: "Location Exemptions",
        id: "8mt/5/",
        description: "CSV Header, Location Exemptions column",
      }),
    },
    {
      id: "wouldAcceptTemporary",
      displayName: intl.formatMessage({
        defaultMessage: "Accept Temporary",
        id: "eCK3Ng",
        description: "CSV Header, Accept Temporary column",
      }),
    },
    {
      id: "acceptedOperationalRequirements",
      displayName: intl.formatMessage({
        defaultMessage: "Accepted Operation Requirements",
        id: "qs/dFw",
        description: "CSV Header, Accepted Operation Requirements column",
      }),
    },
    {
      id: "isWoman",
      displayName: intl.formatMessage({
        defaultMessage: "Woman",
        id: "aGaaPi",
        description: "CSV Header, Woman column",
      }),
    },
    {
      id: "indigenousCommunities",
      displayName: intl.formatMessage({
        defaultMessage: "Indigenous",
        id: "YoIRbn",
        description: "Title for Indigenous",
      }),
    },
    {
      id: "isVisibleMinority",
      displayName: intl.formatMessage({
        defaultMessage: "Visible Minority",
        id: "1vVbe3",
        description: "CSV Header, Visible Minority column",
      }),
    },
    {
      id: "hasDisability",
      displayName: intl.formatMessage({
        defaultMessage: "Disabled",
        id: "AijsNM",
        description: "CSV Header, Disabled column",
      }),
    },
    {
      id: "educationRequirementOption",
      displayName: intl.formatMessage(processMessages.educationRequirement),
    },
    {
      id: "educationRequirementExperiences",
      displayName: intl.formatMessage({
        defaultMessage: "Education Requirement Experiences",
        id: "VldclB",
        description: "CSV Header, Education Requirement Experiences column",
      }),
    },
    ...generalQuestionHeaders,
    {
      id: "skills",
      displayName: intl.formatMessage(adminMessages.skills),
    },
    ...essentialSkillHeaders,
    ...nonEssentialSkillHeaders,
  ];
};
