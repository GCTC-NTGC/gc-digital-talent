import { useIntl } from "react-intl";

import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  PlacementType,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Notice, Ul } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import ApplicationExpiryDateDialog from "../Dialog/ApplicationExpiryDateDialog";
import ApplicationPlacementDialog from "../Dialog/ApplicationPlacementDialog";
import ApplicationPauseReferralsDialog from "../Dialog/ApplicationPauseReferralsDialog";
import ApplicationResumeReferralsDialog from "../Dialog/ApplicationResumeReferralsDialog";

const QualifiedStatusMeta_Fragment = graphql(/** GraphQL */ `
  fragment QualifiedStatusMeta on PoolCandidate {
    placedDepartment {
      name {
        localized
      }
    }
    placementType {
      value
    }
    resumeReferralsAt
    placedStartDate
    placedEndDate

    ...ApplicationPlacementDialog
    ...ApplicationPauseReferralsDialog
    ...ApplicationResumeReferralsDialog
    ...ApplicationExpiryDateDialog
  }
`);

interface QualifiedStatusMetaProps {
  query: FragmentType<typeof QualifiedStatusMeta_Fragment>;
}

const QualifiedStatusMeta = ({ query }: QualifiedStatusMetaProps) => {
  const intl = useIntl();
  const application = getFragment(QualifiedStatusMeta_Fragment, query);
  const isPlacedIndeterminate =
    application.placementType?.value === PlacementType.PlacedIndeterminate;

  const startDate = application.placedStartDate
    ? formatDate({
        date: parseDateTimeUtc(application.placedStartDate),
        formatString: "PPP",
        intl,
      })
    : null;

  const endDate = application.placedEndDate
    ? formatDate({
        date: parseDateTimeUtc(application.placedEndDate),
        formatString: "PPP",
        intl,
      })
    : null;

  return (
    <>
      <FieldDisplay label={intl.formatMessage(commonMessages.jobPlacement)}>
        <ApplicationPlacementDialog query={application} />
        {application.placedDepartment && (
          <div className="flex flex-col gap-6">
            <Ul space="sm" className="text-gray-600 dark:text-gray-200">
              <li>{application.placedDepartment.name.localized}</li>
              {startDate && (
                <li>
                  {intl.formatMessage(commonMessages.startDate)}
                  {intl.formatMessage(commonMessages.dividingColon)}
                  {startDate}
                </li>
              )}
              {endDate && (
                <li>
                  {intl.formatMessage(commonMessages.endDate)}
                  {intl.formatMessage(commonMessages.dividingColon)}
                  {endDate}
                </li>
              )}
            </Ul>
            {isPlacedIndeterminate && (
              <Notice.Root>
                <Notice.Content>
                  <FieldDisplay
                    label={intl.formatMessage(
                      poolCandidateMessages.notReferred,
                    )}
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Candidate placed and will no longer be referred.",
                      id: "ASs8KF",
                      description:
                        "Message for not referred notice when placed indeterminate",
                    })}
                  </FieldDisplay>
                </Notice.Content>
              </Notice.Root>
            )}
          </div>
        )}
      </FieldDisplay>
      {!isPlacedIndeterminate && (
        <FieldDisplay label={intl.formatMessage(commonMessages.referralStatus)}>
          {application.resumeReferralsAt ? (
            <ApplicationResumeReferralsDialog query={application} />
          ) : (
            <ApplicationPauseReferralsDialog query={application} />
          )}
        </FieldDisplay>
      )}
      <FieldDisplay label={intl.formatMessage(commonMessages.expiryDate)}>
        <ApplicationExpiryDateDialog query={application} />
      </FieldDisplay>
    </>
  );
};

export default QualifiedStatusMeta;
