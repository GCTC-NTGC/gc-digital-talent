import { LocalizedString, Scalars } from "@gc-digital-talent/graphql";

// a dropdown list option
export type IdNamePair = {
  id: Scalars["ID"];
  name: LocalizedString;
};
