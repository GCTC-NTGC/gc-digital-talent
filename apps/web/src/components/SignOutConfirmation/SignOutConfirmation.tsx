import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { AlertDialog, Button } from "@gc-digital-talent/ui";
import { useAuthentication } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";

import authMessages from "~/messages/authMessages";

interface SignOutConfirmationProps {
  children: ReactNode;
}

const SignOutConfirmation = ({ children }: SignOutConfirmationProps) => {
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
          <AlertDialog.Action>
            <Button color="primary" type="button" onClick={() => logout()}>
              {intl.formatMessage(authMessages.signOut)}
            </Button>
          </AlertDialog.Action>
          <AlertDialog.Cancel>
            <Button color="warning" type="button" mode="inline">
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </AlertDialog.Cancel>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default SignOutConfirmation;
