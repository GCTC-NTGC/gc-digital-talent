import React from "react";
import { useIntl } from "react-intl";
import type { DownloadCsvProps } from "@common/components/Link";
import { empty, insertBetween, notEmpty } from "@common/helpers/util";
import {
  getBilingualEvaluation,
  getCitizenshipStatusesAdmin,
  getGenericJobTitles,
  getGovEmployeeType,
  getLanguageProficiency,
  getOperationalRequirement,
  getWorkRegion,
} from "@common/constants/localizedConstants";
import { getLocale } from "@common/helpers/localize";
import { Applicant, Maybe } from "../../api/generated";

const useUserCsvData = (applicants: Applicant[]) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const headers: DownloadCsvProps["headers"] = [
    {
      key: "firstName",
      label: intl.formatMessage({
        defaultMessage: "First Name",
        description: "CSV Header, First Name column",
      }),
    },
    {
      key: "lastName",
      label: intl.formatMessage({
        defaultMessage: "Last Name",
        description: "CSV Header, Last Name column",
      }),
    },
    {
      key: "isVeteran",
      label: intl.formatMessage({
        defaultMessage: "Veteran",
        description: "CSV Header, Veteran column",
      }),
    },
    {
      key: "citizenship",
      label: intl.formatMessage({
        defaultMessage: "Citizenship",
        description: "CSV Header, Citizenship column",
      }),
    },
    {
      key: "language",
      label: intl.formatMessage({
        defaultMessage: "Language",
        description: "CSV Header, Language column",
      }),
    },
    {
      key: "bilingualEvaluation",
      label: intl.formatMessage({
        defaultMessage: "Bilingual Evaluation",
        description: "CSV Header, Bilingual Evaluation column",
      }),
    },
    {
      key: "comprehensionLevel",
      label: intl.formatMessage({
        defaultMessage: "Comprehension Level",
        description: "CSV Header, Comprehension Level column",
      }),
    },
    {
      key: "writtenLevel",
      label: intl.formatMessage({
        defaultMessage: "Written Level",
        description: "CSV Header, Written Level column",
      }),
    },
    {
      key: "verbalLevel",
      label: intl.formatMessage({
        defaultMessage: "Verbal Level",
        description: "CSV Header, Verbal Level column",
      }),
    },
    {
      key: "estimatedLanguageAbility",
      label: intl.formatMessage({
        defaultMessage: "Estimated Language Ability",
        description: "CSV Header, Estimated Language Ability column",
      }),
    },
    {
      key: "isGovEmployee",
      label: intl.formatMessage({
        defaultMessage: "Government Employee",
        description: "CSV Header, Government Employee column",
      }),
    },
    {
      key: "department",
      label: intl.formatMessage({
        defaultMessage: "Department",
        description: "CSV Header, Department column",
      }),
    },
    {
      key: "govEmployeeType",
      label: intl.formatMessage({
        defaultMessage: "Employee Type",
        description: "CSV Header, Employee Type column",
      }),
    },
    {
      key: "interestedInLaterOrSecondment",
      label: intl.formatMessage({
        defaultMessage: "Lateral Deployment / Secondment",
        description: "CSV Header, Lateral Deployment / Secondment column",
      }),
    },
    {
      key: "currentClassification",
      label: intl.formatMessage({
        defaultMessage: "Current Classification",
        description: "CSV Header, Current Classification column",
      }),
    },
    {
      key: "locationPreferences",
      label: intl.formatMessage({
        defaultMessage: "Location Preferences",
        description: "CSV Header, Location Preferences column",
      }),
    },
    {
      key: "locationExemptions",
      label: intl.formatMessage({
        defaultMessage: "Location Exemptions",
        description: "CSV Header, Location Exemptions column",
      }),
    },
    {
      key: "wouldAcceptTemporary",
      label: intl.formatMessage({
        defaultMessage: "Accept Temporary",
        description: "CSV Header, Accept Temporary column",
      }),
    },
    {
      key: "acceptedOperationalRequirements",
      label: intl.formatMessage({
        defaultMessage: "Accepted Operation Requirements",
        description: "CSV Header, Accepted Operation Requirements column",
      }),
    },
    {
      key: "isWoman",
      label: intl.formatMessage({
        defaultMessage: "Woman",
        description: "CSV Header, Woman column",
      }),
    },
    {
      key: "isIndigenous",
      label: intl.formatMessage({
        defaultMessage: "Indigenous",
        description: "CSV Header, Indigenous column",
      }),
    },
    {
      key: "isVisibleMinority",
      label: intl.formatMessage({
        defaultMessage: "Visible Minority",
        description: "CSV Header, Visible Minority column",
      }),
    },
    {
      key: "hasDisability",
      label: intl.formatMessage({
        defaultMessage: "Disabled",
        description: "CSV Header, Disabled column",
      }),
    },
    {
      key: "expectedClassification",
      label: intl.formatMessage({
        defaultMessage: "Role/Salary Expectation",
        description: "CSV Header, Role/Salary Expectation column",
      }),
    },
    {
      key: "skills",
      label: intl.formatMessage({
        defaultMessage: "Skills",
        description: "CSV Header, Skills column",
      }),
    },
  ];

  const data: DownloadCsvProps["data"] = React.useMemo(() => {
    const yesOrNo = (value: Maybe<boolean>) => {
      if (empty(value)) {
        return "";
      }
      return value
        ? intl.formatMessage({
            defaultMessage: "Yes",
            description: "Message for when a value is true",
          })
        : intl.formatMessage({
            defaultMessage: "No",
            description: "Message for when a value is false",
          });
    };

    const listOrEmptyString = (value: string[] | undefined) => {
      return value ? insertBetween(", ", value).join("") : "";
    };

    const getLookingForLanguage = (
      english: Maybe<boolean>,
      french: Maybe<boolean>,
      bilingual: Maybe<boolean>,
    ) => {
      if (english && !french && !bilingual) {
        // English Only
        return intl.formatMessage({
          defaultMessage: "English positions",
          description: "English Positions message",
        });
      }
      if (!english && french && !bilingual) {
        // French only
        return intl.formatMessage({
          defaultMessage: "French positions",
          description: "French Positions message",
        });
      }
      if (english && french && !bilingual) {
        // English or French
        return intl.formatMessage({
          defaultMessage: "English or French positions",
          description: "English or French Positions message",
        });
      }
      if (bilingual) {
        // Bilingual
        return intl.formatMessage({
          defaultMessage: "Bilingual positions (English and French)",
          description: "Bilingual Positions message",
        });
      }

      return "";
    };

    const getLocationPreference = (
      preference: Applicant["locationPreferences"],
    ) => {
      const squishedPreference = preference
        ?.map((region) =>
          region ? intl.formatMessage(getWorkRegion(region)) : undefined,
        )
        .filter(notEmpty);
      return listOrEmptyString(squishedPreference);
    };

    const getOperationalRequirements = (
      requirements: Applicant["acceptedOperationalRequirements"],
    ) => {
      const accepted = requirements
        ?.map((req) =>
          req ? intl.formatMessage(getOperationalRequirement(req)) : undefined,
        )
        .filter(notEmpty);

      return listOrEmptyString(accepted);
    };

    const getExpectedClassifications = (
      genericTitles: Applicant["expectedGenericJobTitles"],
    ) => {
      const expected = genericTitles
        ?.map((title) =>
          title
            ? intl.formatMessage(getGenericJobTitles(title.key))
            : undefined,
        )
        .filter(notEmpty);

      return listOrEmptyString(expected);
    };

    const flattenedApplicants: DownloadCsvProps["data"] = applicants.map(
      ({
        firstName,
        lastName,
        isVeteran,
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
        department,
        govEmployeeType,
        interestedInLaterOrSecondment,
        currentClassification,
        locationPreferences,
        locationExemptions,
        wouldAcceptTemporary,
        acceptedOperationalRequirements,
        isWoman,
        isIndigenous,
        isVisibleMinority,
        hasDisability,
        expectedGenericJobTitles,
      }) => ({
        firstName: firstName || "",
        lastName: lastName || "",
        isVeteran: yesOrNo(isVeteran),
        citizenship: citizenship
          ? intl.formatMessage(getCitizenshipStatusesAdmin(citizenship))
          : "",
        language: getLookingForLanguage(
          lookingForEnglish,
          lookingForFrench,
          lookingForBilingual,
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
        isGovEmployee: yesOrNo(isGovEmployee),
        department: department?.name[locale] || "",
        govEmployeeType: govEmployeeType
          ? intl.formatMessage(getGovEmployeeType(govEmployeeType))
          : "",
        interestedInLaterOrSecondment: yesOrNo(interestedInLaterOrSecondment),
        currentClassification: currentClassification
          ? `${currentClassification.group}-${currentClassification.level}`
          : "",
        locationPreferences: getLocationPreference(locationPreferences),
        locationExemptions: locationExemptions || "",
        wouldAcceptTemporary: yesOrNo(wouldAcceptTemporary),
        acceptedOperationalRequirement: getOperationalRequirements(
          acceptedOperationalRequirements,
        ),
        isWoman: yesOrNo(isWoman),
        isIndigenous: yesOrNo(isIndigenous),
        isVisibleMinority: yesOrNo(isVisibleMinority),
        hasDisability: yesOrNo(hasDisability),
        expectedClassification: getExpectedClassifications(
          expectedGenericJobTitles,
        ),
        skills: "", // TO DO: Flatten the experiences to a list of skills
      }),
    );

    return flattenedApplicants;
  }, [applicants, intl, locale]);

  return { headers, data };
};

export default useUserCsvData;
