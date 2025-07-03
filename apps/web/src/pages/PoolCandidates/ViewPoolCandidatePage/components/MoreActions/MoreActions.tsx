import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/20/solid/UserCircleIcon";
import { useQuery } from "urql";

import {
  FragmentType,
  Maybe,
  User,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { Card, Link, Loading, Separator } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";
import {
  RECORD_DECISION_STATUSES,
  REVERT_DECISION_STATUSES,
} from "~/constants/poolCandidate";
import useRoutes from "~/hooks/useRoutes";
import JobPlacementDialog, {
  JobPlacementOptionsFragmentType,
  PLACEMENT_TYPE_STATUSES,
} from "~/components/PoolCandidatesTable/JobPlacementDialog";
import { isQualifiedStatus, isRemovedStatus } from "~/utils/poolCandidate";

import CandidateNavigation from "../CandidateNavigation/CandidateNavigation";
import FinalDecisionDialog from "./FinalDecisionDialog";
import RemoveCandidateDialog from "../RemoveCandidateDialog/RemoveCandidateDialog";
import RevertFinalDecisionDialog from "./RevertFinalDecisionDialog";
import ReinstateCandidateDialog from "../ReinstateCandidateDialog/ReinstateCandidateDialog";
import ChangeExpiryDateDialog from "../ChangeExpiryDateDialog/ChangeExpiryDateDialog";
import NotesForm from "./NotesForm";
import DownloadButton from "./DownloadButton";

export const MoreActions_Fragment = graphql(/* GraphQL */ `
  fragment MoreActions on PoolCandidate {
    ...FinalDecisionDialog
    ...RemoveCandidateDialog
    ...RevertFinalDecisionDialog
    ...CandidateExpiryDateDialog
    ...JobPlacementDialog
    ...ReinstateCandidateDialog
    ...NotesForm
    id
    user {
      id
      firstName
      lastName
    }
    status {
      value
      label {
        en
        fr
      }
    }
    expiryDate
    profileSnapshot
  }
`);

const MoreActions_Query = graphql(/* GraphQL */ `
  query MoreActions {
    ...RemoveCandidateOptions
  }
`);

interface MoreActionsProps {
  poolCandidate: FragmentType<typeof MoreActions_Fragment>;
  jobPlacementOptions: JobPlacementOptionsFragmentType;
}

const MoreActions = ({
  poolCandidate: poolCandidateQuery,
  jobPlacementOptions,
}: MoreActionsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const poolCandidate = getFragment(MoreActions_Fragment, poolCandidateQuery);
  const candidateName = getFullNameLabel(
    poolCandidate.user.firstName,
    poolCandidate.user.lastName,
    intl,
  );
  const parsedSnapshot = JSON.parse(
    String(poolCandidate.profileSnapshot),
  ) as Maybe<User>;
  const [{ data, fetching }] = useQuery({ query: MoreActions_Query });

  return (
    <div className="mb-3 flex flex-col gap-3">
      <Card space="xs" className="flex flex-col justify-center gap-3">
        <CandidateNavigation
          candidateId={poolCandidate.id}
          candidateName={candidateName}
        />
        <Separator space="xs" orientation="horizontal" />
        {fetching ? (
          <Loading inline />
        ) : (
          <>
            {poolCandidate.status &&
            isRemovedStatus(poolCandidate.status.value) ? (
              <span>
                {intl.formatMessage(commonMessages.status)}
                {intl.formatMessage(commonMessages.dividingColon)}
                <ReinstateCandidateDialog reinstateQuery={poolCandidate} />
              </span>
            ) : (
              <>
                {poolCandidate.status &&
                  RECORD_DECISION_STATUSES.includes(
                    poolCandidate.status.value,
                  ) && <FinalDecisionDialog poolCandidate={poolCandidate} />}
                {poolCandidate.status &&
                  [
                    ...REVERT_DECISION_STATUSES,
                    ...PLACEMENT_TYPE_STATUSES,
                  ].includes(poolCandidate.status.value) && (
                    <span>
                      {intl.formatMessage(commonMessages.status)}
                      {intl.formatMessage(commonMessages.dividingColon)}
                      <RevertFinalDecisionDialog
                        revertFinalDecisionQuery={poolCandidate}
                      />
                    </span>
                  )}
                {poolCandidate.status &&
                  isQualifiedStatus(poolCandidate.status.value) && (
                    <span>
                      <span aria-hidden="true">
                        {intl.formatMessage(commonMessages.expiryDate)}
                        {intl.formatMessage(commonMessages.dividingColon)}
                      </span>
                      <ChangeExpiryDateDialog expiryDateQuery={poolCandidate} />
                    </span>
                  )}
                {poolCandidate.status &&
                  isQualifiedStatus(poolCandidate.status.value) && (
                    <span>
                      <span aria-hidden="true">
                        {intl.formatMessage(commonMessages.jobPlacement)}
                        {intl.formatMessage(commonMessages.dividingColon)}
                      </span>
                      <JobPlacementDialog
                        jobPlacementDialogQuery={poolCandidate}
                        optionsQuery={jobPlacementOptions}
                        context="view"
                      />
                    </span>
                  )}
                <span>
                  <RemoveCandidateDialog
                    removalQuery={poolCandidate}
                    optionsQuery={data}
                  />
                </span>
              </>
            )}
          </>
        )}
      </Card>
      <div className="flex flex-wrap gap-3 text-center">
        <Card className="flex-1" space="xs">
          <Link
            href={paths.userProfile(poolCandidate.user.id)}
            icon={UserCircleIcon}
            color="secondary"
            mode="inline"
          >
            {intl.formatMessage({
              defaultMessage: "Profile",
              id: "e12pvi",
              description:
                "Link label for view profile on view pool candidate page",
            })}
          </Link>
        </Card>
        {parsedSnapshot && (
          <Card className="flex-1" space="xs">
            <DownloadButton
              id={poolCandidate.id}
              userId={poolCandidate.user.id}
            />
          </Card>
        )}
      </div>
      <NotesForm poolCandidate={poolCandidate} />
    </div>
  );
};

export default MoreActions;
