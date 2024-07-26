import { IntlShape } from "react-intl";

import { LocalizedString, Maybe, User } from "@gc-digital-talent/graphql";
import { Link } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import ChangeDateDialog, {
  ChangeDateSelectedCandidateType,
} from "~/components/CandidateDialog/ChangeDateDialog";
import ChangeStatusDialog, {
  ChangeStatusSelectedCandidateType,
} from "~/components/CandidateDialog/ChangeStatusDialog";

export const statusCell = (
  candidate: ChangeStatusSelectedCandidateType,
  user: User,
) => <ChangeStatusDialog selectedCandidate={candidate} user={user} />;

export const expiryCell = (
  candidate: ChangeDateSelectedCandidateType,
  user: User,
) => <ChangeDateDialog selectedCandidate={candidate} user={user} />;

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
