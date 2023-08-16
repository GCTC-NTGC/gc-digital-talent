export type IdNamePair = {
  id: Scalars["ID"];
  name: LocalizedString;
};

export type FormValues = {
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
