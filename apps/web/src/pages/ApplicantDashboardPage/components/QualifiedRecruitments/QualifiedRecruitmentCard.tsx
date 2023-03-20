import * as React from "react";
import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocale } from "@gc-digital-talent/i18n";
import { Chip, Chips, Heading, HeadingProps } from "@gc-digital-talent/ui";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { useIntl } from "react-intl";
import { PoolCandidate, Skill } from "~/api/generated";
import ApplicationActions from "~/pages/Applications/MyApplicationsPage/components/ApplicationCard/ApplicationActions";
import {
  isDraft,
  isExpired,
  isPlaced,
} from "~/pages/Applications/MyApplicationsPage/components/ApplicationCard/utils";
import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import QualifiedRecruitmentDialog from "./QualifiedRecruitmentDialog";

export type Application = Omit<PoolCandidate, "pool" | "user">;

export interface QualifiedRecruitmentCardProps {
  application: Application;
  headingLevel?: HeadingProps["level"];
}

const QualifiedRecruitmentCard = ({
  application,
  headingLevel = "h2",
}: QualifiedRecruitmentCardProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  // Recruitment status link
  const recruitmentStatus = () => {
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
          <span
            data-h2-padding="base(0, x.5, 0, 0)"
            data-h2-color="base(green)"
          >
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
              closeButtonLabel={intl.formatMessage({
                defaultMessage: "Yes, remove me from search results",
                id: "wgRXhR",
                description:
                  "Dialog close button on change search results status from qualified recruitment section.",
              })}
              openDialogLabel={intl.formatMessage({
                defaultMessage: "Remove me",
                id: "2g1mfB",
                description:
                  "Open dialog text on change search results status from qualified recruitment section.",
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
                  "If you’ve recently been placed or simply no longer want to be considered for opportunities related to this role, you can remove yourself from the list of candidates available for hire. This will NOT remove you from the recruitment itself and you can always re-enable your availability if you change your mind.",
                id: "EWB2LC",
                description:
                  "Dialog main body on change search results status from qualified recruitment section.",
              })}
              title={intl.formatMessage({
                defaultMessage: "Change your appearance in search results",
                id: "FGF3sd",
                description:
                  "Dialog title on change search results status from qualified recruitment section.",
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
            closeButtonLabel={intl.formatMessage({
              defaultMessage: "Yes, add me to search results",
              id: "V8GyRL",
              description:
                "Dialog close button on change search results status from qualified recruitment section.",
            })}
            openDialogLabel={intl.formatMessage({
              defaultMessage: "I want to appear in results again",
              id: "XHfbPp",
              description:
                "Open dialog text on change search results status from qualified recruitment section.",
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
            title={intl.formatMessage({
              defaultMessage: "Change your appearance in search results",
              id: "FGF3sd",
              description:
                "Dialog title on change search results status from qualified recruitment section.",
            })}
          />
          .
        </p>
      </div>
    );
  };

  // Essential Skills
  const skills = application.poolAdvertisement?.essentialSkills
    ? application.poolAdvertisement?.essentialSkills
    : [];

  // Conditionals for qualified recruitment card actions
  const applicationIsDraft = isDraft(application.status);
  const recruitmentIsExpired = isExpired(
    application.status,
    application.poolAdvertisement?.closingDate,
  );
  const isApplicantPlaced = isPlaced(application.status);
  return (
    <div
      data-h2-background="base(foreground)"
      data-h2-shadow="base(medium)"
      data-h2-radius="base(0px rounded rounded 0px)"
      data-h2-padding="base(x1)"
      data-h2-margin="base(0, 0, x1, 0)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(0, x.5)"
        data-h2-justify-content="base(space-between)"
      >
        <Heading
          level={headingLevel}
          size="h6"
          data-h2-margin="base(0, 0, x1, 0)"
          data-h2-flex-grow="base(1)"
        >
          {application.poolAdvertisement
            ? getFullPoolAdvertisementTitleHtml(
                intl,
                application.poolAdvertisement,
              )
            : ""}
        </Heading>
      </div>
      <div data-h2-margin="base(0, 0, x1, 0)">{recruitmentStatus()}</div>
      <div>
        {skills.length > 0 ? (
          <div
            data-h2-display="base(flex)"
            data-h2-flex-wrap="base(wrap)"
            data-h2-gap="base(x.25, x.125)"
          >
            <p data-h2-margin="base(x.5, x.5, x.25, 0)">
              {intl.formatMessage({
                defaultMessage: "Assessed skills:",
                id: "7NnNrW",
              })}
            </p>
            <Chips>
              {skills.map((skill: Skill) => (
                <Chip
                  key={skill.id}
                  color="secondary"
                  mode="outline"
                  label={skill.name[locale] ?? ""}
                />
              ))}
            </Chips>
          </div>
        ) : null}
      </div>
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-gap="base(x1)"
        data-h2-justify-content="base(space-between)"
        data-h2-margin="base(x1, 0, 0, 0)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-gap="base(x1)"
        >
          <ApplicationActions.SeeAdvertisementAction
            show={notEmpty(application.poolAdvertisement)}
            advertisement={application.poolAdvertisement}
          />
          <ApplicationActions.ViewAction
            show={!applicationIsDraft}
            application={application}
          />
          <ApplicationActions.SupportAction
            show={!recruitmentIsExpired && !isApplicantPlaced}
          />
        </div>
      </div>
    </div>
  );
};

export default QualifiedRecruitmentCard;
