import React from "react";

import { Pool } from "~/api/generated";
import { EditPoolSectionMetadata } from "~/types/pool";

export type DisplayProps = {
  pool: Pool;
  subtitle: React.ReactNode;
};

export type SectionProps<T> = {
  pool: Pool;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: T) => Promise<void>;
};

export type SectionKey =
  | "poolName"
  | "closingDate"
  | "yourImpact"
  | "workTasks"
  | "essentialSkills"
  | "assetSkills"
  | "educationRequirements"
  | "otherRequirements"
  | "whatToExpect"
  | "specialNote";
