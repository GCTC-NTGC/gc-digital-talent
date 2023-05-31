import {
  Pool,
  Classification,
  Maybe,
  UserPublicProfile,
} from "~/api/generated";

export type SimpleClassification = Pick<Classification, "group" | "level">;
export type SimpleOwner = Pick<
  UserPublicProfile,
  "email" | "firstName" | "lastName"
>;

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
}

export type PageNavKeys = "view" | "edit" | "candidates";
