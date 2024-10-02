import { IntlShape } from "react-intl";
import uniq from "lodash/uniq";

import { PoolCandidateSearchStatus } from "@gc-digital-talent/graphql";
import { assertUnreachable } from "@gc-digital-talent/helpers";
import { ChipProps } from "@gc-digital-talent/ui";
import { Locales } from "@gc-digital-talent/i18n";

import messages from "./messages";

// figure out what the chip should look like for a given status
export function deriveChipSettings(
  status: PoolCandidateSearchStatus,
  intl: IntlShape,
): { color: ChipProps["color"]; label: string } {
  switch (status) {
    case PoolCandidateSearchStatus.New:
      return {
        color: "secondary",
        label: intl.formatMessage(messages.statusSubmitted),
      };
    case PoolCandidateSearchStatus.InProgress:
      return {
        color: "secondary",
        label: intl.formatMessage(messages.statusUnderReview),
      };
    case PoolCandidateSearchStatus.Waiting:
      return {
        color: "warning",
        label: intl.formatMessage(messages.statusAwaitingResponse),
      };
    case PoolCandidateSearchStatus.Done:
    case PoolCandidateSearchStatus.DoneNoCandidates:
    case PoolCandidateSearchStatus.NotCompliant:
      return {
        color: "success",
        label: intl.formatMessage(messages.statusComplete),
      };
    default:
      return assertUnreachable(status);
  }
}

// map an array of items to a single unique string
export function deriveSingleString<T>(
  values: T[],
  localizedMapper: (item: T) => string,
  locale: Locales,
): string {
  const localizedStrings = values.map(localizedMapper);
  localizedStrings.sort((a, b) =>
    a.localeCompare(b, locale, { sensitivity: "base" }),
  );

  const uniqueStrings = uniq(localizedStrings);
  const joinedStrings = uniqueStrings.join(", ");

  return joinedStrings;
}
