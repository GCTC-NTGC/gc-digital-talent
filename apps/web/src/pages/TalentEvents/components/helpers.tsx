import { IntlShape } from "react-intl";

import { Chip, Color, Link } from "@gc-digital-talent/ui";
import {
  LocalizedTalentNominationEventStatus,
  Maybe,
  TalentNominationEventStatus,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

const getTalentNominationEventStatusColor = (
  talentNominationEventStatus?: Maybe<TalentNominationEventStatus>,
): Color => {
  switch (talentNominationEventStatus) {
    case TalentNominationEventStatus.Active:
      return "primary";
    case TalentNominationEventStatus.Upcoming:
      return "secondary";
    case TalentNominationEventStatus.Past:
      return "black";
    default:
      return "white";
  }
};

export const statusCell = (
  talentNominationEventStatus:
    | Maybe<LocalizedTalentNominationEventStatus>
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
