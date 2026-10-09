import { useIntl } from "react-intl";

import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  DegreeType,
  EducationStatus,
  EducationType,
  FellowshipType,
} from "@gc-digital-talent/graphql";

import { getExperienceFormLabels } from "~/utils/experienceUtils";
import { formattedDate } from "~/utils/dateUtils";

import ContentSection from "../ExperienceCard/ContentSection";
import type { ContentProps } from "../ExperienceCard/types";
import DatesSection from "./DatesSection";

export interface EducationDialogContentExperience {
  __typename?: "EducationExperience";
  educationType?: GenericLocalizedEnum<EducationType> | null;
  otherEducationType?: string | null;
  institution?: string | null;
  degreeType?: GenericLocalizedEnum<DegreeType> | null;
  fellowshipType?: GenericLocalizedEnum<FellowshipType> | null;
  otherFellowshipType?: string | null;
  areaOfStudy?: string | null;
  licenseOrAccreditation?: string | null;
  certification?: string | null;
  courseName?: string | null;
  status?: GenericLocalizedEnum<EducationStatus> | null;
  startDate?: string | null;
  endDate?: string | null;
  prospectiveEndDate?: string | null;
  thesisTitle?: string | null;
}

// Which fields show mirrors the rules in ExperienceFormFields/EducationFields
const EducationDialogContent = ({
  experience,
  headingRank,
}: ContentProps<EducationDialogContentExperience>) => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "education");
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const {
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
    endDate,
    prospectiveEndDate,
    thesisTitle,
  } = experience;

  const type = educationType?.value;
  const isDegree = type === EducationType.DegreeDiplomaCertificate;
  const isLicenseOrCertification =
    type === EducationType.LicenseAccreditation ||
    type === EducationType.ProfessionalCertification;
  const inProgress = status?.value === EducationStatus.InProgress;
  const didNotComplete = status?.value === EducationStatus.DidNotComplete;
  const showAreaOfStudy =
    (isDegree && degreeType?.value !== DegreeType.HighSchool) ||
    type === EducationType.IndividualCourse ||
    type === EducationType.Fellowship ||
    type === EducationType.Other;
  const showThesis =
    isDegree &&
    (degreeType?.value === DegreeType.MastersDegree ||
      degreeType?.value === DegreeType.Phd);

  const areaOfStudySection = (
    <ContentSection headingRank={headingRank} title={labels.areaOfStudy}>
      {areaOfStudy ?? notAvailable}
    </ContentSection>
  );

  // License and certification dates are an issue and expiry date, not a range
  const expiryDate = inProgress ? prospectiveEndDate : endDate;

  return (
    <div className="flex flex-col gap-y-6">
      <ContentSection headingRank={headingRank} title={labels.educationType}>
        {getLocalizedName(educationType?.label, intl)}
      </ContentSection>
      {type === EducationType.Other && (
        <ContentSection
          headingRank={headingRank}
          title={labels.otherEducationType}
        >
          {otherEducationType ?? notAvailable}
        </ContentSection>
      )}
      <ContentSection headingRank={headingRank} title={labels.institution}>
        {institution ?? notAvailable}
      </ContentSection>
      {type === EducationType.Fellowship && (
        <>
          <ContentSection
            headingRank={headingRank}
            title={labels.fellowshipType}
          >
            {getLocalizedName(fellowshipType?.label, intl)}
          </ContentSection>
          {fellowshipType?.value === FellowshipType.Other && (
            <ContentSection
              headingRank={headingRank}
              title={labels.otherFellowshipType}
            >
              {otherFellowshipType ?? notAvailable}
            </ContentSection>
          )}
        </>
      )}
      {isDegree ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <ContentSection headingRank={headingRank} title={labels.degreeType}>
            {getLocalizedName(degreeType?.label, intl)}
          </ContentSection>
          {showAreaOfStudy && areaOfStudySection}
        </div>
      ) : (
        showAreaOfStudy && areaOfStudySection
      )}
      {type === EducationType.LicenseAccreditation && (
        <ContentSection
          headingRank={headingRank}
          title={labels.licenseOrAccreditation}
        >
          {licenseOrAccreditation ?? notAvailable}
        </ContentSection>
      )}
      {type === EducationType.ProfessionalCertification && (
        <ContentSection headingRank={headingRank} title={labels.certification}>
          {certification ?? notAvailable}
        </ContentSection>
      )}
      {type === EducationType.IndividualCourse && (
        <ContentSection headingRank={headingRank} title={labels.courseName}>
          {courseName ?? notAvailable}
        </ContentSection>
      )}
      <ContentSection headingRank={headingRank} title={labels.educationStatus}>
        {getLocalizedName(status?.label, intl)}
      </ContentSection>
      {isLicenseOrCertification ? (
        !didNotComplete && (
          <div className="grid gap-6 sm:grid-cols-2">
            <ContentSection
              headingRank={headingRank}
              title={
                inProgress ? labels.prospectiveIssueDate : labels.issueDate
              }
            >
              {startDate ? formattedDate(startDate, intl) : notAvailable}
            </ContentSection>
            <ContentSection
              headingRank={headingRank}
              title={
                inProgress ? labels.prospectiveExpiryDate : labels.expiryDate
              }
            >
              {expiryDate ? formattedDate(expiryDate, intl) : notAvailable}
            </ContentSection>
          </div>
        )
      ) : (
        <DatesSection experience={experience} headingRank={headingRank} />
      )}
      {showThesis && (
        <ContentSection headingRank={headingRank} title={labels.thesisTitle}>
          {thesisTitle ?? notAvailable}
        </ContentSection>
      )}
    </div>
  );
};

export default EducationDialogContent;
