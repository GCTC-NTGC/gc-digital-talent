import React from "react";

import { Pool } from "~/api/generated";
import { EditPoolSectionMetadata } from "~/types/pool";

export type DisplayProps = {
  pool: Pool;
  subtitle?: React.ReactNode;
};

export type SectionProps<T> = {
  pool: Pool;
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
  | "commonQuestions"
  | "whatToExpect"
  | "generalQuestions";
