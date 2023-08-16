import { LocalizedString, Scalars } from "@gc-digital-talent/graphql";

// a dropdown list option
export type IdNamePair = {
  id: Scalars["ID"];
  name: LocalizedString;
};

// backing object for questionnaire form
export type FormValues = {
  readPreamble: boolean | null | undefined;
  department: string;
  departmentOther: string;
  branchOther: string;
  businessOwnerName: string;
  businessOwnerJobTitle: string;
  businessOwnerEmail: string;
  financialAuthorityName: string;
  financialAuthorityJobTitle: string;
  financialAuthorityEmail: string;
  authoritiesInvolved: string;
};
