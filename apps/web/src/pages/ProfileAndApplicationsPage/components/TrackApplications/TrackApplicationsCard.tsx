import * as React from "react";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading, HeadingProps, Pill, Separator } from "@gc-digital-talent/ui";
import { useIntl } from "react-intl";
import { PoolCandidate, PoolCandidateStatus } from "@gc-digital-talent/graphql";
import ApplicationActions, {
  DeleteActionProps,
} from "~/pages/Applications/MyApplicationsPage/components/ApplicationCard/ApplicationActions";
import {
  isDraft,
  isExpired,
} from "~/pages/Applications/MyApplicationsPage/components/ApplicationCard/utils";
import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import { getStatusPillInfo } from "~/components/QualifiedRecruitmentCard/utils";
import ApplicationLink from "~/pages/Pools/PoolAdvertisementPage/components/ApplicationLink";
import useMutations from "~/pages/Applications/MyApplicationsPage/components/ApplicationCard/useMutations";
import { getRecruitmentType, isQualifiedStatus } from "~/utils/poolCandidate";
import ShieldCheckIcon from "@heroicons/react/20/solid/ShieldCheckIcon";
import { useAuthorization } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { getApplicationDateInfo } from "./utils";

export type Application = Omit<PoolCandidate, "user">;

export interface TrackApplicationsCardProps {
  application: Application;
  headingLevel?: HeadingProps["level"];
  onDelete: DeleteActionProps["onDelete"];
}

const TrackApplicationsCard = ({
  application,
  headingLevel = "h2",
  onDelete,
}: TrackApplicationsCardProps) => {
  const intl = useIntl();

  // Conditionals for card actions
  const applicationIsDraft = isDraft(application.status);
  const recruitmentIsExpired = isExpired(
    application.status,
    application.pool.closingDate,
  );
  const isDraftExpired = applicationIsDraft && recruitmentIsExpired;
  const isApplicantQualified = isQualifiedStatus(application.status);

  // We don't get DraftExpired status from the API, so we need to check if the draft is expired ourselves
  const statusPill = isDraftExpired
    ? getStatusPillInfo(PoolCandidateStatus.DraftExpired, intl)
    : getStatusPillInfo(application.status, intl);

  const applicationDateInfo = getApplicationDateInfo(application, intl);
  const { user } = useAuthorization();
  const applicationTitle = getFullPoolTitleHtml(intl, application.pool);
  return (
    <div
      data-h2-border-left="base(x.5 solid primary)"
      data-h2-padding="base(x1 x1 x.5 x1)"
      data-h2-shadow="base(larger)"
      data-h2-margin="base(0, 0, x.5, 0)"
      data-h2-radius="base(0px rounded rounded 0px)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-gap="base(x1)"
      >
        <div data-h2-flex-grow="l-tablet(1)">
          <Heading
            level={headingLevel}
            size="h6"
            data-h2-margin="base(0, 0, x.5, 0)"
            data-h2-flex-grow="base(1)"
          >
            {applicationTitle}
          </Heading>
          <div data-h2-display="base:children[>span](block) l-tablet:children[>span](inline-block)">
            <span data-h2-color="base(primary.darker)">
              {getRecruitmentType(application.pool.publishingGroup, intl)}
            </span>
            <span
              data-h2-display="base(none) l-tablet(inline-block)"
              data-h2-color="base(black.light)"
              data-h2-margin="base(0, x.5)"
              aria-hidden="true"
            >
              •
            </span>
            <span data-h2-color="base(black.light)">
              {applicationDateInfo.message}
              {intl.formatMessage(commonMessages.dividingColon)}
              <span data-h2-color={applicationDateInfo.color}>
                {applicationDateInfo.date}
              </span>
            </span>
          </div>
        </div>
        <div>
          {applicationIsDraft && !recruitmentIsExpired ? (
            <ApplicationLink
              poolId={application.pool.id}
              applicationId={application.id}
              hasApplied={false}
              canApply
              linkProps={{ block: true, color: "primary" }}
              linkText={intl.formatMessage({
                defaultMessage: "Continue draft",
                id: "jiJ8qo",
                description: "Link text to apply for a pool advertisement",
              })}
              aria-label={intl.formatMessage(
                {
                  defaultMessage:
                    "Continue your application draft to the {applicationTitle} job",
                  id: "KqAp09",
                  description: "Link text to apply for a pool advertisement",
                },
                {
                  applicationTitle,
                },
              )}
            />
          ) : (
            <Pill bold mode="outline" color={statusPill.color}>
              {isApplicantQualified ? (
                <span
                  data-h2-display="base(flex)"
                  data-h2-align-items="base(center)"
                  data-h2-gap="base(0 x.25)"
                >
                  <ShieldCheckIcon
                    data-h2-width="base(1rem)"
                    data-h2-height="base(auto)"
                  />
                  <span>{statusPill.text}</span>
                </span>
              ) : (
                statusPill.text
              )}
            </Pill>
          )}
        </div>
      </div>
      <Separator
        orientation="horizontal"
        decorative
        data-h2-background-color="base(gray.lighter)"
        data-h2-width="base(calc(100% + x2))"
        data-h2-margin="base(x1 -x1 x.5 -x1)"
      />
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-gap="base(x.5) p-tablet(x1)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center) p-tablet(flex-start)"
          data-h2-gap="base(x1)"
        >
          <ApplicationActions.ViewAction
            show={!applicationIsDraft}
            application={application}
          />
          <ApplicationActions.SeeAdvertisementAction
            show={notEmpty(application.pool)}
            advertisement={application.pool}
          />

          <ApplicationActions.VisitResumeAction
            show={isApplicantQualified}
            userID={user?.id ?? ""}
            application={application}
          />
          <ApplicationActions.ManageAvailabilityAction
            show={isApplicantQualified}
            userID={user?.id ?? ""}
            application={application}
          />
          <ApplicationActions.SupportAction show application={application} />
          <ApplicationActions.DeleteAction
            show={applicationIsDraft}
            application={application}
            onDelete={onDelete}
          />
        </div>
        <div
          data-h2-flex-grow="p-tablet(1)"
          data-h2-text-align="base(center) p-tablet(right)"
        >
          <ApplicationActions.CopyApplicationIdAction
            show
            application={application}
          />
        </div>
      </div>
    </div>
  );
};

interface TrackApplicationsCardApiProps {
  application: Application;
}

const TrackApplicationsCardApi = ({
  application,
}: TrackApplicationsCardApiProps) => {
  const mutations = useMutations();

  return (
    <TrackApplicationsCard
      application={application}
      onDelete={() => mutations.delete(application.id)}
    />
  );
};

export const TrackApplicationsCardComponent = TrackApplicationsCard;
export default TrackApplicationsCardApi;
