import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link } from "../../helpers/router";
import { UserTableApi } from "./UserTable";

const messages = defineMessages({
  userCreateHeading: {
    id: "userPage.createUserHeading",
    defaultMessage: "Create User",
    description: "Heading displayed above the User Table component.",
  },
});

export const UserPage: React.FC = () => {
  const intl = useIntl();
  return (
    <div>
      <Link href="/users/create" title="">
        {intl.formatMessage(messages.userCreateHeading)}
      </Link>
      <UserTableApi />
    </div>
  );
};

export default UserPage;
