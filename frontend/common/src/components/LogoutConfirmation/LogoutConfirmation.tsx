import React from "react";
import { useIntl } from "react-intl";

import AlertDialog from "../AlertDialog";
import Button from "../Button";

interface LogoutConfirmationProps {
  isOpen: boolean;
  onLogout: () => void;
  onDismiss: () => void;
}

const LogoutConfirmation = ({
  isOpen,
  onLogout,
  onDismiss,
}: LogoutConfirmationProps) => {
  const intl = useIntl();
  const cancelRef = React.useRef(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onDismiss={onDismiss}
      title={intl.formatMessage({
        defaultMessage: "Logout",
        id: "ivKwx0",
        description:
          "Title for the modal that appears when an authenticated user attempts to logout",
      })}
    >
      <AlertDialog.Description>
        {intl.formatMessage({
          defaultMessage: "Are you sure you would like to logout?",
          id: "s3FrzP",
          description:
            "Question displayed when authenticated user attempts to logout",
        })}
      </AlertDialog.Description>
      <AlertDialog.Footer>
        <Button
          mode="outline"
          color="primary"
          type="button"
          ref={cancelRef}
          onClick={onDismiss}
        >
          {intl.formatMessage({
            defaultMessage: "Cancel",
            id: "AhNR6n",
            description: "Link text to cancel logging out.",
          })}
        </Button>
        <span data-h2-margin="base(0, 0, 0, x.5)">
          <Button mode="solid" color="primary" type="button" onClick={onLogout}>
            {intl.formatMessage({
              defaultMessage: "Logout",
              id: "6rhyxk",
              description: "Link text to logout.",
            })}
          </Button>
        </span>
      </AlertDialog.Footer>
    </AlertDialog>
  );
};

export default LogoutConfirmation;
