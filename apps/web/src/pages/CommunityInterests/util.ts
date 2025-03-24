import { FinanceChiefDuty, FinanceChiefRole } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

// test and convert a raw string the enum type FinanceChiefDuty
export function stringToEnumFinanceChiefDuty(
  selection: string | null | undefined,
): FinanceChiefDuty | undefined {
  if (Object.values(FinanceChiefDuty).includes(selection as FinanceChiefDuty)) {
    return selection as FinanceChiefDuty;
  }
  return undefined;
}

export function stringArrayToEnumsFinanceChiefDuty(
  selections: string[] | null | undefined,
): FinanceChiefDuty[] {
  return unpackMaybes(
    selections?.map((selection) => {
      return stringToEnumFinanceChiefDuty(selection);
    }),
  );
}

// test and convert a raw string the enum type FinanceChiefRole
export function stringToEnumFinanceChiefRole(
  selection: string | null | undefined,
): FinanceChiefRole | undefined {
  if (Object.values(FinanceChiefRole).includes(selection as FinanceChiefRole)) {
    return selection as FinanceChiefRole;
  }
  return undefined;
}

export function stringArrayToEnumsFinanceChiefRole(
  selections: string[] | null | undefined,
): FinanceChiefRole[] {
  return unpackMaybes(
    selections?.map((selection) => {
      return stringToEnumFinanceChiefRole(selection);
    }),
  );
}
