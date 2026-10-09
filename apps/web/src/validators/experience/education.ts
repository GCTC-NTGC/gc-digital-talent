import {
  DegreeType,
  EducationStatus,
  EducationType,
  FellowshipType,
} from "@gc-digital-talent/graphql";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

interface EducationFields {
  educationType?: LocalizedEnumValue<EducationType> | null;
  otherEducationType?: string | null;
  institution?: string | null;
  degreeType?: LocalizedEnumValue<DegreeType> | null;
  fellowshipType?: LocalizedEnumValue<FellowshipType> | null;
  otherFellowshipType?: string | null;
  areaOfStudy?: string | null;
  licenseOrAccreditation?: string | null;
  certification?: string | null;
  courseName?: string | null;
  status?: LocalizedEnumValue<EducationStatus> | null;
  startDate?: string | null;
  prospectiveEndDate?: string | null;
}

/*
  Mirrors the required rules in ExperienceFormFields/EducationFields.
  End dates aren't checked since a missing end date can't be told apart from an ongoing one.
*/
export function hasEmptyRequiredFields({
  educationType,
  otherEducationType,
  institution,
  degreeType,
  fellowshipType,
  otherFellowshipType,
  areaOfStudy,
  licenseOrAccreditation,
  certification,
  courseName,
  status,
  startDate,
  prospectiveEndDate,
}: EducationFields): boolean {
  const type = educationType?.value;
  const isDegree = type === EducationType.DegreeDiplomaCertificate;
  const isLicenseOrCertification =
    type === EducationType.LicenseAccreditation ||
    type === EducationType.ProfessionalCertification;
  const hasAreaOfStudy =
    (isDegree && degreeType?.value !== DegreeType.HighSchool) ||
    type === EducationType.IndividualCourse ||
    type === EducationType.Fellowship ||
    type === EducationType.Other;
  const hasDates = !(
    isLicenseOrCertification && status?.value === EducationStatus.DidNotComplete
  );

  return !!(
    !type ||
    !institution ||
    !status?.value ||
    (isDegree && !degreeType?.value) ||
    (type === EducationType.Other && !otherEducationType) ||
    (type === EducationType.Fellowship && !fellowshipType?.value) ||
    (type === EducationType.Fellowship &&
      fellowshipType?.value === FellowshipType.Other &&
      !otherFellowshipType) ||
    (hasAreaOfStudy && !areaOfStudy) ||
    (type === EducationType.LicenseAccreditation && !licenseOrAccreditation) ||
    (type === EducationType.ProfessionalCertification && !certification) ||
    (type === EducationType.IndividualCourse && !courseName) ||
    (hasDates && !startDate) ||
    (!isLicenseOrCertification &&
      status?.value === EducationStatus.InProgress &&
      !prospectiveEndDate)
  );
}
