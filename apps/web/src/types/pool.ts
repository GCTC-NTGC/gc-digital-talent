import { IconType } from "@gc-digital-talent/ui";

import {
  Pool,
  Classification,
  Maybe,
  UserPublicProfile,
} from "~/api/generated";
import { Status, StatusColor } from "~/components/StatusItem/StatusItem";

export type SimpleClassification = Pick<Classification, "group" | "level">;
type SimpleOwner = Pick<UserPublicProfile, "email" | "firstName" | "lastName">;

export type SimplePool = Pick<
  Pool,
  "id" | "name" | "classifications" | "stream"
> & {
  classifications?: Maybe<Array<Maybe<SimpleClassification>>>;
  owner?: Maybe<SimpleOwner>;
};

export interface EditPoolSectionMetadata {
  id: string;
  title: string;
  shortTitle?: string;
  subtitle?: string;
  hasError?: boolean;
  icon?: IconType;
  color?: StatusColor;
  status?: Status;
  inList?: boolean;
}

export type PageNavKeys = "view" | "edit" | "plan" | "screening" | "candidates";

export type PoolCompleteness = "incomplete" | "complete" | "submitted";
