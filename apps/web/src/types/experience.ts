import type { OperationResult } from "urql";

import type { FieldLabels } from "@gc-digital-talent/forms";
import type {
  AwardExperience,
  AwardExperienceInput,
  AwardedScope,
  AwardedTo,
  CommunityExperience,
  CommunityExperienceInput,
  CreateAwardExperienceMutation,
  CreateCommunityExperienceMutation,
  CreateEducationExperienceMutation,
  CreatePersonalExperienceMutation,
  CreateWorkExperienceMutation,
  EducationExperience,
  EducationExperienceInput,
  EducationStatus,
  EducationType,
  Exact,
  LocalizedString,
  PersonalExperience,
  PersonalExperienceInput,
  WorkExperienceInput,
  WorkExperience,
  EmploymentCategory,
  ExternalSizeOfOrganization,
  ExternalRoleSeniority,
  GovEmployeeType,
  CafForce,
  CafRank,
  CafEmploymentType,
  GovPositionType,
  GovContractorRoleSeniority,
  GovContractorType,
  CSuiteRoleTitle,
  DepartmentBelongsTo,
} from "@gc-digital-talent/graphql";

import type { SimpleAnyExperience } from "~/utils/experienceUtils";

export type ExperienceType =
  "award" | "community" | "education" | "personal" | "work";

export type AnyExperience =
  | Omit<AwardExperience, "user">
  | Omit<CommunityExperience, "user">
  | Omit<EducationExperience, "user">
  | Omit<PersonalExperience, "user">
  | Omit<WorkExperience, "user">;

export interface ExperienceForDate extends SimpleAnyExperience {
  awardedDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

interface FormValueDateRange {
  startDate: string;
  endDate?: string;
}

interface AwardFormValues {
  awardTitle: string;
  awardedTo: AwardedTo;
  issuedBy: string;
  awardedScope: AwardedScope;
  awardedDate: string;
}

export type CommunityFormValues = FormValueDateRange & {
  title: string;
  organization: string;
  project: string;
  startDate: string;
  roleStatus: "active" | "past";
  endDate?: string;
};

export type EducationFormValues = FormValueDateRange & {
  institution: string;
  areaOfStudy: string;
  thesisTitle?: string;
  educationType: EducationType;
  educationStatus: EducationStatus;
  currentRole: boolean;
};

export type PersonalFormValues = FormValueDateRange & {
  experienceTitle: string;
  experienceDescription: string;
  disclaimer: boolean;
  currentRole: boolean;
};

export type WorkFormValues = FormValueDateRange & {
  role: string | null;
  organization: string | null;
  team?: string | null;
  employmentCategory?: EmploymentCategory | null;
  extSizeOfOrganization?: ExternalSizeOfOrganization | null;
  extRoleSeniority?: ExternalRoleSeniority | null;
  department?: string | null;
  classificationGroup: string | null;
  classificationLevel: string | null;
  govEmploymentType?: GovEmployeeType | null;
  govPositionType?: GovPositionType | null;
  govContractorRoleSeniority?: GovContractorRoleSeniority | null;
  govContractorType?: GovContractorType | null;
  contractorFirmAgencyName?: string | null;
  cafEmploymentType?: CafEmploymentType | null;
  cafForce?: CafForce | null;
  cafRank?: CafRank | null;
  currentRole: boolean;
  workStreams?: string[];
  supervisoryPosition?: boolean;
  supervisedEmployees?: boolean;
  supervisedEmployeesNumber?: number | null;
  budgetManagement?: boolean;
  annualBudgetAllocation?: number | null;
  seniorManagementStatus?: boolean;
  cSuiteRoleTitle?: CSuiteRoleTitle | null;
  otherCSuiteRoleTitle?: string | null;
};

export type AllExperienceFormValues = AwardFormValues &
  CommunityFormValues &
  EducationFormValues &
  PersonalFormValues &
  WorkFormValues & {
    experienceType?: ExperienceType;
  };

export interface FormSkill {
  id?: string | null;
  skillId: string;
  details: string;
  name: LocalizedString;
}
export type FormSkills = FormSkill[];

export type ExperienceFormValues<T> = T & {
  details: string;
  skills?: FormSkills | null;
};

export interface SubExperienceFormProps {
  labels: FieldLabels;
}

export interface ExperienceDetailsSubmissionData {
  areaOfStudy?: string;
  awardedDate?: string;
  awardedTo?: AwardedTo;
  awardedScope?: AwardedScope;
  description?: string;
  details?: string;
  division?: string | null;
  currentRole?: boolean;
  endDate?: string | null;
  institution?: string;
  issuedBy?: string;
  organization?: string;
  project?: string;
  role?: string | null;
  startDate?: string;
  status?: EducationStatus;
  thesisTitle?: string;
  title?: string | null;
  type?: EducationType;
  employmentCategory?: EmploymentCategory | null;
  extSizeOfOrganization?: ExternalSizeOfOrganization | null;
  extRoleSeniority?: ExternalRoleSeniority | null;
  department?: DepartmentBelongsTo | null;
  classificationId?: string | null;
  govEmploymentType?: GovEmployeeType | null;
  govPositionType?: GovPositionType | null;
  govContractorRoleSeniority?: GovContractorRoleSeniority | null;
  govContractorType?: GovContractorType | null;
  contractorFirmAgencyName?: string | null;
  cafEmploymentType?: CafEmploymentType | null;
  cafForce?: CafForce | null;
  cafRank?: CafRank | null;
  skills?: {
    sync?:
      | ({ id: string; details: string | null | undefined } | undefined)[]
      | undefined;
    connect?:
      | ({ id: string; details: string | null | undefined } | undefined)[]
      | undefined;
  };
  workStreams?: {
    sync?: string[];
  };
  supervisoryPosition?: boolean;
  supervisedEmployees?: boolean;
  supervisedEmployeesNumber?: number | null;
  budgetManagement?: boolean;
  annualBudgetAllocation?: number | null;
  seniorManagementStatus?: boolean;
  cSuiteRoleTitle?: CSuiteRoleTitle | null;
  otherCSuiteRoleTitle?: string | null;
}

type ExperienceMutations = CreateAwardExperienceMutation &
  CreateCommunityExperienceMutation &
  CreateEducationExperienceMutation &
  CreatePersonalExperienceMutation &
  CreateWorkExperienceMutation;

type GenericExperienceMutationResponse<T> = OperationResult<
  T,
  Record<string, string | ExperienceDetailsSubmissionData>
>;

export type ExperienceMutationResponse =
  GenericExperienceMutationResponse<ExperienceMutations>;

export type ExperienceMutationArgs = Exact<{
  id: string;
  awardExperience: AwardExperienceInput;
}> &
  Exact<{
    id: string;
    communityExperience: CommunityExperienceInput;
  }> &
  Exact<{
    id: string;
    educationExperience: EducationExperienceInput;
  }> &
  Exact<{
    id: string;
    personalExperience: PersonalExperienceInput;
  }> &
  Exact<{
    id: string;
    workExperience: WorkExperienceInput;
  }>;

export interface ExperienceDetailsDefaultValues {
  areaOfStudy?: string;
  awardedDate?: string;
  awardedTo?: AwardedTo;
  awardedScope?: AwardedScope;
  description?: string;
  details?: string;
  team?: string;
  endDate?: string;
  institution?: string;
  issuedBy?: string;
  organization?: string;
  project?: string;
  role?: string;
  startDate?: string;
  educationStatus?: EducationStatus;
  thesisTitle?: string;
  title?: string;
  educationType?: EducationType;
  employmentCategory?: EmploymentCategory;
  extSizeOfOrganization?: ExternalSizeOfOrganization;
  extRoleSeniority?: ExternalRoleSeniority;
  department?: string;
  classificationGroup?: string;
  classificationLevel?: string;
  govEmploymentType?: GovEmployeeType;
  govPositionType?: GovPositionType;
  govContractorRoleSeniority?: GovContractorRoleSeniority;
  govContractorType?: GovContractorType;
  contractorFirmAgencyName?: string;
  cafEmploymentType?: CafEmploymentType;
  cafForce?: CafForce;
  cafRank?: CafRank;
  skills?: FormSkills;
  supervisoryPosition?: boolean;
  supervisedEmployees?: boolean;
  supervisedEmployeesNumber?: number;
  budgetManagement?: boolean;
  annualBudgetAllocation?: number;
  seniorManagementStatus?: boolean;
  cSuiteRoleTitle?: CSuiteRoleTitle;
  otherCSuiteRoleTitle?: string;
}
