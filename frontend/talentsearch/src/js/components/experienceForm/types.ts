import {
  AwardedScope,
  AwardedTo,
  EducationStatus,
  EducationType,
  Maybe,
  Scalars,
  Skill,
} from "@common/api/generated";

export type ExperienceType =
  | "award"
  | "community"
  | "education"
  | "personal"
  | "work";

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
  areaOfStudy?: Maybe<string>;
  awardedDate?: Maybe<string>;
  awardedTo?: Maybe<AwardedTo>;
  awardedScope?: Maybe<AwardedScope>;
  description?: Maybe<string>;
  details?: Maybe<string>;
  division?: Maybe<string>;
  endDate?: Maybe<Scalars["Date"]>;
  institution?: Maybe<string>;
  issuedBy?: Maybe<string>;
  organization?: Maybe<string>;
  project?: Maybe<string>;
  role?: Maybe<string>;
  startDate?: Maybe<Scalars["Date"]>;
  status?: Maybe<EducationStatus>;
  thesisTitle?: Maybe<string>;
  title?: Maybe<string>;
  type?: Maybe<EducationType>;
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
  skills: Maybe<{ [id: string]: { details: string } }>;
};
