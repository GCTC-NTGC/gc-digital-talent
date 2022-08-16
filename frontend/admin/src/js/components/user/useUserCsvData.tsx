import React from "react";
import { useIntl } from "react-intl";
import type { DownloadCsvProps } from "@common/components/Link";
import {
  empty,
  flatten,
  insertBetween,
  notEmpty,
  uniqueItems,
} from "@common/helpers/util";
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
import { enumToOptions } from "@common/helpers/formUtils";
import { Applicant, GovEmployeeType, type Maybe } from "../../api/generated";

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
    /**
     * Converts a possible boolean
     * to yes or no string
     *
     * @param value Maybe<boolean>
     * @returns React.ReactNode  "yes" or "no"
     */
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

    /**
     * Converts a possible array to
     * a comma separated list
     *
     * @param value string[] | undefined    Array of items to convert
     * @returns string                      Comma separated list or empty
     */
    const listOrEmptyString = (value: string[] | undefined) => {
      return value ? insertBetween(", ", value).join("") : "";
    };

    /**
     *  Converts the applicants language preferences
     *  to a string
     *
     * @param english   Maybe<boolean>      If looking for English positions
     * @param french    Maybe<boolean>      If looking for French positions
     * @param bilingual   Maybe<boolean>    If looking for Bilingual positions
     * @returns
     */
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

    /**
     * Converts possible Employee Type
     * to a string
     *
     * @param type  Applicant["govEmployeeType"]
     * @returns string The employee type
     */
    const employeeTypeToString = (type: Applicant["govEmployeeType"]) => {
      const govEmployeeTypeId =
        enumToOptions(GovEmployeeType).find(
          (govEmployeeType) => govEmployeeType.value === type,
        )?.value || null;

      return govEmployeeTypeId
        ? intl.formatMessage(getGovEmployeeType(govEmployeeTypeId))
        : "";
    };

    /**
     * Converts a possible location preference
     * to a string
     *
     * @param preference  Applicant["locationPreferences"]
     * @returns string
     */
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

    /**
     * Converts possible array of operational requirements
     * to a comma separated list or empty string
     *
     * @param requirements  Applicant["acceptedOperationalRequirements"]
     * @returns string
     */
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

    /**
     * Converts a possible array of generic job titles
     * to a comma separated list or empty string
     *
     * @param genericTitles Maybe<Maybe<GenericJobTitle>[]>
     * @returns string
     */
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

    /**
     * Converts a possible array of experiences to
     * a flattened comma separated list of skills
     * or an empty string
     *
     * @param experiences Maybe<Maybe<Experience>[]>
     * @returns string
     */
    const flattenExperiencesToSkills = (
      experiences: Applicant["experiences"],
    ) => {
      const skills = experiences
        ?.map((experience) => {
          return experience?.skills
            ?.map((skill) => {
              return skill.name[locale] || undefined;
            })
            .filter(notEmpty);
        })
        .filter(notEmpty);

      const flattenedSkills = skills ? uniqueItems(flatten(skills)) : undefined;

      return listOrEmptyString(flattenedSkills);
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
        experiences,
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
          ? employeeTypeToString(govEmployeeType)
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
        skills: flattenExperiencesToSkills(experiences),
      }),
    );

    return flattenedApplicants;
  }, [applicants, intl, locale]);

  return { headers, data };
};

export default useUserCsvData;
