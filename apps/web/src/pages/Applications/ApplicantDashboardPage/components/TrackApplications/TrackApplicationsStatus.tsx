import * as React from "react";
import ExclamationCircleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import { useIntl } from "react-intl";
import { PoolCandidate } from "~/api/generated";
import {
  isExpired,
  isPlaced,
} from "~/pages/Applications/MyApplicationsPage/components/ApplicationCard/utils";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import TrackApplicationsDialog from "./TrackApplicationsDialog";

export type Application = Omit<PoolCandidate, "user">;

export interface TrackApplicationsStatusProps {
  application: Application;
}

const TrackApplicationsStatus = ({
  application,
}: TrackApplicationsStatusProps) => {
  const intl = useIntl();
  const { id, suspendedAt, expiryDate, status, pool } = application;

  // Recruitment card has placed status.
  if (isPlaced(status)) {
    return (
      <div data-h2-display="base(flex)" data-h2-align-items="base(center)">
        <span data-h2-padding="base(0, x.5, 0, 0)" data-h2-color="base(gray)">
          <LockClosedIcon
            data-h2-height="base(1em)"
            data-h2-width="base(1em)"
          />
        </span>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Congrats! You were hired as a result of this process. As such, you will no longer appear in talent requests for this recruitment.",
            id: "abab6G",
            description:
              "Placed recruitment status message on application card.",
          })}
        </p>
      </div>
    );
  }

  // Recruitment card is expired. Either the pool candidate status is expired or the expiry date has passed.
  if (isExpired(status, expiryDate)) {
    return (
      <div data-h2-display="base(flex)" data-h2-align-items="base(center)">
        <span data-h2-padding="base(0, x.5, 0, 0)" data-h2-color="base(gray)">
          <LockClosedIcon
            data-h2-height="base(1em)"
            data-h2-width="base(1em)"
          />
        </span>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "This recruitment has expired and it is no longer available for hiring opportunities.",
            id: "sDzeqf",
            description:
              "Expired recruitment status message on application card.",
          })}
        </p>
      </div>
    );
  }

  // Recruitment card is active and not suspended status.
  if (!suspendedAt) {
    return (
      <div data-h2-display="base(flex)" data-h2-align-items="base(center)">
        <span data-h2-padding="base(0, x.5, 0, 0)" data-h2-color="base(green)">
          <CheckCircleIcon
            data-h2-height="base(1em)"
            data-h2-width="base(1em)"
          />
        </span>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "You are actively appearing in talent results for this recruitment.",
            id: "5xZ350",
            description:
              "Not suspended recruitment status message on application card.",
          })}
          {/* Dialog that allows user to suspend the application. Sets suspendedAt date to the current time. */}
          <TrackApplicationsDialog
            id={id}
            isSuspended={!!suspendedAt}
            title={intl.formatMessage({
              defaultMessage: "Change your appearance in search results",
              id: "3qdrpr",
              description:
                "Dialog title on change search results status from applications section.",
            })}
            primaryBodyText={intl.formatMessage(
              {
                defaultMessage:
                  "You are currently appearing in talent search results for the “{poolName}” pool.",
                id: "bnEGX7",
                description:
                  "Dialog main body on change search results status from applications section.",
              },
              {
                poolName: getFullPoolTitleLabel(intl, pool),
              },
            )}
            secondaryBodyText={intl.formatMessage({
              defaultMessage:
                "If you’ve recently been placed or simply no longer want to be considered for opportunities related to this role, you can remove yourself from the list of candidates available for hire. This will <emphasize>not</emphasize> remove you from the recruitment itself and you can always re-enable your availability if you change your mind.",
              id: "Q1zXns",
              description:
                "Dialog main body on change search results status from applications section.",
            })}
            openDialogLabel={intl.formatMessage({
              defaultMessage: "Remove me",
              id: "XXEgap",
              description:
                "Open dialog text on change search results status from applications section.",
            })}
            closeButtonLabel={intl.formatMessage({
              defaultMessage: "Yes, remove me from search results",
              id: "JHpvYR",
              description:
                "Dialog close button on change search results status from applications section.",
            })}
            successMessage={intl.formatMessage({
              defaultMessage: "You have been removed from the search results.",
              id: "PoFTwr",
              description:
                "Alert displayed to the user when application card dialog submits successfully.",
            })}
            errorMessage={intl.formatMessage({
              defaultMessage: "Error: failed removing you from search results.",
              id: "7tdU/G",
              description:
                "Alert displayed to the user when application card dialog fails.",
            })}
          />
          .
        </p>
      </div>
    );
  }

  // Recruitment card is active and suspended.
  return (
    <div data-h2-display="base(flex)" data-h2-align-items="base(center)">
      <span data-h2-padding="base(0, x.5, 0, 0)" data-h2-color="base(orange)">
        <ExclamationCircleIcon
          data-h2-height="base(1em)"
          data-h2-width="base(1em)"
        />
      </span>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "You have chosen not to appear in talent results for this recruitment.",
          id: "KrAvuk",
          description:
            "Suspended recruitment status message on application card.",
        })}
        {/* Dialog that allows user to un-suspend the application. Sets suspendedAt date to null. */}
        <TrackApplicationsDialog
          id={id}
          isSuspended={!!suspendedAt}
          title={intl.formatMessage({
            defaultMessage: "Change your appearance in search results",
            id: "3qdrpr",
            description:
              "Dialog title on change search results status from applications section.",
          })}
          primaryBodyText={intl.formatMessage(
            {
              defaultMessage:
                "You are currently not showing up in talent search results for the “{poolName}” pool.",
              id: "GOF2wj",
              description:
                "Dialog main body on change search results status from applications section.",
            },
            {
              poolName: getFullPoolTitleLabel(intl, pool),
            },
          )}
          secondaryBodyText={intl.formatMessage({
            defaultMessage:
              "By re-adding yourself to this recruitment processes results, managers will once again be able to request your profile as a part of talent requests. You can always remove yourself again at a later time.",
            id: "GbYTXJ",
            description:
              "Dialog main body on change search results status from applications section.",
          })}
          openDialogLabel={intl.formatMessage({
            defaultMessage: "I want to appear in results again",
            id: "Ev3BoS",
            description:
              "Open dialog text on change search results status from applications section.",
          })}
          closeButtonLabel={intl.formatMessage({
            defaultMessage: "Yes, add me to search results",
            id: "mId+J5",
            description:
              "Dialog close button on change search results status from applications section.",
          })}
          successMessage={intl.formatMessage({
            defaultMessage: "You have been added to search results.",
            id: "JNVceV",
            description:
              "Alert displayed to the user when application card dialog submits successfully.",
          })}
          errorMessage={intl.formatMessage({
            defaultMessage: "Error: failed adding you to search results.",
            id: "ucOq3J",
            description:
              "Alert displayed to the user when application card dialog fails.",
          })}
        />
        .
      </p>
    </div>
  );
};

export default TrackApplicationsStatus;
