export interface FormValues {
  languageAbility: string;
  classifications: string[];
  stream: string[];
  operationalRequirement: string[];
  workRegion: string[];
  equity: string[];
  poolCandidateStatus: string[];
  priorityWeight: string[];
  pools: string[];
  skills: string[];
  expiryStatus: string;
  suspendedStatus: string;
  publishingGroups: string[];
  govEmployee: string;
  community: string;
}
export enum CsvType {
  ApplicationCsv = "application",
  ProfileCsv = "profile",
}
