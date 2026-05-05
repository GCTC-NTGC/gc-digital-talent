import {
  CommunityInterestAdditionalDuty,
  FinanceChiefRole,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

// test and convert a raw string the enum type CommunityInterestAdditionalDuty
function stringToEnumCommunityInterestAdditionalDuty(
  selection: string | null | undefined,
): CommunityInterestAdditionalDuty | undefined {
  if (
    Object.values(CommunityInterestAdditionalDuty).includes(
      selection as CommunityInterestAdditionalDuty,
    )
  ) {
    return selection as CommunityInterestAdditionalDuty;
  }
  return undefined;
}

export function stringArrayToEnumsCommunityInterestAdditionalDuty(
  selections: string[] | null | undefined,
): CommunityInterestAdditionalDuty[] {
  return unpackMaybes(
    selections?.map((selection) => {
      return stringToEnumCommunityInterestAdditionalDuty(selection);
    }),
  );
}

// test and convert a raw string the enum type FinanceChiefRole
function stringToEnumFinanceChiefRole(
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
