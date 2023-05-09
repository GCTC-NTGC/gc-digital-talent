// Note: __typename comes from the API so can be ignored here
/* eslint-disable no-underscore-dangle */
import { notEmpty } from "@gc-digital-talent/helpers";
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
  Skill,
  WorkExperience,
} from "~/api/generated";
import { OperationResult } from "urql";

export type ExperienceType =
  | "award"
  | "community"
  | "education"
  | "personal"
  | "work";

export type AnyExperience =
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

export type ExperienceForDate =
  | (AwardExperience & { startDate: string; endDate: string })
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

export const compareByDate = (e1: ExperienceForDate, e2: ExperienceForDate) => {
  const e1EndDate = e1.endDate ? new Date(e1.endDate).getTime() : null;
  const e2EndDate = e2.endDate ? new Date(e2.endDate).getTime() : null;
  const e1StartDate = e1.startDate ? new Date(e1.startDate).getTime() : -1;
  const e2StartDate = e2.startDate ? new Date(e2.startDate).getTime() : -1;

  // All items with no end date should be at the top and sorted by most recent start date.
  if (!e1EndDate && !e2EndDate) {
    return e2StartDate - e1StartDate;
  }

  if (!e1EndDate) {
    return -1;
  }

  if (!e2EndDate) {
    return 1;
  }

  // Items with end date should be sorted by most recent end date at top.
  return e2EndDate - e1EndDate;
};

type MergedExperiences = Array<
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience
>;

export const flattenExperienceSkills = (
  experiences: MergedExperiences,
): Skill[] => {
  return experiences
    .map((experience) => {
      const { skills } = experience;
      return skills?.filter(notEmpty);
    })
    .filter(notEmpty)
    .flatMap((skill) => skill);
};

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

export type OptionalExperienceFormValues =
  | AwardFormValues
  | CommunityFormValues
  | EducationFormValues
  | PersonalFormValues
  | WorkFormValues;

export type AllExperienceFormValues = AwardFormValues &
  CommunityFormValues &
  EducationFormValues &
  PersonalFormValues &
  WorkFormValues;

export type FormSkill = {
  id?: Maybe<string>;
  skillId: string;
  details: string;
  name: LocalizedString;
};
export type FormSkills = Array<FormSkill>;

export type ExperienceFormValues<T> = T & {
  details: string;
  skills?: Maybe<FormSkills>;
};

export interface SubExperienceFormProps {
  labels: FieldLabels;
}

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
    sync?: ({ id: string; details: Maybe<string> } | undefined)[] | undefined;
    connect?:
      | ({ id: string; details: Maybe<string> } | undefined)[]
      | undefined;
  };
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
