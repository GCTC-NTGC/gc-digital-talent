import { IntlShape } from "react-intl";

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
  commonMessages,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  Maybe,
  PoolCandidate,
  PositionDuration,
  Pool,
} from "@gc-digital-talent/graphql";

import {
  yesOrNo,
  employeeTypeToString,
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
      educationRequirementOption,
      educationRequirementExperiences,
      generalQuestionResponses,
      user,
      pool: poolAd,
    }) => {
      const locale = getLocale(intl);
      const poolSkills =
        poolAd.essentialSkills && poolAd.nonessentialSkills
          ? [...poolAd.essentialSkills, ...poolAd.nonessentialSkills]
          : [];
      return {
        status: status
          ? intl.formatMessage(getPoolCandidateStatus(status as string))
          : "",
        priority: user.priorityWeight
          ? intl.formatMessage(getPoolCandidatePriorities(user.priorityWeight))
          : "",
        notes: sanitizeCSVString(notes),
        dateReceived: submittedAt || "",
        expiryDate: expiryDate || "",
        archivedAt: archivedAt || "",
        firstName: sanitizeCSVString(user.firstName),
        lastName: sanitizeCSVString(user.lastName),
        email: sanitizeCSVString(user.email),
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
          ? intl.formatMessage(getBilingualEvaluation(user.bilingualEvaluation))
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
        priorityNumber: sanitizeCSVString(user.priorityNumber),
        department: getLocalizedName(user.department?.name, intl, true),
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
  pool?: Maybe<Pool>,
): DownloadCsvProps["headers"] => {
  const essentialSkillHeaders = pool?.essentialSkills
    ? pool.essentialSkills.map((skill) => {
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
      })
    : [];
  const nonEssentialSkillHeaders = pool?.nonessentialSkills
    ? pool.nonessentialSkills.map((skill) => {
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
      })
    : [];

  const generalQuestionHeaders = pool?.generalQuestions
    ? pool.generalQuestions.filter(notEmpty).map((generalQuestion, index) => ({
        id: generalQuestion.id,
        displayName: intl.formatMessage(
          {
            defaultMessage: "Screening question {index}: {question}",
            id: "5nlauT",
            description: "CSV Header, Screening question column. ",
          },
          {
            index: generalQuestion.sortOrder || index + 1,
            question: getLocalizedName(generalQuestion.question, intl),
          },
        ),
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
      id: "bilingualEvaluation",
      displayName: intl.formatMessage({
        defaultMessage: "Bilingual Evaluation",
        id: "M9ij/0",
        description: "CSV Header, Bilingual Evaluation column",
      }),
    },
    {
      id: "comprehensionLevel",
      displayName: intl.formatMessage({
        defaultMessage: "Reading level",
        id: "CEFnPm",
        description: "CSV Header, Reading (comprehension) Level column",
      }),
    },
    {
      id: "writtenLevel",
      displayName: intl.formatMessage({
        defaultMessage: "Writing level",
        id: "8ea9ne",
        description: "CSV Header, Writing Level column",
      }),
    },
    {
      id: "verbalLevel",
      displayName: intl.formatMessage({
        defaultMessage: "Oral interaction level",
        id: "5nrkKw",
        description: "CSV Header, Oral interaction Level column",
      }),
    },
    {
      id: "estimatedLanguageAbility",
      displayName: intl.formatMessage({
        defaultMessage: "Estimated Language Ability",
        id: "nRtrPx",
        description: "CSV Header, Estimated Language Ability column",
      }),
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
      displayName: intl.formatMessage({
        defaultMessage: "Education Requirement",
        id: "eVuqmU",
        description: "CSV Header, Education Requirement column",
      }),
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
