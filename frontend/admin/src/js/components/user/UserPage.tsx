import React from "react";
import { useIntl } from "react-intl";
import { UserGroupIcon } from "@heroicons/react/outline";
import PageHeader from "@common/components/PageHeader";

import { UserTableApi } from "./UserTable";
import DashboardContentContainer from "../DashboardContentContainer";

export const UserPage: React.FC = () => {
  const intl = useIntl();
  return (
    <DashboardContentContainer>
      <PageHeader icon={UserGroupIcon}>
        {intl.formatMessage({
          defaultMessage: "Users",
          description: "Title for users page on the admin portal.",
        })}
      </PageHeader>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "The following is a list of active users along with some of their details.",
          description:
            "Descriptive text about the list of users in the admin portal.",
        })}
      </p>
      <UserTableApi />
    </DashboardContentContainer>
  );
};

export default UserPage;
