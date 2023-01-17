import React from "react";
import { useIntl } from "react-intl";
import type { DownloadCsvProps } from "@common/components/Link";
import {
  employeeTypeToString,
  flattenExperiencesToSkills,
  getExpectedClassifications,
  getLocationPreference,
  getLookingForLanguage,
  getOperationalRequirements,
  yesOrNo,
} from "@common/helpers/csvUtils";
import {
  getArmedForcesStatusesAdmin,
  getBilingualEvaluation,
  getCitizenshipStatusesAdmin,
  getLanguageProficiency,
} from "@common/constants/localizedConstants";
import { getLocale } from "@common/helpers/localize";
import { Applicant, PositionDuration } from "../../api/generated";

const useUserCsvData = (applicants: Applicant[]) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const headers: DownloadCsvProps["headers"] = [
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
      key: "language",
      label: intl.formatMessage({
        defaultMessage: "Language",
        id: "Q/clLF",
        description: "CSV Header, Language column",
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
        defaultMessage: "Comprehension Level",
        id: "QIh0q7",
        description: "CSV Header, Comprehension Level column",
      }),
    },
    {
      key: "writtenLevel",
      label: intl.formatMessage({
        defaultMessage: "Written Level",
        id: "w/v77x",
        description: "CSV Header, Written Level column",
      }),
    },
    {
      key: "verbalLevel",
      label: intl.formatMessage({
        defaultMessage: "Verbal Level",
        id: "5R2iR2",
        description: "CSV Header, Verbal Level column",
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
      key: "isIndigenous",
      label: intl.formatMessage({
        defaultMessage: "Indigenous",
        id: "83v9YH",
        description: "CSV Header, Indigenous column",
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
      key: "expectedClassification",
      label: intl.formatMessage({
        defaultMessage: "Role/Salary Expectation",
        id: "iIZS1K",
        description: "CSV Header, Role/Salary Expectation column",
      }),
    },
    {
      key: "skills",
      label: intl.formatMessage({
        defaultMessage: "Skills",
        id: "3IAJad",
        description: "CSV Header, Skills column",
      }),
    },
  ];

  const data: DownloadCsvProps["data"] = React.useMemo(() => {
    const flattenedApplicants: DownloadCsvProps["data"] = applicants.map(
      ({
        firstName,
        lastName,
        armedForcesStatus,
        citizenship,
        lookingForEnglish,
        lookingForFrench,
        lookingForBilingual,
        bilingualEvaluation,
        comprehensionLevel,
        writtenLevel,
        verbalLevel,
        estimatedLanguageAbility,
        isGovEmployee,
        hasPriorityEntitlement,
        priorityNumber,
        department,
        govEmployeeType,
        currentClassification,
        locationPreferences,
        locationExemptions,
        positionDuration,
        acceptedOperationalRequirements,
        isWoman,
        isIndigenous,
        isVisibleMinority,
        hasDisability,
        expectedGenericJobTitles,
        experiences,
      }) => ({
        firstName: firstName || "",
        lastName: lastName || "",
        armedForcesStatus: armedForcesStatus
          ? intl.formatMessage(getArmedForcesStatusesAdmin(armedForcesStatus))
          : "",
        citizenship: citizenship
          ? intl.formatMessage(getCitizenshipStatusesAdmin(citizenship))
          : "",
        language: getLookingForLanguage(
          lookingForEnglish,
          lookingForFrench,
          lookingForBilingual,
          intl,
        ),
        bilingualEvaluation: bilingualEvaluation
          ? intl.formatMessage(getBilingualEvaluation(bilingualEvaluation))
          : "",
        comprehensionLevel: comprehensionLevel || "",
        writtenLevel: writtenLevel || "",
        verbalLevel: verbalLevel || "",
        estimatedLanguageAbility: estimatedLanguageAbility
          ? intl.formatMessage(getLanguageProficiency(estimatedLanguageAbility))
          : "",
        isGovEmployee: yesOrNo(isGovEmployee, intl),
        hasPriorityEntitlement: yesOrNo(hasPriorityEntitlement, intl),
        priorityNumber: priorityNumber || "",
        department: department?.name[locale] || "",
        govEmployeeType: govEmployeeType
          ? employeeTypeToString(govEmployeeType, intl)
          : "",
        currentClassification: currentClassification
          ? `${currentClassification.group}-${currentClassification.level}`
          : "",
        locationPreferences: getLocationPreference(locationPreferences, intl),
        locationExemptions: locationExemptions || "",
        wouldAcceptTemporary: yesOrNo(
          positionDuration?.includes(PositionDuration.Temporary),
          intl,
        ),
        acceptedOperationalRequirements: getOperationalRequirements(
          acceptedOperationalRequirements,
          intl,
        ),
        isWoman: yesOrNo(isWoman, intl),
        isIndigenous: yesOrNo(isIndigenous, intl),
        isVisibleMinority: yesOrNo(isVisibleMinority, intl),
        hasDisability: yesOrNo(hasDisability, intl),
        expectedClassification: getExpectedClassifications(
          expectedGenericJobTitles,
          intl,
        ),
        skills: flattenExperiencesToSkills(experiences, locale),
      }),
    );

    return flattenedApplicants;
  }, [applicants, intl, locale]);

  return { headers, data };
};

export default useUserCsvData;
