import { HeadingProps, IconType } from "@gc-digital-talent/ui";

import { Status } from "~/components/StatusItem/StatusItem";

export interface EditPoolSectionMetadata {
  id: string;
  title: string;
  shortTitle?: string;
  subtitle?: string;
  hasError?: boolean;
  icon?: IconType;
  color?: HeadingProps["color"];
  status?: Status;
  inList?: boolean;
}

export type PageNavKeys =
  | "view"
  | "edit"
  | "plan"
  | "screening"
  | "candidates"
  | "manage-access";

export type PoolCompleteness = "incomplete" | "complete" | "submitted";
