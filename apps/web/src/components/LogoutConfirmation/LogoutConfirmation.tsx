import React from "react";
import { useIntl } from "react-intl";

import { AlertDialog, Button } from "@gc-digital-talent/ui";
import { useAuthentication } from "@gc-digital-talent/auth";

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
          {intl.formatMessage({
            defaultMessage: "Logout",
            id: "ivKwx0",
            description:
              "Title for the modal that appears when an authenticated user attempts to logout",
          })}
        </AlertDialog.Title>
        <AlertDialog.Description>
          {intl.formatMessage({
            defaultMessage: "Are you sure you would like to logout?",
            id: "s3FrzP",
            description:
              "Question displayed when authenticated user attempts to logout",
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
              {intl.formatMessage({
                defaultMessage: "Logout",
                id: "6rhyxk",
                description: "Link text to logout.",
              })}
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default LogoutConfirmation;
