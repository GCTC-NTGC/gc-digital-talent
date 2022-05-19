import * as React from "react";
import { useIntl } from "react-intl";
import { ViewGridIcon } from "@heroicons/react/outline";

import PageHeader from "@common/components/PageHeader";
import { commonMessages } from "@common/messages";

import { usePoolQuery } from "../../api/generated";
import type { Pool } from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

interface ViewPoolPageProps {
  pool: Pool;
}

export const ViewPoolPage: React.FC<ViewPoolPageProps> = ({ pool }) => {
  const intl = useIntl();

  return (
    <div data-h2-padding="b(all, m)">
      <PageHeader icon={ViewGridIcon}>
        {intl.formatMessage({
          defaultMessage: "Pool Details",
          description: "Title for the page when viewing an individual pool.",
        })}
      </PageHeader>
    </div>
  );
};

interface ViewPoolProps {
  poolId: string;
}

const ViewPool: React.FC<ViewPoolProps> = ({ poolId }) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = usePoolQuery({
    variables: { id: poolId },
  });

  if (fetching) {
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  }

  if (error) {
    <DashboardContentContainer>
      <p>
        {intl.formatMessage(commonMessages.loadingError)} {error.message}
      </p>
    </DashboardContentContainer>;
  }

  return (
    <DashboardContentContainer>
      {data?.pool ? (
        <ViewPoolPage pool={data.pool} />
      ) : (
        <p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Pool {poolId} not found.",
                description: "Message displayed for pool not found.",
              },
              { poolId },
            )}
          </p>
        </p>
      )}
    </DashboardContentContainer>
  );
};

export default ViewPool;
