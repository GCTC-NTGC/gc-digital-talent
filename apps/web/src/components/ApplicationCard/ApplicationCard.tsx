import { useIntl } from "react-intl";
import ShieldCheckIcon from "@heroicons/react/20/solid/ShieldCheckIcon";
import { useMutation } from "urql";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading, HeadingProps, Chip, Separator } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import {
  FragmentType,
  getFragment,
  graphql,
  PoolCandidateStatus,
} from "@gc-digital-talent/graphql";

import { isDraft, isExpired, isQualifiedStatus } from "~/utils/poolCandidate";
import {
  getShortPoolTitleHtml,
  getShortPoolTitleLabel,
} from "~/utils/poolUtils";
import { getStatusChipInfo } from "~/components/QualifiedRecruitmentCard/utils";
import ApplicationLink from "~/components/ApplicationLink/ApplicationLink";

import ApplicationActions from "./ApplicationActions";
import { getApplicationDeadlineMessage } from "./utils";

const ApplicationCardDelete_Mutation = graphql(/* GraphQL */ `
  mutation ApplicationCardDelete($id: ID!) {
    deleteApplication(id: $id) {
      id
    }
  }
`);

export const ApplicationCard_Fragment = graphql(/* GraphQL */ `
  fragment ApplicationCard on PoolCandidate {
    id
    status {
      value
      label {
        en
        fr
      }
    }
    suspendedAt
    submittedAt
    pool {
      id
      closingDate
      workStream {
        id
        name {
          en
          fr
        }
      }
      publishingGroup {
        value
        label {
          en
          fr
        }
      }
      name {
        en
        fr
      }
      classification {
        id
        group
        level
      }
    }
  }
`);

export interface ApplicationCardProps {
  poolCandidateQuery: FragmentType<typeof ApplicationCard_Fragment>;
  headingLevel?: HeadingProps["level"];
}

const ApplicationCard = ({
  poolCandidateQuery,
  headingLevel = "h2",
}: ApplicationCardProps) => {
  const intl = useIntl();
  const [, executeDeleteMutation] = useMutation(ApplicationCardDelete_Mutation);
  const application = getFragment(ApplicationCard_Fragment, poolCandidateQuery);

  // Conditionals for card actions
  const applicationIsDraft = isDraft(application.status?.value);
  const recruitmentIsExpired = isExpired(
    application.status?.value,
    application.pool.closingDate,
  );
  const isDraftExpired = applicationIsDraft && recruitmentIsExpired;
  const isApplicantQualified = isQualifiedStatus(application.status?.value);

  // We don't get DraftExpired status from the API, so we need to check if the draft is expired ourselves
  const statusChip = isDraftExpired
    ? getStatusChipInfo(
        PoolCandidateStatus.DraftExpired,
        application.suspendedAt,
        intl,
      )
    : getStatusChipInfo(
        application.status?.value,
        application.suspendedAt,
        intl,
      );

  const applicationDeadlineMessage = getApplicationDeadlineMessage(
    intl,
    application.pool.closingDate,
    application.submittedAt,
  );
  const applicationTitle = getShortPoolTitleHtml(intl, {
    workStream: application.pool.workStream,
    name: application.pool.name,
    publishingGroup: application.pool.publishingGroup,
    classification: application.pool.classification,
  });
  const applicationTitleString = getShortPoolTitleLabel(intl, {
    workStream: application.pool.workStream,
    name: application.pool.name,
    publishingGroup: application.pool.publishingGroup,
    classification: application.pool.classification,
  });

  const deleteApplication = async () => {
    await executeDeleteMutation({
      id: application.id,
    }).then((result) => {
      if (result.data?.deleteApplication) {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Application deleted successfully!",
            id: "xdGPxT",
            description:
              "Message displayed to user after application is deleted successfully.",
          }),
        );
      }
    });
  };

  return (
    <div
      data-h2-background-color="base(foreground)"
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
            <span data-h2-color="base(black.light)">
              {applicationDeadlineMessage}
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
            <Chip
              color={statusChip.color}
              {...(isApplicantQualified && { icon: ShieldCheckIcon })}
            >
              {statusChip.text}
            </Chip>
          )}
        </div>
      </div>
      <Separator
        data-h2-width="base(calc(100% + x2))"
        data-h2-margin="base(x1 -x1 x.5 -x1)"
      />
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-justify-content="base(flex-start)"
        data-h2-gap="base(x.5 0) p-tablet(0 x1)"
      >
        <ApplicationActions.ViewAction
          show={!applicationIsDraft}
          id={application.id}
          title={applicationTitleString}
        />
        <ApplicationActions.SeeAdvertisementAction
          show={notEmpty(application.pool)}
          poolId={application.pool.id}
          title={applicationTitleString}
        />

        <ApplicationActions.VisitCareerTimelineAction
          show={isApplicantQualified}
          title={applicationTitleString}
        />
        <ApplicationActions.DeleteAction
          show={applicationIsDraft}
          title={applicationTitleString}
          onDelete={deleteApplication}
        />
        <div data-h2-margin-left="base(0) p-tablet(auto)">
          <ApplicationActions.CopyApplicationIdAction
            show
            id={application.id}
            title={applicationTitleString}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
