import { useIntl } from "react-intl";

import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import type {
  CafEmploymentType,
  CafForce,
  CafRank,
  ExternalRoleSeniority,
  ExternalSizeOfOrganization,
  GovContractorRoleSeniority,
  GovPositionType,
  LocalizedString,
} from "@gc-digital-talent/graphql";
import {
  EmploymentCategory,
  GovContractorType,
  GovEmployeeType,
} from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ExperienceCard/ContentSection";
import type { ContentProps } from "../ExperienceCard/types";
import type { SupervisoryContentExperience } from "../ExperienceCard/WorkContent/SupervisoryContent";
import SupervisoryContent from "../ExperienceCard/WorkContent/SupervisoryContent";
import type { ExperienceWorkStream } from "../ExperienceCard/WorkContent/WorkStreamsContent";
import WorkStreamContent from "../ExperienceCard/WorkContent/WorkStreamsContent";
import DatesSection from "./DatesSection";

interface WorkDepartment {
  name?: LocalizedString | null;
}

interface WorkClassification {
  group: string;
  level: number;
}

export interface WorkDialogContentExperience extends SupervisoryContentExperience {
  __typename?: "WorkExperience";
  role?: string | null;
  organization?: string | null;
  division?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  details?: string | null;
  employmentCategory?: GenericLocalizedEnum<EmploymentCategory> | null;
  extSizeOfOrganization?: GenericLocalizedEnum<ExternalSizeOfOrganization> | null;
  extRoleSeniority?: GenericLocalizedEnum<ExternalRoleSeniority> | null;
  department?: WorkDepartment | null;
  govEmploymentType?: GenericLocalizedEnum<GovEmployeeType> | null;
  govPositionType?: GenericLocalizedEnum<GovPositionType> | null;
  govContractorRoleSeniority?: GenericLocalizedEnum<GovContractorRoleSeniority> | null;
  govContractorType?: GenericLocalizedEnum<GovContractorType> | null;
  contractorFirmAgencyName?: string | null;
  classification?: WorkClassification | null;
  cafEmploymentType?: GenericLocalizedEnum<CafEmploymentType> | null;
  cafForce?: GenericLocalizedEnum<CafForce> | null;
  cafRank?: GenericLocalizedEnum<CafRank> | null;
  workStreams?: ExperienceWorkStream[] | null;
}

// Which fields show mirrors the rules in ExperienceFormFields/WorkFields
const WorkDialogContent = ({
  experience,
  headingRank,
}: ContentProps<WorkDialogContentExperience>) => {
  const intl = useIntl();
  const labels = getExperienceFormLabels(intl, "work");
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const {
    role,
    organization,
    division,
    details,
    employmentCategory,
    extSizeOfOrganization,
    extRoleSeniority,
    department,
    govEmploymentType,
    govPositionType,
    govContractorRoleSeniority,
    govContractorType,
    contractorFirmAgencyName,
    classification,
    cafEmploymentType,
    cafForce,
    cafRank,
    workStreams,
  } = experience;

  const category = employmentCategory?.value;
  const isExternal = category === EmploymentCategory.ExternalOrganization;
  const isGov = category === EmploymentCategory.GovernmentOfCanada;
  const isCaf = category === EmploymentCategory.CanadianArmedForces;
  const govType = govEmploymentType?.value;
  const showClassification =
    govType === GovEmployeeType.Casual ||
    govType === GovEmployeeType.Indeterminate ||
    govType === GovEmployeeType.Term ||
    govType === GovEmployeeType.Interchange;

  const teamSection = (
    <ContentSection headingRank={headingRank} title={labels.team}>
      {division ?? notAvailable}
    </ContentSection>
  );

  return (
    <>
      <div className="flex flex-col gap-y-6">
        <ContentSection headingRank={headingRank} title={labels.jobTitle}>
          {role ?? notAvailable}
        </ContentSection>
        <DatesSection experience={experience} headingRank={headingRank} />
      </div>
      <Separator space="sm" decorative />
      <div className="flex flex-col gap-y-6">
        {isExternal && (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <ContentSection
                headingRank={headingRank}
                title={labels.organization}
              >
                {organization ?? notAvailable}
              </ContentSection>
              {teamSection}
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <ContentSection
                headingRank={headingRank}
                title={labels.extSizeOfOrganization}
              >
                {getLocalizedName(extSizeOfOrganization?.label, intl)}
              </ContentSection>
              <ContentSection
                headingRank={headingRank}
                title={labels.extRoleSeniority}
              >
                {getLocalizedName(extRoleSeniority?.label, intl)}
              </ContentSection>
            </div>
          </>
        )}
        {isGov && (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <ContentSection
                headingRank={headingRank}
                title={labels.department}
              >
                {getLocalizedName(department?.name, intl)}
              </ContentSection>
              {teamSection}
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <ContentSection
                headingRank={headingRank}
                title={labels.govEmploymentType}
              >
                {getLocalizedName(govEmploymentType?.label, intl)}
              </ContentSection>
              {govType === GovEmployeeType.Indeterminate && (
                <ContentSection
                  headingRank={headingRank}
                  title={labels.positionType}
                >
                  {getLocalizedName(govPositionType?.label, intl)}
                </ContentSection>
              )}
            </div>
            {govType === GovEmployeeType.Contractor && (
              <div className="grid gap-6 sm:grid-cols-2">
                <ContentSection
                  headingRank={headingRank}
                  title={labels.govContractorRoleSeniority}
                >
                  {getLocalizedName(govContractorRoleSeniority?.label, intl)}
                </ContentSection>
                <ContentSection
                  headingRank={headingRank}
                  title={labels.govContractorType}
                >
                  {getLocalizedName(govContractorType?.label, intl)}
                </ContentSection>
              </div>
            )}
            {govType === GovEmployeeType.Contractor &&
              govContractorType?.value === GovContractorType.FirmOrAgency && (
                <ContentSection
                  headingRank={headingRank}
                  title={labels.contractorFirmAgencyName}
                >
                  {contractorFirmAgencyName ?? notAvailable}
                </ContentSection>
              )}
            {showClassification && (
              <div className="grid gap-6 sm:grid-cols-2">
                <ContentSection
                  headingRank={headingRank}
                  title={labels.classificationGroup}
                >
                  {classification?.group ?? notAvailable}
                </ContentSection>
                <ContentSection
                  headingRank={headingRank}
                  title={labels.classificationLevel}
                >
                  {classification
                    ? String(classification.level).padStart(2, "0")
                    : notAvailable}
                </ContentSection>
              </div>
            )}
          </>
        )}
        {isCaf && (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <ContentSection
                headingRank={headingRank}
                title={labels.organization}
              >
                {getLocalizedName(employmentCategory?.label, intl)}
              </ContentSection>
              <ContentSection
                headingRank={headingRank}
                title={labels.cafEmploymentType}
              >
                {getLocalizedName(cafEmploymentType?.label, intl)}
              </ContentSection>
            </div>
            <ContentSection
              headingRank={headingRank}
              title={intl.formatMessage({
                defaultMessage: "Military force",
                id: "kdXBAS",
                description: "Label for the military force radio group",
              })}
            >
              {getLocalizedName(cafForce?.label, intl)}
            </ContentSection>
            <ContentSection headingRank={headingRank} title={labels.cafRank}>
              {getLocalizedName(cafRank?.label, intl)}
            </ContentSection>
          </>
        )}
        {!isExternal && !isGov && !isCaf && teamSection}
        <ContentSection
          headingRank={headingRank}
          title={labels.keyTasksAndResponsibilities}
        >
          {details ?? notAvailable}
        </ContentSection>
      </div>
      <WorkStreamContent workStreams={workStreams} headingRank={headingRank} />
      {(isExternal || isGov) && (
        <>
          <Separator space="sm" decorative />
          <SupervisoryContent
            experience={experience}
            headingRank={headingRank}
          />
        </>
      )}
    </>
  );
};

export default WorkDialogContent;
