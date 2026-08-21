import { useIntl } from "react-intl";

import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import type {
  GovContractorRoleSeniority,
  GovPositionType,
} from "@gc-digital-talent/graphql";
import { GovContractorType, GovEmployeeType } from "@gc-digital-talent/graphql";
import { Separator, type HeadingRank } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ContentSection";
import type { ContentProps } from "../types";

interface GovContentClassification {
  group?: string | null;
  level?: number | null;
}

export interface GovContentExperience {
  division?: string | null;
  classification?: GovContentClassification | null;
  govEmploymentType?: GenericLocalizedEnum<GovEmployeeType> | null;
  govPositionType?: GenericLocalizedEnum<GovPositionType> | null;
  govContractorRoleSeniority?: GenericLocalizedEnum<GovContractorRoleSeniority> | null;
  govContractorType?: GenericLocalizedEnum<GovContractorType> | null;
  contractorFirmAgencyName?: string | null;
}

interface ClassificationSectionProps {
  title: string;
  headingLevel?: HeadingRank;
  content: string;
}

const ClassificationSection = ({
  title,
  headingLevel,
  content,
}: ClassificationSectionProps) => {
  return (
    <ContentSection title={title} headingLevel={headingLevel}>
      {content}
    </ContentSection>
  );
};

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
}: ContentProps<GovContentExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  const group = classification?.group;
  const level = classification?.level;
  const groupAndLevel =
    group && level
      ? group + "-" + (level < 10 ? "0" : "") + level
      : intl.formatMessage(commonMessages.notAvailable);

  if (govEmploymentType?.value === GovEmployeeType.Student) {
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
  } else if (govEmploymentType?.value === GovEmployeeType.Casual) {
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
          <ClassificationSection
            title={experienceFormLabels.classification}
            headingLevel={headingLevel}
            content={groupAndLevel}
          />
        </div>
      </>
    );
  } else if (govEmploymentType?.value === GovEmployeeType.Indeterminate) {
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
          <ClassificationSection
            title={experienceFormLabels.classification}
            headingLevel={headingLevel}
            content={groupAndLevel}
          />
        </div>
      </>
    );
  } else if (govEmploymentType?.value === GovEmployeeType.Term) {
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
          <ClassificationSection
            title={experienceFormLabels.classification}
            headingLevel={headingLevel}
            content={groupAndLevel}
          />
        </div>
      </>
    );
  } else if (govEmploymentType?.value === GovEmployeeType.Contractor) {
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
