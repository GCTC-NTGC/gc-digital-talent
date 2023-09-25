import React from "react";
import { useIntl } from "react-intl";
import isPast from "date-fns/isPast";

import { Link, Well } from "@gc-digital-talent/ui";
import { getPoolCandidateStatus, getPoolStream } from "@gc-digital-talent/i18n";
import { PoolCandidate, PoolCandidateStatus } from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { notEmpty } from "@gc-digital-talent/helpers";

import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";

import { UserInformationProps } from "../../pages/Users/UserInformationPage/types";
import ChangeStatusDialog from "../../pages/Users/UserInformationPage/components/ChangeStatusDialog";
import ChangeDateDialog from "../../pages/Users/UserInformationPage/components/ChangeDateDialog";

const isSuspended = (suspendedAt: PoolCandidate["suspendedAt"]): boolean => {
  if (!suspendedAt) return false;

  const suspendedAtDate = parseDateTimeUtc(suspendedAt);
  return isPast(suspendedAtDate);
};

const PoolStatusTable = ({ user, pools }: UserInformationProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const poolCandidatesArray = user.poolCandidates?.filter(notEmpty);

  if (!poolCandidatesArray || poolCandidatesArray.length === 0) {
    return (
      <Well>
        {intl.formatMessage({
          defaultMessage: "This user is not in any pools yet",
          id: "W58QTT",
          description:
            "Message on view-user page that the user is not in any pools",
        })}
      </Well>
    );
  }

  const sortOrder = [
    PoolCandidateStatus.PlacedIndeterminate,
    PoolCandidateStatus.PlacedTerm,
    PoolCandidateStatus.PlacedCasual,
    PoolCandidateStatus.QualifiedAvailable,
    PoolCandidateStatus.QualifiedUnavailable,
    PoolCandidateStatus.QualifiedWithdrew,
    PoolCandidateStatus.UnderAssessment,
    PoolCandidateStatus.ScreenedIn,
    PoolCandidateStatus.ScreenedOutAssessment,
    PoolCandidateStatus.ScreenedOutNotInterested,
    PoolCandidateStatus.ScreenedOutNotResponsive,
    PoolCandidateStatus.ScreenedOutApplication,
    PoolCandidateStatus.ApplicationReview,
    PoolCandidateStatus.NewApplication,
    PoolCandidateStatus.Removed,
    PoolCandidateStatus.Draft,
    PoolCandidateStatus.DraftExpired,
    PoolCandidateStatus.Expired,
  ];

  // reuse logic of enumToOptions and fit it to the types involved
  poolCandidatesArray.sort((a, b) => {
    const aPosition = sortOrder.indexOf(
      a.status ?? PoolCandidateStatus.Expired, // if status undefined fallback to treating as last status in ordering
    );
    const bPosition = sortOrder.indexOf(
      b.status ?? PoolCandidateStatus.Expired,
    );
    if (aPosition >= 0 && bPosition >= 0)
      return (
        sortOrder.indexOf(a.status ?? PoolCandidateStatus.Expired) -
        sortOrder.indexOf(b.status ?? PoolCandidateStatus.Expired)
      );
    if (aPosition >= 0 && bPosition < 0) return -1;
    if (aPosition < 0 && bPosition >= 0) return 1;
    return 0;
  });

  return (
    <table data-h2-text-align="base(center)">
      <thead>
        <tr
          data-h2-background-color="base(gray.dark)"
          data-h2-color="base(white)"
        >
          <th data-h2-padding="base(x.25)" data-h2-width="base(25%)">
            {intl.formatMessage({
              defaultMessage: "Pool",
              id: "icYqDt",
              description:
                "Title of the 'Pool' column for the table on view-user page",
            })}
          </th>
          <th data-h2-padding="base(x.25)" data-h2-width="base(25%)">
            {intl.formatMessage({
              defaultMessage: "Status",
              id: "sUx3ZS",
              description:
                "Title of the 'Status' column for the table on view-user page",
            })}
          </th>
          <th data-h2-padding="base(x.25)" data-h2-width="base(25%)">
            {intl.formatMessage({
              defaultMessage: "Availability",
              id: "mevv+t",
              description: "Availability label",
            })}
          </th>
          <th data-h2-padding="base(x.25)" data-h2-width="base(25%)">
            {intl.formatMessage({
              defaultMessage: "Application",
              id: "cF8idC",
              description: "Label for the application link column",
            })}
          </th>
          <th data-h2-padding="base(x.25)" data-h2-width="base(25%)">
            {intl.formatMessage({
              defaultMessage: "Expiry date",
              id: "STDYoR",
              description:
                "Title of the 'Expiry date' column for the table on view-user page",
            })}
          </th>
        </tr>
      </thead>
      <tbody>
        {poolCandidatesArray.map((candidate) => {
          if (candidate) {
            return (
              <tr key={candidate.id}>
                <td
                  data-h2-background-color="base(gray.light)"
                  data-h2-padding="base(x.25)"
                >
                  {candidate.pool ? (
                    <Link
                      color="black"
                      href={paths.poolView(candidate.pool.id)}
                    >
                      {getFullPoolTitleHtml(intl, candidate.pool)}
                    </Link>
                  ) : (
                    ""
                  )}
                </td>
                <td
                  data-h2-background-color="base(gray.light)"
                  data-h2-padding="base(x.25)"
                >
                  {intl.formatMessage(
                    getPoolCandidateStatus(candidate.status as string),
                  )}
                  {" - "}
                  <ChangeStatusDialog
                    selectedCandidate={candidate}
                    user={user}
                    pools={pools}
                  />
                </td>
                <td
                  data-h2-background-color="base(gray.light)"
                  data-h2-padding="base(x.25)"
                >
                  {isSuspended(candidate.suspendedAt)
                    ? intl.formatMessage({
                        defaultMessage: "Inactive",
                        id: "u5UAJn",
                        description:
                          "Status message if the application is suspended",
                      })
                    : intl.formatMessage({
                        defaultMessage: "Active",
                        id: "4L9rHO",
                        description:
                          "Status message if the application is not suspended",
                      })}
                </td>
                <td
                  data-h2-background-color="base(gray.light)"
                  data-h2-padding="base(x.25)"
                >
                  <Link href={paths.poolCandidateApplication(candidate.id)}>
                    {intl.formatMessage(
                      {
                        defaultMessage: "View {title} application",
                        id: "+PCQ8p",
                        description:
                          "Link text to view a specific application of a candidate",
                      },
                      {
                        title: intl.formatMessage(
                          getPoolStream(candidate.pool.stream ?? ""),
                        ),
                      },
                    )}
                  </Link>
                </td>
                <td
                  data-h2-text-decoration="base(underline)"
                  data-h2-background-color="base(gray.light)"
                  data-h2-padding="base(x.25)"
                  data-h2-white-space="base(nowrap)"
                >
                  <ChangeDateDialog selectedCandidate={candidate} user={user} />
                </td>
              </tr>
            );
          }
          return null;
        })}
      </tbody>
    </table>
  );
};

export default PoolStatusTable;
