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
import QualifiedRecruitmentDialog from "./TrackApplicationsDialog";

export type Application = Omit<PoolCandidate, "user">;

export interface QualifiedRecruitmentStatusProps {
  application: Application;
}

const QualifiedRecruitmentStatus = ({
  application,
}: QualifiedRecruitmentStatusProps) => {
  const intl = useIntl();
  const { id, suspendedAt, expiryDate, status } = application;

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
            id: "SQDh+g",
            description:
              "Placed recruitment status message on qualified recruitment card.",
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
            id: "sfa4iJ",
            description:
              "Expired recruitment status message on qualified recruitment card.",
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
            id: "TDikDt",
            description:
              "Not suspended recruitment status message on qualified recruitment card.",
          })}
          {/* Dialog that allows user to suspend the qualified recruitment (application). Sets suspendedAt date to the current time. */}
          <QualifiedRecruitmentDialog
            id={id}
            isSuspended={!!suspendedAt}
            title={intl.formatMessage({
              defaultMessage: "Change your appearance in search results",
              id: "FGF3sd",
              description:
                "Dialog title on change search results status from qualified recruitment section.",
            })}
            primaryBodyText={intl.formatMessage({
              defaultMessage:
                "You are currently appearing in talent search results for the “IT-01 Helpdesk support technician” pool.",
              id: "dPoE9z",
              description:
                "Dialog main body on change search results status from qualified recruitment section.",
            })}
            secondaryBodyText={intl.formatMessage({
              defaultMessage:
                "If you’ve recently been placed or simply no longer want to be considered for opportunities related to this role, you can remove yourself from the list of candidates available for hire. This will <emphasize>not</emphasize> remove you from the recruitment itself and you can always re-enable your availability if you change your mind.",
              id: "Y4kJYI",
              description:
                "Dialog main body on change search results status from qualified recruitment section.",
            })}
            openDialogLabel={intl.formatMessage({
              defaultMessage: "Remove me",
              id: "2g1mfB",
              description:
                "Open dialog text on change search results status from qualified recruitment section.",
            })}
            closeButtonLabel={intl.formatMessage({
              defaultMessage: "Yes, remove me from search results",
              id: "wgRXhR",
              description:
                "Dialog close button on change search results status from qualified recruitment section.",
            })}
            successMessage={intl.formatMessage({
              defaultMessage: "You have been removed from the search results.",
              id: "H/btqJ",
              description:
                "Alert displayed to the user when qualified recruitment card dialog submits successfully.",
            })}
            errorMessage={intl.formatMessage({
              defaultMessage: "Error: failed removing you from search results.",
              id: "5BkrSp",
              description:
                "Alert displayed to the user when qualified recruitment card dialog fails.",
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
          id: "bqWmTD",
          description:
            "Suspended recruitment status message on qualified recruitment card.",
        })}
        {/* Dialog that allows user to un-suspend the qualified recruitment (application). Sets suspendedAt date to null. */}
        <QualifiedRecruitmentDialog
          id={id}
          isSuspended={!!suspendedAt}
          title={intl.formatMessage({
            defaultMessage: "Change your appearance in search results",
            id: "FGF3sd",
            description:
              "Dialog title on change search results status from qualified recruitment section.",
          })}
          primaryBodyText={intl.formatMessage({
            defaultMessage:
              "You are currently not showing up in talent search results for the “IT-01 Helpdesk support technician” pool.",
            id: "veIkpN",
            description:
              "Dialog main body on change search results status from qualified recruitment section.",
          })}
          secondaryBodyText={intl.formatMessage({
            defaultMessage:
              "By re-adding yourself to this recruitment processes results, managers will once again be able to request your profile as a part of talent requests. You can always remove yourself again at a later time.",
            id: "EGwR9h",
            description:
              "Dialog main body on change search results status from qualified recruitment section.",
          })}
          openDialogLabel={intl.formatMessage({
            defaultMessage: "I want to appear in results again",
            id: "XHfbPp",
            description:
              "Open dialog text on change search results status from qualified recruitment section.",
          })}
          closeButtonLabel={intl.formatMessage({
            defaultMessage: "Yes, add me to search results",
            id: "V8GyRL",
            description:
              "Dialog close button on change search results status from qualified recruitment section.",
          })}
          successMessage={intl.formatMessage({
            defaultMessage: "You have been added to search results.",
            id: "12rbnA",
            description:
              "Alert displayed to the user when qualified recruitment card dialog submits successfully.",
          })}
          errorMessage={intl.formatMessage({
            defaultMessage: "Error: failed adding you to search results.",
            id: "7DfdMY",
            description:
              "Alert displayed to the user when qualified recruitment card dialog fails.",
          })}
        />
        .
      </p>
    </div>
  );
};

export default QualifiedRecruitmentStatus;
