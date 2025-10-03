import { EmployeeWfa, Maybe } from "@gc-digital-talent/graphql";

type SimpleWfa =
  | Maybe<Pick<EmployeeWfa, "wfaInterest" | "wfaDate">>
  | undefined;

export function hasAllEmptyFields(wfa: SimpleWfa): boolean {
  return !wfa?.wfaInterest && !wfa?.wfaDate;
}

export function hasAnyEmptyFields(wfa: SimpleWfa): boolean {
  return !wfa?.wfaInterest || !wfa?.wfaDate;
}

export function hasEmptyRequiredFields(_: SimpleWfa): boolean {
  // no required fields
  return false;
}
