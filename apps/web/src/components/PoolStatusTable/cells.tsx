import { IntlShape } from "react-intl";

import {
  FragmentType,
  LocalizedString,
  Maybe,
  User,
  ChangeStatusDialog_UserFragment as ChangeStatusDialogUserFragmentType,
} from "@gc-digital-talent/graphql";
import { Link } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import ChangeDateDialog, {
  ChangeDateDialog_PoolCandidateFragment,
} from "~/components/CandidateDialog/ChangeDateDialog";
import ChangeStatusDialog, {
  ChangeStatusDialog_PoolCandidateFragment,
} from "~/components/CandidateDialog/ChangeStatusDialog";

export const statusCell = (
  candidate: FragmentType<typeof ChangeStatusDialog_PoolCandidateFragment>,
  user: Pick<
    ChangeStatusDialogUserFragmentType,
    "firstName" | "lastName" | "poolCandidates"
  >,
) => <ChangeStatusDialog selectedCandidateQuery={candidate} user={user} />;

export const expiryCell = (
  candidate: FragmentType<typeof ChangeDateDialog_PoolCandidateFragment>,
  user: Pick<User, "firstName" | "lastName">,
) => <ChangeDateDialog selectedCandidateQuery={candidate} user={user} />;

export function viewTeamLinkCell(
  url: Maybe<string> | undefined,
  displayName: Maybe<LocalizedString> | undefined,
  intl: IntlShape,
) {
  return url ? (
    <Link color="black" href={url}>
      {intl.formatMessage(
        {
          defaultMessage: "<hidden>View team: </hidden>{teamName}",
          id: "ActH9H",
          description: "Text for a link to the Team table",
        },
        {
          teamName: getLocalizedName(displayName, intl),
        },
      )}
    </Link>
  ) : null;
}
