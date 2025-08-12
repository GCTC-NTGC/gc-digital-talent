import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/16/solid/UserCircleIcon";
import BookmarkIconOutline from "@heroicons/react/24/outline/BookmarkIcon";
import BookmarkIconSolid from "@heroicons/react/24/solid/BookmarkIcon";
import { useQuery } from "urql";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Button, Card, Heading, Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import JobPlacementDialog, {
  JobPlacementOptionsFragmentType,
} from "~/components/PoolCandidatesTable/JobPlacementDialog";
import {
  isQualifiedStatus,
  isRemovedStatus,
  isRevertableStatus,
  isRODStatus,
} from "~/utils/poolCandidate";
import useCandidateBookmarkToggle from "~/hooks/useCandidateBookmarkToggle";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import CandidateNavigation from "../CandidateNavigation/CandidateNavigation";
import FinalDecisionDialog from "./FinalDecisionDialog";
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
    isBookmarked
    assessmentStep
    removalReason {
      label {
        localized
      }
    }
    pool {
      assessmentSteps {
        sortOrder
        type {
          label {
            localized
          }
        }
        title {
          localized
        }
      }
    }
    expiryDate
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
  const [{ isBookmarked }, toggleBookmark] = useCandidateBookmarkToggle({
    id: poolCandidate.id,
    defaultValue: poolCandidate.isBookmarked ?? false,
  });

  const candidateName = getFullNameLabel(
    poolCandidate.user.firstName,
    poolCandidate.user.lastName,
    intl,
  );

  const [{ data }] = useQuery({ query: MoreActions_Query });

  const currentStep = poolCandidate.assessmentStep
    ? poolCandidate.pool.assessmentSteps?.find(
        (step) => step?.sortOrder === poolCandidate.assessmentStep,
      )
    : null;

  const currentStepName =
    // NOTE: Localized can be empty string so || is more suitable
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    currentStep?.title?.localized || currentStep?.type?.label?.localized;

  const status = poolCandidate.status?.value;

  return (
    <div className="mb-3 flex flex-col gap-3">
      <Card space="sm" className="flex flex-col gap-3">
        <div>
          <Heading level="h2" size="h6" className="mt-0">
            {candidateName}
          </Heading>
          {currentStepName && (
            <p className="text-gray-600 dark:text-gray-200">
              {intl.formatMessage(poolCandidateMessages.assessmentStepNumber, {
                stepNumber: poolCandidate.assessmentStep,
              }) +
                intl.formatMessage(commonMessages.dividingColon) +
                currentStepName}
            </p>
          )}
        </div>

        <Card.Separator space="xs" />

        {isRODStatus(status) && (
          <FinalDecisionDialog poolCandidate={poolCandidate} />
        )}

        {isRemovedStatus(status) && (
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

        {isQualifiedStatus(status) && (
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

        <RemoveCandidateDialog
          removalQuery={poolCandidate}
          optionsQuery={data}
        />

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

        <Card.Separator space="xs" />

        <NotesForm poolCandidate={poolCandidate} />
      </Card>
      <CandidateNavigation candidateId={poolCandidate.id} />
    </div>
  );
};

export default MoreActions;
