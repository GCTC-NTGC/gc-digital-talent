import React, { useCallback } from "react";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";
import { User } from "@gc-digital-talent/graphql";

import DeleteUserDialog from "./DeleteUserDialog";
import { DeleteUserFunc } from "../types";

interface DeleteUserSectionProps {
  user: User;
  onDeleteUser: DeleteUserFunc;
}

const DeleteUserSection = ({ user, onDeleteUser }: DeleteUserSectionProps) => {
  const intl = useIntl();

  const handleDeleteUser = useCallback(async () => {
    return onDeleteUser(user.id);
  }, [onDeleteUser, user.id]);

  return (
    <>
      <Heading level="h3" size="h4">
        {intl.formatMessage({
          defaultMessage: "Delete user",
          id: "OaF7ls",
          description: "Heading for section to delete a user",
        })}
      </Heading>
      <p data-h2-padding="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            'This will change the status of a user as "Removed" from the platform. This will prevent the user from appearing anywhere on the platform. <strong>This action cannot be undone</strong>.',
          id: "YwUkFi",
          description: "Heading for section to delete a user",
        })}
      </p>
      <DeleteUserDialog user={user} onDeleteUser={handleDeleteUser} />
    </>
  );
};

export default DeleteUserSection;
