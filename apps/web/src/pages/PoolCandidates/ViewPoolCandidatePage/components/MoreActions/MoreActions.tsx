import * as React from "react";
import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";

import {
  Department,
  FragmentType,
  Maybe,
  User,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { CardBasic, Link, Separator } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";
import {
  RECORD_DECISION_STATUSES,
  REVERT_DECISION_STATUSES,
} from "~/constants/poolCandidate";
import useRoutes from "~/hooks/useRoutes";
import JobPlacementDialog, {
  PLACEMENT_TYPE_STATUSES,
} from "~/components/PoolCandidatesTable/JobPlacementDialog";
import { isQualifiedStatus, isRemovedStatus } from "~/utils/poolCandidate";

import CandidateNavigation from "../CandidateNavigation/CandidateNavigation";
import FinalDecisionDialog from "./FinalDecisionDialog";
import RemoveCandidateDialog from "../RemoveCandidateDialog/RemoveCandidateDialog";
import ApplicationPrintButton from "../ApplicationPrintButton/ApplicationPrintButton";
import RevertFinalDecisionDialog from "./RevertFinalDecisionDialog";
import ReinstateCandidateDialog from "../ReinstateCandidateDialog/ReinstateCandidateDialog";
import ChangeExpiryDateDialog from "../ChangeExpiryDateDialog/ChangeExpiryDateDialog";
import NotesDialog from "./NotesDialog";

export const MoreActions_Fragment = graphql(/* GraphQL */ `
  fragment MoreActions on PoolCandidate {
    ...FinalDecisionDialog
    ...RemoveCandidateDialog
    ...RevertFinalDecisionDialog
    ...CandidateExpiryDateDialog
    ...JobPlacementDialog
    ...ReinstateCandidateDialog
    ...NotesDialog
    id
    pool {
      id
      ...ApplicationPrintDocument_PoolFragment
    }
    user {
      id
      firstName
      lastName
    }
    status
    expiryDate
    profileSnapshot
  }
`);

interface MoreActionsProps {
  poolCandidate: FragmentType<typeof MoreActions_Fragment>;
  departments: Department[];
}

const MoreActions = ({
  poolCandidate: poolCandidateQuery,
  departments,
}: MoreActionsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const poolCandidate = getFragment(MoreActions_Fragment, poolCandidateQuery);
  const candidateName = getFullNameLabel(
    poolCandidate.user.firstName,
    poolCandidate.user.lastName,
    intl,
  );
  const parsedSnapshot: Maybe<User> = JSON.parse(poolCandidate.profileSnapshot);

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.5)"
      data-h2-margin-bottom="base(x.5)"
    >
      <CardBasic
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-justify-content="base(center)"
        data-h2-gap="base(x.5)"
        data-h2-padding="base(x.5)"
      >
        <CandidateNavigation
          candidateId={poolCandidate.id}
          poolId={poolCandidate.pool.id}
          candidateName={candidateName}
        />
        <Separator orientation="horizontal" data-h2-margin="base(x.5, 0)" />
        {poolCandidate.status && isRemovedStatus(poolCandidate.status) ? (
          <span>
            {intl.formatMessage(commonMessages.status)}
            {intl.formatMessage(commonMessages.dividingColon)}
            <ReinstateCandidateDialog reinstateQuery={poolCandidate} />
          </span>
        ) : (
          <>
            {poolCandidate.status &&
              RECORD_DECISION_STATUSES.includes(poolCandidate.status) && (
                <FinalDecisionDialog poolCandidate={poolCandidate} />
              )}
            {poolCandidate.status &&
              [
                ...REVERT_DECISION_STATUSES,
                ...PLACEMENT_TYPE_STATUSES,
              ].includes(poolCandidate.status) && (
                <span>
                  {intl.formatMessage(commonMessages.status)}
                  {intl.formatMessage(commonMessages.dividingColon)}
                  <RevertFinalDecisionDialog
                    revertFinalDecisionQuery={poolCandidate}
                  />
                </span>
              )}
            {poolCandidate.status &&
              isQualifiedStatus(poolCandidate.status) && (
                <span>
                  {intl.formatMessage(commonMessages.expiryDate)}
                  {intl.formatMessage(commonMessages.dividingColon)}
                  <ChangeExpiryDateDialog expiryDateQuery={poolCandidate} />
                </span>
              )}
            {poolCandidate.status &&
              isQualifiedStatus(poolCandidate.status) && (
                <span>
                  {intl.formatMessage(commonMessages.jobPlacement)}
                  {intl.formatMessage(commonMessages.dividingColon)}
                  <JobPlacementDialog
                    jobPlacementDialogQuery={poolCandidate}
                    departments={departments}
                    context="view"
                  />
                </span>
              )}
            <span data-h2-margin-top="base(x.5)">
              <RemoveCandidateDialog removalQuery={poolCandidate} />
            </span>
          </>
        )}
      </CardBasic>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-text-align="base(center)"
        data-h2-gap="base(x.5)"
      >
        <CardBasic data-h2-flex="base(1)">
          <Link
            href={paths.userProfile(poolCandidate.user.id)}
            icon={UserCircleIcon}
            color="primary"
            mode="inline"
          >
            {intl.formatMessage({
              defaultMessage: "Profile",
              id: "e12pvi",
              description:
                "Link label for view profile on view pool candidate page",
            })}
          </Link>
        </CardBasic>
        {parsedSnapshot && (
          <CardBasic data-h2-flex="base(1)">
            <ApplicationPrintButton
              mode="inline"
              color="secondary"
              pool={poolCandidate.pool}
              user={parsedSnapshot}
              buttonLabel={intl.formatMessage(commonMessages.print)}
            />
          </CardBasic>
        )}
      </div>
      <NotesDialog poolCandidate={poolCandidate} />
    </div>
  );
};

export default MoreActions;
