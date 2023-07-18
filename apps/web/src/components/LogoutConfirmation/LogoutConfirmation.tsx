import React from "react";
import { useIntl } from "react-intl";

import { AlertDialog, Button } from "@gc-digital-talent/ui";
import { useAuthentication } from "@gc-digital-talent/auth";

import authMessages from "~/messages/authMessages";

interface LogoutConfirmationProps {
  children: React.ReactNode;
}

const LogoutConfirmation = ({ children }: LogoutConfirmationProps) => {
  const intl = useIntl();
  const { logout } = useAuthentication();
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>
          {intl.formatMessage(authMessages.signOut)}
        </AlertDialog.Title>
        <AlertDialog.Description>
          {intl.formatMessage({
            defaultMessage: "Are you sure you would like to sign out?",
            id: "RwXPoj",
            description:
              "Question displayed when authenticated user attempts to sign out",
          })}
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button color="primary" type="button">
              {intl.formatMessage({
                defaultMessage: "Cancel",
                id: "AhNR6n",
                description: "Link text to cancel logging out.",
              })}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              mode="solid"
              color="primary"
              type="button"
              onClick={() => logout()}
            >
              {intl.formatMessage(authMessages.signOut)}
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default LogoutConfirmation;
