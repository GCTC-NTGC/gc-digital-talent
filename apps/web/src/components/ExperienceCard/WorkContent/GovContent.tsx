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
          data-h2-border-right="l-tablet(1px solid gray.lighter)"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
        <Separator space="sm" decorative />
        <ContentSection
          title={experienceFormLabels.govEmploymentType}
          headingLevel={headingLevel}
          data-h2-border-right="l-tablet(1px solid gray.lighter)"
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
          data-h2-border-right="l-tablet(1px solid gray.lighter)"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
        <Separator space="sm" decorative />
        <div
          data-h2-display="base(grid)"
          data-h2-gap="base(x1)"
          data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
        >
          <ContentSection
            title={experienceFormLabels.govEmploymentType}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {getLocalizedName(govEmploymentType.label, intl)}
          </ContentSection>
          <ContentSection
            title={experienceFormLabels.classification}
            headingLevel={headingLevel}
          >
            {classification
              ? `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`
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
          data-h2-border-right="l-tablet(1px solid gray.lighter)"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
        <Separator space="sm" decorative />
        <div
          data-h2-display="base(grid)"
          data-h2-gap="base(x1)"
          data-h2-grid-template-columns="l-tablet(repeat(3, 1fr))"
        >
          <ContentSection
            title={experienceFormLabels.govEmploymentType}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {getLocalizedName(govEmploymentType.label, intl)}
          </ContentSection>
          <ContentSection
            title={experienceFormLabels.positionType}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {getLocalizedName(govPositionType?.label, intl)}
          </ContentSection>
          <ContentSection
            title={experienceFormLabels.classification}
            headingLevel={headingLevel}
          >
            {classification
              ? `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`
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
          data-h2-border-right="l-tablet(1px solid gray.lighter)"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
        <Separator space="sm" decorative />
        <div
          data-h2-display="base(grid)"
          data-h2-gap="base(x1)"
          data-h2-grid-template-columns="l-tablet(repeat(3, 1fr))"
        >
          <ContentSection
            title={experienceFormLabels.govEmploymentType}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {getLocalizedName(govEmploymentType.label, intl)}
          </ContentSection>
          <ContentSection
            title={experienceFormLabels.classification}
            headingLevel={headingLevel}
          >
            {classification
              ? `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`
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
          data-h2-border-right="l-tablet(1px solid gray.lighter)"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
        <Separator space="sm" decorative />
        <div
          data-h2-display="base(grid)"
          data-h2-gap="base(x1)"
          data-h2-grid-template-columns="l-tablet(repeat(3, 1fr))"
        >
          <ContentSection
            title={experienceFormLabels.govEmploymentType}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {getLocalizedName(govEmploymentType.label, intl)}
          </ContentSection>
          <ContentSection
            title={experienceFormLabels.govContractorRoleSeniority}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {getLocalizedName(govContractorRoleSeniority?.label, intl)}
          </ContentSection>
          <ContentSection
            title={experienceFormLabels.govContractorType}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
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
              data-h2-border-right="l-tablet(1px solid gray.lighter)"
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
