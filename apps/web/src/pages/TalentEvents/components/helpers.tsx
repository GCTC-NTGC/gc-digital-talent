import type { IntlShape } from "react-intl";

import type { ChipProps } from "@gc-digital-talent/ui";
import { Chip, Link } from "@gc-digital-talent/ui";
import type { LocalizedTalentNominationEventStatus } from "@gc-digital-talent/graphql";
import { TalentNominationEventStatus } from "@gc-digital-talent/graphql";

import type useRoutes from "~/hooks/useRoutes";

const getTalentNominationEventStatusColor = (
  talentNominationEventStatus?: TalentNominationEventStatus | null,
): ChipProps["color"] => {
  switch (talentNominationEventStatus) {
    case TalentNominationEventStatus.Active:
      return "primary";
    case TalentNominationEventStatus.Upcoming:
      return "secondary";
    case TalentNominationEventStatus.Past:
      return "gray";
    default:
      return "gray";
  }
};

export const statusCell = (
  talentNominationEventStatus:
    | LocalizedTalentNominationEventStatus
    | null
    | undefined,
) => {
  const color = getTalentNominationEventStatusColor(
    talentNominationEventStatus?.value,
  );
  return (
    <Chip color={color}>{talentNominationEventStatus?.label.localized}</Chip>
  );
};

export const nominationsCell = (
  id: string,
  count: number,
  routes: ReturnType<typeof useRoutes>,
  intl: IntlShape,
) =>
  count > 0 ? (
    <Link href={routes.adminTalentManagementEventNominations(id)}>
      {intl.formatMessage(
        {
          defaultMessage:
            "{nominationCount, plural, =0 {0 nominees} one {# nominee} other {# nominees}}",
          id: "Lj0csm",
          description: "Count of nominees",
        },
        { nominationCount: count },
      )}
    </Link>
  ) : (
    intl.formatMessage({
      defaultMessage: "None",
      id: "GrHEFV",
      description: "None",
    })
  );
