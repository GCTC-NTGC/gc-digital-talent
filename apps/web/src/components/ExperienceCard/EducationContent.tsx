import { useIntl } from "react-intl";

import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import type { EducationStatus } from "@gc-digital-talent/graphql";
import { EducationType } from "@gc-digital-talent/graphql";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import type { ContentProps } from "./types";

export interface EducationContentExperience {
  __typename?: "EducationExperience";
  areaOfStudy?: string | null;
  thesisTitle?: string | null;
  status?: GenericLocalizedEnum<EducationStatus> | null;
  educationType?: GenericLocalizedEnum<EducationType> | null;
  licenseOrAccreditation?: string | null;
  certification?: string | null;
  courseName?: string | null;
}

const EducationContent = ({
  experience: {
    areaOfStudy,
    status,
    thesisTitle,
    educationType,
    licenseOrAccreditation,
    certification,
    courseName,
  },
  headingRank,
}: ContentProps<EducationContentExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <ContentSection
        title={experienceFormLabels.areaOfStudy}
        headingRank={headingRank}
        className="sm:border-r sm:border-gray-200 dark:border-gray-500"
      >
        {areaOfStudy ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.educationStatus}
        headingRank={headingRank}
        className="sm:border-r sm:border-gray-200 dark:border-gray-500"
      >
        {getLocalizedName(status?.label, intl)}
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.thesisTitle}
        headingRank={headingRank}
      >
        {thesisTitle ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      {educationType?.value === EducationType.LicenseAccreditation && (
        <ContentSection
          title={experienceFormLabels.licenseOrAccreditation}
          headingRank={headingRank}
        >
          {licenseOrAccreditation ??
            intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
      )}
      {educationType?.value === EducationType.ProfessionalCertification && (
        <ContentSection
          title={experienceFormLabels.certification}
          headingRank={headingRank}
        >
          {certification ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
      )}
      {educationType?.value === EducationType.IndividualCourse && (
        <ContentSection
          title={experienceFormLabels.courseName}
          headingRank={headingRank}
        >
          {courseName ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
      )}
    </div>
  );
};

export default EducationContent;
