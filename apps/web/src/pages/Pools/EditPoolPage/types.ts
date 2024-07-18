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
  | EditPoolYourImpactFragment;

export type DisplayProps = {
  pool: PoolDisplayFragments;
  subtitle?: ReactNode;
};

export type SectionProps<T, F> = {
  poolQuery: F;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: T) => Promise<void>;
};

export type PublishedEditableSectionProps = {
  onUpdatePublished: (submitData: UpdatePublishedPoolInput) => Promise<void>;
};

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
  | "generalQuestions";

export type PoolSkillMutationsType = {
  create: (
    poolId: string,
    skillId: string,
    poolSkill: CreatePoolSkillInput,
  ) => Promise<void>;
  update: (id: string, poolSkill: UpdatePoolSkillInput) => Promise<void>;
  delete: (id: string) => Promise<void>;
};
