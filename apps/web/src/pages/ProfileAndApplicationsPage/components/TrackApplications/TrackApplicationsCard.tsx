import * as React from "react";
import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocale } from "@gc-digital-talent/i18n";
import {
  Chip,
  Chips,
  Heading,
  HeadingProps,
  Pill,
} from "@gc-digital-talent/ui";
import { useIntl } from "react-intl";
import { PoolCandidate, Skill } from "~/api/generated";
import ApplicationActions, {
  DeleteActionProps,
} from "~/pages/Applications/MyApplicationsPage/components/ApplicationCard/ApplicationActions";
import {
  isDraft,
  isExpired,
  isPlaced,
} from "~/pages/Applications/MyApplicationsPage/components/ApplicationCard/utils";
import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import { getStatusPillInfo } from "~/components/QualifiedRecruitmentCard/utils";
import ApplicationLink from "~/pages/Pools/PoolAdvertisementPage/components/ApplicationLink";
import useMutations from "~/pages/Applications/MyApplicationsPage/components/ApplicationCard/useMutations";

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
  const locale = getLocale(intl);

  // Essential Skills
  const skills = application.pool.essentialSkills
    ? application.pool.essentialSkills
    : [];

  // Conditionals for card actions
  const applicationIsDraft = isDraft(application.status);
  const recruitmentIsExpired = isExpired(
    application.status,
    application.pool.closingDate,
  );
  const isApplicantPlaced = isPlaced(application.status);
  const statusPill = getStatusPillInfo(application.status, intl);

  return (
    <div
      data-h2-border-left="base(x.5 solid primary)"
      data-h2-padding="base(x1)"
      data-h2-shadow="base(larger)"
      data-h2-radius="base(rounded)"
      data-h2-margin="base(0, 0, x.5, 0)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(space-between)"
        data-h2-gap="base(0 x.5)"
      >
        <Heading
          level={headingLevel}
          size="h6"
          data-h2-margin="base(0)"
          data-h2-flex-grow="base(1)"
        >
          {getFullPoolTitleHtml(intl, application.pool)}
        </Heading>
        {applicationIsDraft ? (
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
          />
        ) : (
          <Pill bold mode="outline" color={statusPill.color}>
            {statusPill.text}
          </Pill>
        )}
      </div>

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
            show={notEmpty(application.pool)}
            advertisement={application.pool}
          />
          <ApplicationActions.ViewAction
            show={!applicationIsDraft}
            application={application}
          />
          <ApplicationActions.SupportAction
            show={!recruitmentIsExpired && !isApplicantPlaced}
          />
          <ApplicationActions.CopyRecruitmentIdAction
            show={!applicationIsDraft}
            application={application}
          />
          <ApplicationActions.DeleteAction
            show={applicationIsDraft}
            application={application}
            onDelete={onDelete}
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
