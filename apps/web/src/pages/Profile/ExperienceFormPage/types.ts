import { OperationResult } from "urql";

import type { FieldLabels } from "@gc-digital-talent/forms";

import {
  AwardedScope,
  AwardedTo,
  EducationStatus,
  EducationType,
  Exact,
  LocalizedString,
  Maybe,
  Scalars,
  AwardExperienceInput,
  CommunityExperienceInput,
  CreateAwardExperienceMutation,
  CreateCommunityExperienceMutation,
  CreateEducationExperienceMutation,
  CreatePersonalExperienceMutation,
  CreateWorkExperienceMutation,
  EducationExperienceInput,
  PersonalExperienceInput,
  WorkExperienceInput,
} from "~/api/generated";

export type ExperienceType =
  | "award"
  | "community"
  | "education"
  | "personal"
  | "work";

export type Experience = {
  __typename: string;
};

export type FormSkill = {
  id?: Maybe<string>;
  skillId: string;
  details: string;
  name: LocalizedString;
};
export type FormSkills = Array<FormSkill>;

export type FormValueDateRange = {
  startDate: Scalars["Date"];
  endDate?: Scalars["Date"];
};

export type AwardFormValues = {
  awardTitle: string;
  awardedTo: AwardedTo;
  issuedBy: string;
  awardedScope: AwardedScope;
  awardedDate: Scalars["Date"];
};

export type CommunityFormValues = FormValueDateRange & {
  title: string;
  organization: string;
  project: string;
  startDate: Scalars["Date"];
  currentRole: boolean;
  endDate?: Scalars["Date"];
};

export type EducationFormValues = FormValueDateRange & {
  institution: string;
  areaOfStudy: string;
  thesisTitle?: string;
  educationType: EducationType;
  educationStatus: EducationStatus;
};

export type PersonalFormValues = FormValueDateRange & {
  experienceTitle: string;
  experienceDescription: string;
};

export type WorkFormValues = FormValueDateRange & {
  role: string;
  organization: string;
  team?: string;
};

export type ExperienceDetailsSubmissionData = {
  areaOfStudy?: string;
  awardedDate?: string;
  awardedTo?: AwardedTo;
  awardedScope?: AwardedScope;
  description?: string;
  details?: string;
  division?: string;
  currentRole?: boolean;
  endDate?: Scalars["Date"] | null;
  institution?: string;
  issuedBy?: string;
  organization?: string;
  project?: string;
  role?: string;
  startDate?: Scalars["Date"];
  status?: EducationStatus;
  thesisTitle?: string;
  title?: string;
  type?: EducationType;
  skills?: {
    sync: ({ id: string; details: Maybe<string> } | undefined)[] | undefined;
  };
};

export type ExperienceDetailsDefaultValues = {
  areaOfStudy?: string;
  awardedDate?: string;
  awardedTo?: AwardedTo;
  awardedScope?: AwardedScope;
  description?: string;
  details?: string;
  team?: string;
  endDate?: Scalars["Date"];
  institution?: string;
  issuedBy?: string;
  organization?: string;
  project?: string;
  role?: string;
  startDate?: Scalars["Date"];
  educationStatus?: EducationStatus;
  thesisTitle?: string;
  title?: string;
  educationType?: EducationType;
  skills?: FormSkills;
};

export type ExperienceQueryData = {
  details?: string;
  issuedBy?: string;
  awardedDate?: Scalars["Date"];
  awardedTo?: AwardedTo;
  awardedScope?: AwardedScope;
  role?: string;
  organization?: string;
  project?: string;
  division?: string;
  startDate?: Scalars["Date"];
  endDate?: Scalars["Date"];
  status?: EducationStatus;
  type?: EducationType;
  areaOfStudy?: string;
  institution?: string;
  thesisTitle?: string;
  title?: string;
  description?: string;
  skills?: {
    id: string;
    name: LocalizedString;
    key: string;
    experienceSkillRecord?: {
      details: string;
    };
  }[];
};

export type OptionalFormValues =
  | AwardFormValues
  | CommunityFormValues
  | EducationFormValues
  | PersonalFormValues
  | WorkFormValues;

export type AllFormValues = AwardFormValues &
  CommunityFormValues &
  EducationFormValues &
  PersonalFormValues &
  WorkFormValues;

export type FormValues<T> = T & {
  details: string;
  skills: Maybe<FormSkills>;
};

export type ExperienceMutations = CreateAwardExperienceMutation &
  CreateCommunityExperienceMutation &
  CreateEducationExperienceMutation &
  CreatePersonalExperienceMutation &
  CreateWorkExperienceMutation;

export type GenericExperienceMutationResponse<T> = OperationResult<
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

export interface SubExperienceFormProps {
  labels: FieldLabels;
}
