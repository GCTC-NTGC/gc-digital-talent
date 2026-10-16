import { empty } from "@gc-digital-talent/helpers";
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
  CSuiteRoleTitle,
  EmploymentCategory,
  GovContractorType,
  GovEmployeeType,
} from "@gc-digital-talent/graphql";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

interface WorkDepartment {
  name?: LocalizedString | null;
}

interface WorkClassification {
  group: string;
  level: number;
}

interface WorkFields {
  role?: string | null;
  startDate?: string | null;
  details?: string | null;
  organization?: string | null;
  division?: string | null;
  employmentCategory?: LocalizedEnumValue<EmploymentCategory> | null;
  extSizeOfOrganization?: LocalizedEnumValue<ExternalSizeOfOrganization> | null;
  extRoleSeniority?: LocalizedEnumValue<ExternalRoleSeniority> | null;
  department?: WorkDepartment | null;
  govEmploymentType?: LocalizedEnumValue<GovEmployeeType> | null;
  govPositionType?: LocalizedEnumValue<GovPositionType> | null;
  govContractorRoleSeniority?: LocalizedEnumValue<GovContractorRoleSeniority> | null;
  govContractorType?: LocalizedEnumValue<GovContractorType> | null;
  contractorFirmAgencyName?: string | null;
  classification?: WorkClassification | null;
  cafEmploymentType?: LocalizedEnumValue<CafEmploymentType> | null;
  cafForce?: LocalizedEnumValue<CafForce> | null;
  cafRank?: LocalizedEnumValue<CafRank> | null;
  supervisedEmployees?: boolean | null;
  supervisedEmployeesNumber?: number | null;
  budgetManagement?: boolean | null;
  annualBudgetAllocation?: number | null;
  seniorManagementStatus?: boolean | null;
  cSuiteRoleTitle?: LocalizedEnumValue<CSuiteRoleTitle> | null;
  otherCSuiteRoleTitle?: string | null;
}

/*
  Mirrors the required rules in ExperienceFormFields/WorkFields.
  End dates aren't checked since a missing end date can't be told apart from an ongoing one.
*/
export function hasEmptyRequiredFields({
  role,
  startDate,
  details,
  organization,
  division,
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
  supervisedEmployees,
  supervisedEmployeesNumber,
  budgetManagement,
  annualBudgetAllocation,
  seniorManagementStatus,
  cSuiteRoleTitle,
  otherCSuiteRoleTitle,
}: WorkFields): boolean {
  const category = employmentCategory?.value;
  const govType = govEmploymentType?.value;
  const isExternal = category === EmploymentCategory.ExternalOrganization;
  const isGov = category === EmploymentCategory.GovernmentOfCanada;
  const isCaf = category === EmploymentCategory.CanadianArmedForces;
  const hasClassification =
    govType === GovEmployeeType.Casual ||
    govType === GovEmployeeType.Indeterminate ||
    govType === GovEmployeeType.Term ||
    govType === GovEmployeeType.Interchange;
  const isContractor = govType === GovEmployeeType.Contractor;

  return !!(
    !role ||
    !startDate ||
    !details ||
    !category ||
    (isExternal &&
      (!organization ||
        !division ||
        !extSizeOfOrganization?.value ||
        !extRoleSeniority?.value)) ||
    (isGov && (!department || !division || !govType)) ||
    (isGov &&
      govType === GovEmployeeType.Indeterminate &&
      !govPositionType?.value) ||
    (isGov && hasClassification && !classification) ||
    (isGov &&
      isContractor &&
      (!govContractorRoleSeniority?.value || !govContractorType?.value)) ||
    (isGov &&
      isContractor &&
      govContractorType?.value === GovContractorType.FirmOrAgency &&
      !contractorFirmAgencyName) ||
    (isCaf &&
      (!cafEmploymentType?.value || !cafForce?.value || !cafRank?.value)) ||
    ((isExternal || isGov) &&
      ((supervisedEmployees && empty(supervisedEmployeesNumber)) ||
        (budgetManagement && empty(annualBudgetAllocation)) ||
        (seniorManagementStatus && !cSuiteRoleTitle?.value) ||
        (cSuiteRoleTitle?.value === CSuiteRoleTitle.Other &&
          !otherCSuiteRoleTitle)))
  );
}
