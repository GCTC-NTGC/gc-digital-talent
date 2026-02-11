import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/16/solid/UserCircleIcon";
import FlagIconOutline from "@heroicons/react/24/outline/FlagIcon";
import FlagIconSolid from "@heroicons/react/24/solid/FlagIcon";
import BookmarkIconOutline from "@heroicons/react/24/outline/BookmarkIcon";
import BookmarkIconSolid from "@heroicons/react/24/solid/BookmarkIcon";
import { useQuery } from "urql";

import {
  ApplicationStatus,
  FragmentType,
  getFragment,
  graphql,
  ScreeningStage,
} from "@gc-digital-talent/graphql";
import { Button, Card, Heading, Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { hasRole, ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getFullNameLabel } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import JobPlacementDialog from "~/components/PoolCandidateDialogs/JobPlacementDialog";
import { isRevertableStatus } from "~/utils/poolCandidate";
import useCandidateFlagToggle from "~/hooks/useCandidateFlagToggle";
import applicationMessages from "~/messages/applicationMessages";
import { JobPlacementOptions_Query } from "~/components/PoolCandidateDialogs/JobPlacementForm";
import FinalDecisionDialog from "~/components/PoolCandidateDialogs/FinalDecisionDialog";
import FinalDecisionAndPlaceDialog from "~/components/PoolCandidateDialogs/FinalDecisionAndPlaceDialog";
import UpdateScreeningStageDialog from "~/components/UpdateScreeningStageDialog/UpdateScreeningStageDialog";
import UpdateAssessmentStageDialog from "~/components/UpdateAssessmentStageDialog/UpdateAssessmentStageDialog";
import useCandidateBookmarkToggle from "~/hooks/useCandidateBookmarkToggle";

import CandidateNavigation from "../CandidateNavigation/CandidateNavigation";
import RemoveCandidateDialog from "../RemoveCandidateDialog/RemoveCandidateDialog";
import RevertFinalDecisionDialog from "./RevertFinalDecisionDialog";
import ReinstateCandidateDialog from "../ReinstateCandidateDialog/ReinstateCandidateDialog";
import ChangeExpiryDateDialog from "../ChangeExpiryDateDialog/ChangeExpiryDateDialog";
import NotesForm from "./NotesForm";
import DownloadButton from "./DownloadButton";
import StatusLabel from "./StatusLabel";

export const MoreActions_Fragment = graphql(/* GraphQL */ `
  fragment MoreActions on PoolCandidate {
    ...FinalDecisionDialog
    ...RemoveCandidateDialog
    ...RevertFinalDecisionDialog
    ...CandidateExpiryDateDialog
    ...JobPlacementDialog
    ...ReinstateCandidateDialog
    ...NotesForm
    ...UpdateScreeningStageDialog
    ...UpdateAssessmentStageDialog
    id
    user {
      id
      firstName
      lastName
    }
    status {
      value
      label {
        localized
      }
    }
    isFlagged
    screeningStage {
      value
    }
    removalReason {
      label {
        localized
      }
    }
    expiryDate
    pool {
      workStream {
        id
        name {
          en
          fr
        }
      }
      name {
        en
        fr
      }
      publishingGroup {
        value
        label {
          en
          fr
        }
      }
      classification {
        group
        level
      }
    }
  }
`);

const MoreActions_Query = graphql(/* GraphQL */ `
  query MoreActions {
    ...RemoveCandidateOptions
  }
`);

interface MoreActionsProps {
  poolCandidate: FragmentType<typeof MoreActions_Fragment>;
  jobPlacementOptions: FragmentType<typeof JobPlacementOptions_Query>;
  usersPoolCandidateBookmarks?: string[];
}

const MoreActions = ({
  poolCandidate: poolCandidateQuery,
  jobPlacementOptions,
  usersPoolCandidateBookmarks,
}: MoreActionsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { userAuthInfo } = useAuthorization();

  const poolCandidate = getFragment(MoreActions_Fragment, poolCandidateQuery);
  const candidateName = getFullNameLabel(
    poolCandidate.user.firstName,
    poolCandidate.user.lastName,
    intl,
  );
  const isBookmarkedDefaultValue = !!usersPoolCandidateBookmarks?.find(
    (id) => id === poolCandidate.id,
  );

  const [{ isFlagged }, toggleFlag] = useCandidateFlagToggle({
    id: poolCandidate.id,
    defaultValue: poolCandidate.isFlagged ?? false,
    candidateInfo: {
      firstName: poolCandidate.user.firstName,
      lastName: poolCandidate.user.lastName,
      workStream: poolCandidate.pool.workStream,
      name: poolCandidate.pool.name,
      publishingGroup: poolCandidate.pool.publishingGroup,
      classification: poolCandidate.pool.classification,
    },
  });
  const [{ isBookmarked }, toggleBookmark] = useCandidateBookmarkToggle({
    poolCandidateId: poolCandidate.id,
    defaultValue: isBookmarkedDefaultValue,
    candidateInfo: {
      candidateName: candidateName,
    },
  });

  const [{ data }] = useQuery({ query: MoreActions_Query });

  const status = poolCandidate.status?.value;

  const roleAssignments = unpackMaybes(userAuthInfo?.roleAssignments);
  const hasCommunityRecruiterRole = hasRole(
    [ROLE_NAME.CommunityRecruiter],
    roleAssignments,
  );

  return (
    <div className="mb-3 flex flex-col gap-3">
      <Card space="md" className="flex flex-col gap-3">
        <Heading level="h2" size="h6" className="mt-0">
          {candidateName}
        </Heading>

        <Card.Separator space="xs" />

        {status === ApplicationStatus.ToAssess && (
          <>
            {hasCommunityRecruiterRole ? (
              // community recruiters can record a decision and placement at the same time
              <FinalDecisionAndPlaceDialog
                poolCandidate={poolCandidate}
                optionsQuery={jobPlacementOptions}
              />
            ) : (
              // everyone else can only qualify
              <FinalDecisionDialog poolCandidate={poolCandidate} />
            )}

            <div>
              <p className="font-bold">
                {intl.formatMessage(applicationMessages.screeningStage)}
              </p>
              <div className="pl-1">
                <UpdateScreeningStageDialog query={poolCandidate} />
              </div>
            </div>

            <div className="mt-3">
              <p className="font-bold">
                {intl.formatMessage(applicationMessages.assessmentStage)}
              </p>
              <div className="pl-1">
                {poolCandidate?.screeningStage?.value ===
                ScreeningStage.UnderAssessment ? (
                  <UpdateAssessmentStageDialog query={poolCandidate} />
                ) : (
                  <p className="text-gray-500 dark:text-gray-200">
                    {intl.formatMessage({
                      defaultMessage: "(Available after screening stage)",
                      id: "NadegW",
                      description:
                        "Message for assessment stage when application is not under assessment",
                    })}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {status === ApplicationStatus.Removed && (
          <div>
            <StatusLabel>
              <ReinstateCandidateDialog reinstateQuery={poolCandidate} />
            </StatusLabel>
            {poolCandidate.removalReason?.label?.localized && (
              <p className="text-sm text-gray-600 dark:text-gray-200">
                {poolCandidate.removalReason.label.localized}
              </p>
            )}
          </div>
        )}

        {isRevertableStatus(status) && (
          <StatusLabel>
            <RevertFinalDecisionDialog
              revertFinalDecisionQuery={poolCandidate}
            />
          </StatusLabel>
        )}

        {status === ApplicationStatus.Qualified && (
          <>
            <StatusLabel
              label={intl.formatMessage(commonMessages.expiryDate)}
              ariaHidden
            >
              <ChangeExpiryDateDialog expiryDateQuery={poolCandidate} />
            </StatusLabel>
            <StatusLabel
              label={intl.formatMessage(commonMessages.jobPlacement)}
              ariaHidden
            >
              <JobPlacementDialog
                jobPlacementDialogQuery={poolCandidate}
                optionsQuery={jobPlacementOptions}
                context="view"
              />
            </StatusLabel>
          </>
        )}

        <Card.Separator space="xs" />

        {status !== ApplicationStatus.Removed &&
          status !== ApplicationStatus.Disqualified && (
            <RemoveCandidateDialog
              removalQuery={poolCandidate}
              optionsQuery={data}
            />
          )}

        <Link
          href={paths.userProfile(poolCandidate.user.id)}
          icon={UserCircleIcon}
          color="black"
          mode="inline"
        >
          {intl.formatMessage({
            defaultMessage: "Profile",
            id: "e12pvi",
            description:
              "Link label for view profile on view pool candidate page",
          })}
        </Link>

        <DownloadButton id={poolCandidate.id} userId={poolCandidate.user.id} />

        <Button
          mode="inline"
          color="black"
          className="text-left"
          icon={isBookmarked ? BookmarkIconSolid : BookmarkIconOutline}
          onClick={toggleBookmark}
        >
          {isBookmarked
            ? intl.formatMessage({
                defaultMessage: "Remove bookmark",
                id: "27mGKw",
                description: "Label for removing a bookmark",
              })
            : intl.formatMessage({
                defaultMessage: "Add bookmark",
                id: "L2xLV8",
                description: "Label for adding a bookmark",
              })}
        </Button>

        <Button
          mode="inline"
          color="black"
          className="text-left"
          icon={isFlagged ? FlagIconSolid : FlagIconOutline}
          onClick={toggleFlag}
        >
          {isFlagged
            ? intl.formatMessage({
                defaultMessage: "Remove flag",
                id: "+Nn0rE",
                description: "Label for removing a flag",
              })
            : intl.formatMessage({
                defaultMessage: "Add flag",
                id: "FtP8OZ",
                description: "Label for adding a flag",
              })}
        </Button>

        <Card.Separator space="xs" />

        <NotesForm poolCandidate={poolCandidate} />
      </Card>
      <CandidateNavigation candidateId={poolCandidate.id} />
    </div>
  );
};

export default MoreActions;
