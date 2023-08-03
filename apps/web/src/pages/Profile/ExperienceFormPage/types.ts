import {
  AwardedScope,
  AwardedTo,
  EducationStatus,
  EducationType,
  LocalizedString,
  Scalars,
} from "~/api/generated";

import { FormSkills } from "~/types/experience";

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
