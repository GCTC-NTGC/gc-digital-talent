import { ReactNode } from "react";

import {
  CreatePoolSkillInput,
  UpdatePoolSkillInput,
  UpdatePublishedPoolInput,
  EditPoolWhatToExpectAdmissionFragment,
  EditPoolAboutUsFragment,
  EditPoolClosingDateFragment,
  EditPoolCoreRequirementsFragment,
  EditPoolEducationRequirementsFragment,
  EditPoolGeneralQuestionsFragment,
  EditPoolKeyTasksFragment,
  EditPoolNameFragment,
  EditPoolSkillsFragment,
  EditPoolSpecialNoteFragment,
  EditPoolWhatToExpectFragment,
  EditPoolYourImpactFragment,
  EditPoolContactEmailFragment,
} from "@gc-digital-talent/graphql";

import { EditPoolSectionMetadata } from "~/types/pool";

type PoolDisplayFragments =
  | EditPoolAboutUsFragment
  | EditPoolClosingDateFragment
  | EditPoolCoreRequirementsFragment
  | EditPoolEducationRequirementsFragment
  | EditPoolGeneralQuestionsFragment
  | EditPoolKeyTasksFragment
  | EditPoolNameFragment
  | EditPoolSkillsFragment
  | EditPoolSpecialNoteFragment
  | EditPoolWhatToExpectAdmissionFragment
  | EditPoolWhatToExpectFragment
  | EditPoolYourImpactFragment
  | EditPoolContactEmailFragment;

export interface DisplayProps<T extends PoolDisplayFragments> {
  pool: T;
  subtitle?: ReactNode;
}

export interface SectionProps<T, F> {
  poolQuery: F;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: T) => Promise<void>;
}

export interface PublishedEditableSectionProps {
  onUpdatePublished: (submitData: UpdatePublishedPoolInput) => Promise<void>;
}

export type SectionKey =
  | "basicInfo"
  | "poolName"
  | "closingDate"
  | "coreRequirements"
  | "specialNote"
  | "educationRequirements"
  | "skillRequirements"
  | "essentialSkills"
  | "assetSkills"
  | "aboutRole"
  | "yourImpact"
  | "workTasks"
  | "aboutUs"
  | "commonQuestions"
  | "whatToExpect"
  | "whatToExpectAdmission"
  | "contactEmail"
  | "generalQuestions";

export interface PoolSkillMutationsType {
  create: (poolSkill: CreatePoolSkillInput) => Promise<void>;
  update: (id: string, poolSkill: UpdatePoolSkillInput) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
