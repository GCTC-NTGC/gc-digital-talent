import { OperationResult } from "urql";

import { FieldLabels } from "@gc-digital-talent/forms";
import {
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
  Maybe,
  PersonalExperience,
  PersonalExperienceInput,
  Scalars,
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

import { SimpleAnyExperience } from "~/utils/experienceUtils";

export type ExperienceType =
  | "award"
  | "community"
  | "education"
  | "personal"
  | "work";

export type AnyExperience =
  | Omit<AwardExperience, "user">
  | Omit<CommunityExperience, "user">
  | Omit<EducationExperience, "user">
  | Omit<PersonalExperience, "user">
  | Omit<WorkExperience, "user">;

export interface ExperienceForDate extends SimpleAnyExperience {
  awardedDate?: Maybe<string>;
  startDate?: Maybe<string>;
  endDate?: Maybe<string>;
}

interface FormValueDateRange {
  startDate: Scalars["Date"]["input"];
  endDate?: Scalars["Date"]["input"];
}

interface AwardFormValues {
  awardTitle: string;
  awardedTo: AwardedTo;
  issuedBy: string;
  awardedScope: AwardedScope;
  awardedDate: Scalars["Date"]["input"];
}

export type CommunityFormValues = FormValueDateRange & {
  title: string;
  organization: string;
  project: string;
  startDate: Scalars["Date"]["input"];
  roleStatus: "active" | "past";
  endDate?: Scalars["Date"]["input"];
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
  id?: Maybe<string>;
  skillId: string;
  details: string;
  name: LocalizedString;
}
export type FormSkills = FormSkill[];

export type ExperienceFormValues<T> = T & {
  details: string;
  skills?: Maybe<FormSkills>;
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
  endDate?: Scalars["Date"]["input"] | null;
  institution?: string;
  issuedBy?: string;
  organization?: string;
  project?: string;
  role?: string | null;
  startDate?: Scalars["Date"]["input"];
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
      | ({ id: string; details: Maybe<string> | undefined } | undefined)[]
      | undefined;
    connect?:
      | ({ id: string; details: Maybe<string> | undefined } | undefined)[]
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
  endDate?: Scalars["Date"]["input"];
  institution?: string;
  issuedBy?: string;
  organization?: string;
  project?: string;
  role?: string;
  startDate?: Scalars["Date"]["input"];
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
