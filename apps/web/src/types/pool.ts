import {
  HeadingProps,
  IconType,
  StatusItemStatus,
} from "@gc-digital-talent/ui";

export interface EditPoolSectionMetadata {
  id: string;
  title: string;
  shortTitle?: string;
  subtitle?: string;
  hasError?: boolean;
  icon?: IconType;
  color?: HeadingProps["color"];
  status?: StatusItemStatus;
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
