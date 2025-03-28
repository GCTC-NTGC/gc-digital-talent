import { IntlShape } from "react-intl";

import { Chip, Color, Link } from "@gc-digital-talent/ui";
import {
  LocalizedTalentNominationEventStatus,
  Maybe,
  TalentNominationEventStatus,
  TalentNominationGroup,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

export const getNominationCount = (
  talentNominationGroups?: TalentNominationGroup[] | null,
) =>
  talentNominationGroups?.reduce((acc, i) => {
    return acc + (i.nominations?.length ?? 0);
  }, 0) ?? 0;

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
            "{nominationCount, plural, =0 {0 nominees} =1 {1 nominee} other {# nominees}}",
          id: "HkFHt6",
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
