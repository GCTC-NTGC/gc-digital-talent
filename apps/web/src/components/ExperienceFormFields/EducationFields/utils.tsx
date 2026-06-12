import type { IntlShape } from "react-intl";

import { localizedEnumToOptions } from "@gc-digital-talent/forms";
import {
  DegreeType,
  EducationStatus,
  EducationType,
  FellowshipType,
  graphql,
  type EducationOptionsQuery,
} from "@gc-digital-talent/graphql";

export const EducationOptions_Query = graphql(/* GraphQL */ `
  query EducationOptions {
    educationTypes: localizedEnumStrings(enumName: "EducationType") {
      value
      label {
        localized
      }
    }
    degreeTypes: localizedEnumStrings(enumName: "DegreeType") {
      value
      label {
        localized
      }
    }
    fellowshipTypes: localizedEnumStrings(enumName: "FellowshipType") {
      value
      label {
        localized
      }
    }
    educationStatuses: localizedEnumStrings(enumName: "EducationStatus") {
      value
      label {
        localized
      }
    }
  }
`);

export const getEducationTypeOptions = (
  educationTypes: EducationOptionsQuery["educationTypes"],
  intl: IntlShape,
) => {
  return localizedEnumToOptions(educationTypes, intl, [
    EducationType.DegreeDiplomaCertificate,
    EducationType.LicenseAccreditation,
    EducationType.ProfessionalCertification,
    EducationType.IndividualCourse,
    EducationType.Fellowship,
    EducationType.Other,
  ]);
};

export const getDegreeTypeOptions = (
  degreeTypes: EducationOptionsQuery["degreeTypes"],
  intl: IntlShape,
) => {
  return localizedEnumToOptions(degreeTypes, intl, [
    DegreeType.HighSchool,
    DegreeType.CollegeDiploma,
    DegreeType.BachelorsDegree,
    DegreeType.MastersDegree,
    DegreeType.Phd,
  ]);
};

export const getFellowshipTypeOptions = (
  fellowshipTypes: EducationOptionsQuery["fellowshipTypes"],
  intl: IntlShape,
) => {
  return localizedEnumToOptions(fellowshipTypes, intl, [
    FellowshipType.PostDoctoral,
    FellowshipType.Industry,
    FellowshipType.Other,
  ]);
};

export const getEducationStatusOptions = (
  educationStatuses: EducationOptionsQuery["educationStatuses"],
  intl: IntlShape,
  licenseOrCertification: boolean,
) => {
  const statusesToUse: string[] = licenseOrCertification
    ? [
        EducationStatus.InProgress,
        EducationStatus.Success,
        EducationStatus.DidNotComplete,
      ]
    : [
        EducationStatus.InProgress,
        EducationStatus.SuccessCredential,
        EducationStatus.SuccessNoCredential,
        EducationStatus.DidNotComplete,
      ];
  return localizedEnumToOptions(
    educationStatuses?.filter((status) => statusesToUse.includes(status.value)),
    intl,
    statusesToUse,
  );
};
