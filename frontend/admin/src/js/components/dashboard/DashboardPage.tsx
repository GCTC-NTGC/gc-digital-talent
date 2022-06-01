import React from "react";
import { useIntl } from "react-intl";
import {
  HomeIcon,
  TicketIcon,
  UserIcon,
  ViewGridIcon,
} from "@heroicons/react/outline";
import { IconLink } from "@common/components/Link";
import PageHeader from "@common/components/PageHeader";

import { commonMessages } from "@common/messages";

import DashboardContentContainer from "../DashboardContentContainer";
import { User, useMeQuery } from "../../api/generated";
import { useAdminRoutes } from "../../adminRoutes";

import LatestRequestsTable from "./LatestRequestsTable";

interface DashboardPageProps {
  currentUser?: User | null;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser }) => {
  const intl = useIntl();
  const adminRoutes = useAdminRoutes();

  return (
    <DashboardContentContainer>
      <PageHeader icon={HomeIcon}>
        {intl.formatMessage(
          {
            defaultMessage: "Welcome back, {name}",
            description:
              "Title for dashboard on the talent cloud admin portal.",
          },
          {
            name: currentUser
              ? `${currentUser.firstName} ${currentUser.lastName}`
              : intl.formatMessage({
                  defaultMessage: "N/A",
                  description: "Not available message.",
                }),
          },
        )}
      </PageHeader>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "On this page you can find a list of active pools along with a few details about their status.",
          description:
            "Description of the content found on the admin portal dashboard page.",
        })}
      </p>
      <div
        data-h2-display="b(flex)"
        data-h2-flex-wrap="b(wrap)"
        data-h2-margin="b(top-bottom, m)"
      >
        <span data-h2-margin="b(bottom-right, s)">
          <IconLink
            mode="solid"
            color="secondary"
            type="button"
            href={adminRoutes.poolTable()}
            icon={ViewGridIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Manage pools",
              description:
                "Text label for link to pools page on admin dashboard",
            })}
          </IconLink>
        </span>
        <span data-h2-margin="b(bottom-right, s)">
          <IconLink
            mode="solid"
            color="secondary"
            type="button"
            href={adminRoutes.userTable()}
            icon={UserIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Manage users",
              description:
                "Text label for link to users page on admin dashboard",
            })}
          </IconLink>
        </span>
        <span data-h2-margin="b(bottom-right, s)">
          <IconLink
            mode="solid"
            color="secondary"
            type="button"
            href={adminRoutes.searchRequestTable()}
            icon={TicketIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Manage requests",
              description:
                "Text label for link to requests page on admin dashboard",
            })}
          </IconLink>
        </span>
      </div>
      <LatestRequestsTable />
    </DashboardContentContainer>
  );
};

const DashboardPageApi: React.FC = () => {
  const intl = useIntl();
  const [result] = useMeQuery();
  const { data, fetching, error } = result;

  if (fetching) {
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  }

  if (error) {
    return (
      <DashboardContentContainer>
        <p>
          {intl.formatMessage(commonMessages.loadingError)}
          {error.message}
        </p>
      </DashboardContentContainer>
    );
  }

  return <DashboardPage currentUser={data?.me} />;
};

export default DashboardPageApi;
