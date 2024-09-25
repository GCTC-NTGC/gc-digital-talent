import { IntlShape } from "react-intl";
import uniq from "lodash/uniq";

import { PoolCandidateSearchStatus } from "@gc-digital-talent/graphql";
import { assertUnreachable, notEmpty } from "@gc-digital-talent/helpers";
import { ChipProps } from "@gc-digital-talent/ui";

// figure out what the chip should look like for a given status
export function deriveChipSettings(
  status: PoolCandidateSearchStatus,
  intl: IntlShape,
): { color: ChipProps["color"]; label: string } {
  switch (status) {
    case PoolCandidateSearchStatus.New:
      return {
        color: "secondary",
        label: intl.formatMessage({
          defaultMessage: "Submitted",
          id: "BNH3hk",
          description:
            "Label for pool candidate search requests that are submitted",
        }),
      };
    case PoolCandidateSearchStatus.InProgress:
      return {
        color: "secondary",
        label: intl.formatMessage({
          defaultMessage: "Under review",
          id: "YYmuJo",
          description:
            "Label for pool candidate search requests that are under review",
        }),
      };
    case PoolCandidateSearchStatus.Waiting:
      return {
        color: "warning",
        label: intl.formatMessage({
          defaultMessage: "Awaiting response",
          id: "MOKBPl",
          description:
            "Label for pool candidate search requests that are awaiting a response",
        }),
      };
    case PoolCandidateSearchStatus.Done:
    case PoolCandidateSearchStatus.DoneNoCandidates:
    case PoolCandidateSearchStatus.NotCompliant:
      return {
        color: "success",
        label: intl.formatMessage({
          defaultMessage: "Complete",
          id: "dwgG5b",
          description:
            "Label for pool candidate search requests that are complete",
        }),
      };
    default:
      return assertUnreachable(status);
  }
}

// map an array of items to a single unique string
export function deriveSingleString<T>(
  values: (T | null)[] | null | undefined,
  mapper: (item: T) => string,
): string | null {
  const localizedStrings = values?.filter(notEmpty)?.map(mapper);
  localizedStrings?.sort();

  const uniqueClassificationStrings = uniq(localizedStrings);

  const singleString =
    uniqueClassificationStrings.length > 0
      ? uniqueClassificationStrings.join(", ")
      : null;

  return singleString;
}
