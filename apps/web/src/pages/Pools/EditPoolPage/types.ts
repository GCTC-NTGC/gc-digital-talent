import React from "react";

import {
  CreatePoolSkillInput,
  UpdatePoolSkillInput,
  Pool,
} from "@gc-digital-talent/graphql";

import { EditPoolSectionMetadata } from "~/types/pool";

export type DisplayProps = {
  pool: Pool;
  subtitle?: React.ReactNode;
};

export type SectionProps<T, F> = {
  poolQuery: F;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: T) => Promise<void>;
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
