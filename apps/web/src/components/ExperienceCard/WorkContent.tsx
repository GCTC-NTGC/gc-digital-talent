import { useIntl } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  EmploymentCategory,
  GovContractorType,
  GovEmployeeType,
  WorkExperience,
  WorkExperienceGovEmployeeType,
} from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const WorkContent = ({
  experience: {
    division,
    employmentCategory,
    extSizeOfOrganization,
    extRoleSeniority,
    govEmploymentType,
    classification,
    govPositionType,
    govContractorRoleSeniority,
    govContractorType,
    contractorFirmAgencyName,
    cafEmploymentType,
    cafRank,
  },
  headingLevel,
}: ContentProps<Omit<WorkExperience, "user">>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  switch (employmentCategory?.value) {
    case EmploymentCategory.ExternalOrganization:
      return (
        <>
          <ContentSection
            title={experienceFormLabels.team}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {division ?? intl.formatMessage(commonMessages.notAvailable)}
          </ContentSection>
          <Separator space="sm" />
          <div
            data-h2-display="base(grid)"
            data-h2-gap="base(x1)"
            data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
          >
            <ContentSection
              title={experienceFormLabels.extSizeOfOrganization}
              headingLevel={headingLevel}
              data-h2-border-right="l-tablet(1px solid gray.lighter)"
            >
              {getLocalizedName(extSizeOfOrganization?.label, intl) ??
                intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
            <ContentSection
              title={experienceFormLabels.extRoleSeniority}
              headingLevel={headingLevel}
            >
              {getLocalizedName(extRoleSeniority?.label, intl) ??
                intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
          </div>
        </>
      );
    case EmploymentCategory.GovernmentOfCanada:
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
            <Separator space="sm" />
            <ContentSection
              title={experienceFormLabels.govEmploymentType}
              headingLevel={headingLevel}
              data-h2-border-right="l-tablet(1px solid gray.lighter)"
            >
              {getLocalizedName(govEmploymentType.label, intl) ??
                intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
          </>
        );
      } else if (
        govEmploymentType?.value === WorkExperienceGovEmployeeType.Casual ||
        govEmploymentType?.value === WorkExperienceGovEmployeeType.Term
      ) {
        <>
          <ContentSection
            title={experienceFormLabels.team}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {division ?? intl.formatMessage(commonMessages.notAvailable)}
          </ContentSection>
          <Separator space="sm" />
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
              {getLocalizedName(govEmploymentType.label, intl) ??
                intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
            <ContentSection
              title={experienceFormLabels.classification}
              headingLevel={headingLevel}
            >
              {classification
                ? `${classification.group}-0${classification.level}`
                : intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
          </div>
        </>;
      } else if (
        govEmploymentType?.value === WorkExperienceGovEmployeeType.Indeterminate
      ) {
        <>
          <ContentSection
            title={experienceFormLabels.team}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {division ?? intl.formatMessage(commonMessages.notAvailable)}
          </ContentSection>
          <Separator space="sm" />
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
              {getLocalizedName(govEmploymentType.label, intl) ??
                intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
            <ContentSection
              title={experienceFormLabels.positionType}
              headingLevel={headingLevel}
              data-h2-border-right="l-tablet(1px solid gray.lighter)"
            >
              {getLocalizedName(govPositionType?.label, intl) ??
                intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
            <ContentSection
              title={experienceFormLabels.classification}
              headingLevel={headingLevel}
            >
              {classification
                ? `${classification.group}-0${classification.level}`
                : intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
          </div>
        </>;
      } else if (
        govEmploymentType?.value === WorkExperienceGovEmployeeType.Contractor
      ) {
        <>
          <ContentSection
            title={experienceFormLabels.team}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {division ?? intl.formatMessage(commonMessages.notAvailable)}
          </ContentSection>
          <Separator space="sm" />
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
              {getLocalizedName(govEmploymentType.label, intl) ??
                intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
            <ContentSection
              title={experienceFormLabels.govContractorRoleSeniority}
              headingLevel={headingLevel}
              data-h2-border-right="l-tablet(1px solid gray.lighter)"
            >
              {getLocalizedName(govContractorRoleSeniority?.label, intl) ??
                intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
            <ContentSection
              title={experienceFormLabels.govContractorType}
              headingLevel={headingLevel}
              data-h2-border-right="l-tablet(1px solid gray.lighter)"
            >
              {getLocalizedName(govContractorType?.label, intl) ??
                intl.formatMessage(commonMessages.notAvailable)}
            </ContentSection>
          </div>
          {govContractorType?.value === GovContractorType.FirmOrAgency && (
            <>
              <Separator space="sm" />
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
        </>;
      } else {
        return null;
      }
      break;
    case EmploymentCategory.CanadianArmedForces:
      return (
        <>
          <ContentSection
            title={experienceFormLabels.team}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {division ?? intl.formatMessage(commonMessages.notAvailable)}
          </ContentSection>
          <Separator space="sm" />
          <ContentSection
            title={experienceFormLabels.cafEmploymentType}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {getLocalizedName(cafEmploymentType?.label, intl) ??
              intl.formatMessage(commonMessages.notAvailable)}
          </ContentSection>
          <Separator space="sm" />
          <ContentSection
            title={experienceFormLabels.cafRank}
            headingLevel={headingLevel}
            data-h2-border-right="l-tablet(1px solid gray.lighter)"
          >
            {getLocalizedName(cafRank?.label, intl) ??
              intl.formatMessage(commonMessages.notAvailable)}
          </ContentSection>
        </>
      );
    default:
      return (
        <ContentSection
          title={experienceFormLabels.team}
          headingLevel={headingLevel}
          data-h2-border-right="l-tablet(1px solid gray.lighter)"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
      );
  }
};

export default WorkContent;
