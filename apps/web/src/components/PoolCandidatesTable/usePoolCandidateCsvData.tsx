import React from "react";
import { useIntl } from "react-intl";

import { DownloadCsvProps } from "@gc-digital-talent/ui";
import {
  getArmedForcesStatusesAdmin,
  getBilingualEvaluation,
  getCitizenshipStatusesAdmin,
  getLanguage,
  getLanguageProficiency,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
  getLocale,
  getEducationRequirementOption,
  getLocalizedName,
  getEvaluatedLanguageAbility,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import {
  yesOrNo,
  employeeTypeToString,
  getLocationPreference,
  getOperationalRequirements,
  flattenExperiencesToSkills,
  skillKeyAndJustifications,
  getExperienceTitles,
  getScreeningQuestionResponses,
  getIndigenousCommunities,
} from "~/utils/csvUtils";
import { Maybe, PoolCandidate, PositionDuration, Pool } from "~/api/generated";
import adminMessages from "~/messages/adminMessages";

const usePoolCandidateCsvData = (
  candidates: PoolCandidate[],
  pool:
    | Maybe<
        Pick<
          Pool,
          "essentialSkills" | "nonessentialSkills" | "screeningQuestions"
        >
      >
    | undefined,
) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const essentialSkillHeaders = pool?.essentialSkills
    ? pool.essentialSkills.map((skill) => {
        return {
          key: skill.key,
          label: intl.formatMessage(
            {
              defaultMessage: "{skillName} (Essential)",
              id: "nsm/uC",
              description: "CSV Header, Essential skill column.",
            },
            { skillName: skill.name[locale] },
          ),
        };
      })
    : [];
  const nonEssentialSkillHeaders = pool?.nonessentialSkills
    ? pool.nonessentialSkills.map((skill) => {
        return {
          key: skill.key,
          label: intl.formatMessage(
            {
              defaultMessage: "{skillName} (Asset)",
              id: "exYii8",
              description: "CSV Header, Asset skill column.",
            },
            { skillName: skill.name[locale] },
          ),
        };
      })
    : [];

  const screeningQuestionHeaders = pool?.screeningQuestions
    ? pool.screeningQuestions
        .filter(notEmpty)
        .map((screeningQuestion, index) => ({
          key: screeningQuestion.id,
          label: intl.formatMessage(
            {
              defaultMessage: "Screening question {index}: {question}",
              id: "5nlauT",
              description: "CSV Header, Screening question column. ",
            },
            {
              index: screeningQuestion.sortOrder || index + 1,
              question: getLocalizedName(screeningQuestion.question, intl),
            },
          ),
        }))
    : [];

  const headers: DownloadCsvProps["headers"] = [
    {
      key: "status",
      label: intl.formatMessage({
        defaultMessage: "Status",
        id: "C0ABZu",
        description: "CSV Header, Status column",
      }),
    },
    {
      key: "priority",
      label: intl.formatMessage({
        defaultMessage: "Category",
        id: "o9B983",
        description: "CSV Header, Priority column",
      }),
    },
    {
      key: "availability",
      label: intl.formatMessage({
        defaultMessage: "Availability",
        id: "l62TJM",
        description: "CSV Header, Availability column",
      }),
    },
    {
      key: "notes",
      label: intl.formatMessage(adminMessages.notes),
    },
    {
      key: "currentProvince",
      label: intl.formatMessage({
        defaultMessage: "Current Province",
        id: "Xo0M3N",
        description: "CSV Header, Current Province column",
      }),
    },
    {
      key: "dateReceived",
      label: intl.formatMessage({
        defaultMessage: "Date Received",
        id: "j9m5qA",
        description: "CSV Header, Date Received column",
      }),
    },
    {
      key: "expiryDate",
      label: intl.formatMessage({
        defaultMessage: "Expiry Date",
        id: "BNEY8G",
        description: "CSV Header, Expiry Date column",
      }),
    },
    {
      key: "archivedAt",
      label: intl.formatMessage({
        defaultMessage: "Archival Date",
        id: "nxsvto",
        description: "CSV Header, Archival Date column",
      }),
    },
    {
      key: "firstName",
      label: intl.formatMessage({
        defaultMessage: "First Name",
        id: "ukL9do",
        description: "CSV Header, First Name column",
      }),
    },
    {
      key: "lastName",
      label: intl.formatMessage({
        defaultMessage: "Last Name",
        id: "DlBusi",
        description: "CSV Header, Last Name column",
      }),
    },
    {
      key: "email",
      label: intl.formatMessage({
        defaultMessage: "Email",
        id: "H02JZe",
        description: "CSV Header, Email column",
      }),
    },
    {
      key: "preferredCommunicationLanguage",
      label: intl.formatMessage({
        defaultMessage: "Preferred Communication Language",
        id: "d9OIGt",
        description: "CSV Header, Preferred Communication Language column",
      }),
    },
    {
      key: "preferredLanguageForInterview",
      label: intl.formatMessage({
        defaultMessage: "Preferred spoken interview language",
        id: "DB9pFd",
        description: "Title for preferred spoken interview language",
      }),
    },
    {
      key: "preferredLanguageForExam",
      label: intl.formatMessage({
        defaultMessage: "Preferred written exam language",
        id: "fg2wla",
        description: "Title for preferred written exam language",
      }),
    },
    {
      key: "currentCity",
      label: intl.formatMessage({
        defaultMessage: "Current City",
        id: "CLOuJF",
        description: "CSV Header, Current City column",
      }),
    },
    {
      key: "armedForcesStatus",
      label: intl.formatMessage({
        defaultMessage: "Armed Forces Status",
        id: "A1QU9O",
        description: "CSV Header, Armed Forces column",
      }),
    },
    {
      key: "citizenship",
      label: intl.formatMessage({
        defaultMessage: "Citizenship",
        id: "FWftu5",
        description: "CSV Header, Citizenship column",
      }),
    },
    {
      key: "bilingualEvaluation",
      label: intl.formatMessage({
        defaultMessage: "Bilingual Evaluation",
        id: "M9ij/0",
        description: "CSV Header, Bilingual Evaluation column",
      }),
    },
    {
      key: "comprehensionLevel",
      label: intl.formatMessage({
        defaultMessage: "Reading level",
        id: "CEFnPm",
        description: "CSV Header, Reading (comprehension) Level column",
      }),
    },
    {
      key: "writtenLevel",
      label: intl.formatMessage({
        defaultMessage: "Writing level",
        id: "8ea9ne",
        description: "CSV Header, Writing Level column",
      }),
    },
    {
      key: "verbalLevel",
      label: intl.formatMessage({
        defaultMessage: "Oral interaction level",
        id: "5nrkKw",
        description: "CSV Header, Oral interaction Level column",
      }),
    },
    {
      key: "estimatedLanguageAbility",
      label: intl.formatMessage({
        defaultMessage: "Estimated Language Ability",
        id: "nRtrPx",
        description: "CSV Header, Estimated Language Ability column",
      }),
    },
    {
      key: "isGovEmployee",
      label: intl.formatMessage({
        defaultMessage: "Government Employee",
        id: "DHfumB",
        description: "CSV Header, Government Employee column",
      }),
    },
    {
      key: "department",
      label: intl.formatMessage({
        defaultMessage: "Department",
        id: "oCX5SP",
        description: "CSV Header, Department column",
      }),
    },
    {
      key: "govEmployeeType",
      label: intl.formatMessage({
        defaultMessage: "Employee Type",
        id: "DwTEsB",
        description: "CSV Header, Employee Type column",
      }),
    },
    {
      key: "currentClassification",
      label: intl.formatMessage({
        defaultMessage: "Current Classification",
        id: "hMRpmG",
        description: "CSV Header, Current Classification column",
      }),
    },
    {
      key: "hasPriorityEntitlement",
      label: intl.formatMessage({
        defaultMessage: "Priority Entitlement",
        id: "h9dLBX",
        description: "CSV Header, Priority Entitlement column",
      }),
    },
    {
      key: "priorityNumber",
      label: intl.formatMessage({
        defaultMessage: "Priority Number",
        id: "gKXZaj",
        description: "CSV Header, Priority Number column",
      }),
    },
    {
      key: "locationPreferences",
      label: intl.formatMessage({
        defaultMessage: "Location Preferences",
        id: "114gjj",
        description: "CSV Header, Location Preferences column",
      }),
    },
    {
      key: "locationExemptions",
      label: intl.formatMessage({
        defaultMessage: "Location Exemptions",
        id: "8mt/5/",
        description: "CSV Header, Location Exemptions column",
      }),
    },
    {
      key: "wouldAcceptTemporary",
      label: intl.formatMessage({
        defaultMessage: "Accept Temporary",
        id: "eCK3Ng",
        description: "CSV Header, Accept Temporary column",
      }),
    },
    {
      key: "acceptedOperationalRequirements",
      label: intl.formatMessage({
        defaultMessage: "Accepted Operation Requirements",
        id: "qs/dFw",
        description: "CSV Header, Accepted Operation Requirements column",
      }),
    },
    {
      key: "isWoman",
      label: intl.formatMessage({
        defaultMessage: "Woman",
        id: "aGaaPi",
        description: "CSV Header, Woman column",
      }),
    },
    {
      key: "indigenousCommunities",
      label: intl.formatMessage({
        defaultMessage: "Indigenous",
        id: "YoIRbn",
        description: "Title for Indigenous",
      }),
    },
    {
      key: "isVisibleMinority",
      label: intl.formatMessage({
        defaultMessage: "Visible Minority",
        id: "1vVbe3",
        description: "CSV Header, Visible Minority column",
      }),
    },
    {
      key: "hasDisability",
      label: intl.formatMessage({
        defaultMessage: "Disabled",
        id: "AijsNM",
        description: "CSV Header, Disabled column",
      }),
    },
    {
      key: "educationRequirementOption",
      label: intl.formatMessage({
        defaultMessage: "Education Requirement",
        id: "eVuqmU",
        description: "CSV Header, Education Requirement column",
      }),
    },
    {
      key: "educationRequirementExperiences",
      label: intl.formatMessage({
        defaultMessage: "Education Requirement Experiences",
        id: "VldclB",
        description: "CSV Header, Education Requirement Experiences column",
      }),
    },
    ...screeningQuestionHeaders,
    {
      key: "skills",
      label: intl.formatMessage(adminMessages.skills),
    },
    ...essentialSkillHeaders,
    ...nonEssentialSkillHeaders,
  ];

  const data: DownloadCsvProps["data"] = React.useMemo(() => {
    const flattenedCandidates: DownloadCsvProps["data"] = candidates.map(
      ({
        status,
        notes,
        submittedAt,
        archivedAt,
        expiryDate,
        educationRequirementOption,
        educationRequirementExperiences,
        screeningQuestionResponses,
        user,
        pool: poolAd,
      }) => {
        const poolSkills =
          poolAd.essentialSkills && poolAd.nonessentialSkills
            ? [...poolAd.essentialSkills, ...poolAd.nonessentialSkills]
            : [];
        return {
          status: status
            ? intl.formatMessage(getPoolCandidateStatus(status as string))
            : "",
          priority: user.priorityWeight
            ? intl.formatMessage(
                getPoolCandidatePriorities(user.priorityWeight),
              )
            : "",
          notes: notes || "",
          dateReceived: submittedAt || "",
          expiryDate: expiryDate || "",
          archivedAt: archivedAt || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          preferredCommunicationLanguage: user.preferredLang
            ? intl.formatMessage(getLanguage(user.preferredLang as string))
            : "",
          preferredLanguageForInterview: user.preferredLanguageForInterview
            ? intl.formatMessage(
                getLanguage(user.preferredLanguageForInterview as string),
              )
            : "",
          preferredLanguageForExam: user.preferredLanguageForExam
            ? intl.formatMessage(
                getLanguage(user.preferredLanguageForExam as string),
              )
            : "",
          currentCity: user.currentCity || "",
          currentProvince: user.currentProvince
            ? intl.formatMessage(
                getProvinceOrTerritory(user.currentProvince as string),
              )
            : "",
          armedForcesStatus: user.armedForcesStatus
            ? intl.formatMessage(
                getArmedForcesStatusesAdmin(user.armedForcesStatus),
              )
            : "",
          citizenship: user.citizenship
            ? intl.formatMessage(getCitizenshipStatusesAdmin(user.citizenship))
            : "",
          bilingualEvaluation: user.bilingualEvaluation
            ? intl.formatMessage(
                getBilingualEvaluation(user.bilingualEvaluation),
              )
            : "",
          comprehensionLevel: user.comprehensionLevel
            ? intl.formatMessage(
                getEvaluatedLanguageAbility(user.comprehensionLevel),
              )
            : "",
          writtenLevel: user.writtenLevel
            ? intl.formatMessage(getEvaluatedLanguageAbility(user.writtenLevel))
            : "",
          verbalLevel: user.verbalLevel
            ? intl.formatMessage(getEvaluatedLanguageAbility(user.verbalLevel))
            : "",
          estimatedLanguageAbility: user.estimatedLanguageAbility
            ? intl.formatMessage(
                getLanguageProficiency(user.estimatedLanguageAbility),
              )
            : "",
          isGovEmployee: yesOrNo(user.isGovEmployee, intl),
          hasPriorityEntitlement: yesOrNo(user.hasPriorityEntitlement, intl),
          priorityNumber: user.priorityNumber || "",
          department: user.department?.name[locale] || "",
          govEmployeeType: user.govEmployeeType
            ? employeeTypeToString(user.govEmployeeType, intl)
            : "",
          currentClassification: user.currentClassification
            ? `${user.currentClassification.group}-${user.currentClassification.level}`
            : "",
          locationPreferences: getLocationPreference(
            user.locationPreferences,
            intl,
          ),
          locationExemptions: user.locationExemptions || "",
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
          educationRequirementOption: educationRequirementOption
            ? intl.formatMessage(
                getEducationRequirementOption(
                  educationRequirementOption,
                  user.currentClassification?.group,
                ),
              )
            : "",
          educationRequirementExperiences: getExperienceTitles(
            educationRequirementExperiences,
            intl,
          ),
          ...getScreeningQuestionResponses(screeningQuestionResponses),
          skills: flattenExperiencesToSkills(user.experiences, locale),
          ...skillKeyAndJustifications(
            user.experiences,
            poolSkills || [],
            intl,
          ),
        };
      },
    );

    return flattenedCandidates;
  }, [candidates, intl, locale]);

  return { headers, data };
};

export default usePoolCandidateCsvData;
