import {
  Pool,
  Classification,
  Maybe,
  UserPublicProfile,
} from "~/api/generated";

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
  hasError?: boolean;
}

export type PageNavKeys = "view" | "edit" | "screening" | "candidates";

export type PoolCompleteness = "incomplete" | "complete" | "submitted";
