import {
  LocalizedStringInput,
  Maybe,
  Scalars,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  displayName?: Maybe<LocalizedStringInput>;
  contactEmail?: Maybe<Scalars["Email"]["output"]>;
  departments?: Scalars["UUID"]["output"][];
  description?: Maybe<LocalizedStringInput>;
  name?: string;
}
