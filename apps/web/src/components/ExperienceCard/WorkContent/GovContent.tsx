import { useIntl } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  GovContractorType,
  WorkExperience,
  WorkExperienceGovEmployeeType,
} from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ContentSection";
import { ContentProps } from "../types";

const GovContent = ({
  experience: {
    division,
    govEmploymentType,
    classification,
    govPositionType,
    govContractorRoleSeniority,
    govContractorType,
    contractorFirmAgencyName,
  },
  headingLevel,
}: ContentProps<Omit<WorkExperience, "user">>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  if (govEmploymentType?.value === WorkExperienceGovEmployeeType.Student) {
    return (
      <>
        <ContentSection
          title={experienceFormLabels.team}
          headingLevel={headingLevel}
          className="sm:border-r sm:border-gray-200 dark:border-gray-500"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
        <Separator space="sm" decorative />
        <ContentSection
          title={experienceFormLabels.govEmploymentType}
          headingLevel={headingLevel}
          className="sm:border-r sm:border-gray-200 dark:border-gray-500"
        >
          {getLocalizedName(govEmploymentType.label, intl)}
        </ContentSection>
      </>
    );
  } else if (
    govEmploymentType?.value === WorkExperienceGovEmployeeType.Casual
  ) {
    return (
      <>
        <ContentSection
          title={experienceFormLabels.team}
          headingLevel={headingLevel}
          className="sm:border-r sm:border-gray-200 dark:border-gray-500"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
        <Separator space="sm" decorative />
        <div className="grid gap-6 sm:grid-cols-2">
          <ContentSection
            title={experienceFormLabels.govEmploymentType}
            headingLevel={headingLevel}
            className="sm:border-r sm:border-gray-200 dark:border-gray-500"
          >
            {getLocalizedName(govEmploymentType.label, intl)}
          </ContentSection>
          <ContentSection
            title={experienceFormLabels.classification}
            headingLevel={headingLevel}
          >
            {classification
              ? // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`
              : intl.formatMessage(commonMessages.notAvailable)}
          </ContentSection>
        </div>
      </>
    );
  } else if (
    govEmploymentType?.value === WorkExperienceGovEmployeeType.Indeterminate
  ) {
    return (
      <>
        <ContentSection
          title={experienceFormLabels.team}
          headingLevel={headingLevel}
          className="sm:border-r sm:border-gray-200 dark:border-gray-500"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
        <Separator space="sm" decorative />
        <div className="grid gap-6 sm:grid-cols-3">
          <ContentSection
            title={experienceFormLabels.govEmploymentType}
            headingLevel={headingLevel}
            className="sm:border-r sm:border-gray-200 dark:border-gray-500"
          >
            {getLocalizedName(govEmploymentType.label, intl)}
          </ContentSection>
          <ContentSection
            title={experienceFormLabels.positionType}
            headingLevel={headingLevel}
            className="sm:border-r sm:border-gray-200 dark:border-gray-500"
          >
            {getLocalizedName(govPositionType?.label, intl)}
          </ContentSection>
          <ContentSection
            title={experienceFormLabels.classification}
            headingLevel={headingLevel}
          >
            {classification
              ? // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`
              : intl.formatMessage(commonMessages.notAvailable)}
          </ContentSection>
        </div>
      </>
    );
  } else if (govEmploymentType?.value === WorkExperienceGovEmployeeType.Term) {
    return (
      <>
        <ContentSection
          title={experienceFormLabels.team}
          headingLevel={headingLevel}
          className="sm:border-r sm:border-gray-200 dark:border-gray-500"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
        <Separator space="sm" decorative />
        <div className="grid gap-6 sm:grid-cols-3">
          <ContentSection
            title={experienceFormLabels.govEmploymentType}
            headingLevel={headingLevel}
            className="sm:border-r sm:border-gray-200 dark:border-gray-500"
          >
            {getLocalizedName(govEmploymentType.label, intl)}
          </ContentSection>
          <ContentSection
            title={experienceFormLabels.classification}
            headingLevel={headingLevel}
          >
            {classification
              ? // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`
              : intl.formatMessage(commonMessages.notAvailable)}
          </ContentSection>
        </div>
      </>
    );
  } else if (
    govEmploymentType?.value === WorkExperienceGovEmployeeType.Contractor
  ) {
    return (
      <>
        <ContentSection
          title={experienceFormLabels.team}
          headingLevel={headingLevel}
          className="sm:border-r sm:border-gray-200 dark:border-gray-500"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
        <Separator space="sm" decorative />
        <div className="grid grid-cols-3 gap-6">
          <ContentSection
            title={experienceFormLabels.govEmploymentType}
            headingLevel={headingLevel}
            className="sm:border-r sm:border-gray-200 dark:border-gray-500"
          >
            {getLocalizedName(govEmploymentType.label, intl)}
          </ContentSection>
          <ContentSection
            title={experienceFormLabels.govContractorRoleSeniority}
            headingLevel={headingLevel}
            className="sm:border-r sm:border-gray-200 dark:border-gray-500"
          >
            {getLocalizedName(govContractorRoleSeniority?.label, intl)}
          </ContentSection>
          <ContentSection
            title={experienceFormLabels.govContractorType}
            headingLevel={headingLevel}
            className="sm:border-r sm:border-gray-200 dark:border-gray-500"
          >
            {getLocalizedName(govContractorType?.label, intl)}
          </ContentSection>
        </div>
        {govContractorType?.value === GovContractorType.FirmOrAgency && (
          <>
            <Separator space="sm" decorative />
            <ContentSection
              title={experienceFormLabels.contractorFirmAgencyName}
              headingLevel={headingLevel}
              className="sm:border-r sm:border-gray-200 dark:border-gray-500"
            >
              {contractorFirmAgencyName ??
                intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
          </>
        )}
      </>
    );
  }

  return null;
};

export default GovContent;
