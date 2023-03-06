import React from "react";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";

import { Link, Well } from "@gc-digital-talent/ui";
import { getPoolCandidateStatus } from "@gc-digital-talent/i18n";

import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";

import { UserInformationProps } from "../types";
import ChangeStatusDialog from "./ChangeStatusDialog";
import ChangeDateDialog from "./ChangeDateDialog";

const PoolStatusTable = ({ user, pools }: UserInformationProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  if (isEmpty(user.poolCandidates)) {
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
  return (
    <table data-h2-text-align="base(center)">
      <thead>
        <tr
          data-h2-background-color="base(gray.dark)"
          data-h2-color="base(white)"
        >
          <th data-h2-padding="base(x.25, 0)" data-h2-width="base(25%)">
            {intl.formatMessage({
              defaultMessage: "Pool",
              id: "icYqDt",
              description:
                "Title of the 'Pool' column for the table on view-user page",
            })}
          </th>
          <th data-h2-padding="base(x.25, 0)" data-h2-width="base(25%)">
            {intl.formatMessage({
              defaultMessage: "Status",
              id: "sUx3ZS",
              description:
                "Title of the 'Status' column for the table on view-user page",
            })}
          </th>
          <th data-h2-padding="base(x.25, 0)" data-h2-width="base(25%)">
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
        {user.poolCandidates?.map((candidate) => {
          if (candidate) {
            return (
              <tr key={candidate.id}>
                <td
                  data-h2-background-color="base(gray.light)"
                  data-h2-padding="base(x.25, 0)"
                >
                  {candidate.pool ? (
                    <Link href={paths.poolView(candidate.pool.id)}>
                      {getFullPoolAdvertisementTitleHtml(intl, candidate.pool)}
                    </Link>
                  ) : (
                    ""
                  )}
                </td>
                <td
                  data-h2-background-color="base(gray.light)"
                  data-h2-padding="base(x.25, 0)"
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
                  data-h2-text-decoration="base(underline)"
                  data-h2-background-color="base(gray.light)"
                  data-h2-padding="base(x.25, 0)"
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
