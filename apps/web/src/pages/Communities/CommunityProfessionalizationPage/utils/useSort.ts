import { useIntl } from "react-intl";

import type { CommunityDevelopmentProgram } from "@gc-digital-talent/graphql";
import { getLocale } from "@gc-digital-talent/i18n";

export type SortValues = "recentlyAdded" | "name";

export function useSort(
  communityDevelopmentPrograms: CommunityDevelopmentProgram[],
  sortValues: SortValues,
): CommunityDevelopmentProgram[] {
  const intl = useIntl();
  const locale = getLocale(intl);

  if (sortValues === "name") {
    return communityDevelopmentPrograms.sort((cpd1, cpd2) => {
      const name1 = cpd1.developmentProgram.name[locale] ?? "";
      const name2 = cpd2.developmentProgram.name[locale] ?? "";

      return name1.localeCompare(name2);
    });
  } else {
    return communityDevelopmentPrograms.sort(
      (cdp1, cdp2) =>
        new Date(cdp2.createdAt).getTime() - new Date(cdp1.createdAt).getTime(),
    );
  }
}
