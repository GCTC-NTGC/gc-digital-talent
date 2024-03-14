import React from "react";
import { useIntl } from "react-intl";

import { AlertDialog, Button, DropdownMenu } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

type RemoveDialogProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenu.Item
>;

const RemoveDialog = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  RemoveDialogProps
>(({ onSelect, ...rest }, forwardedRef) => {
  const intl = useIntl();
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <DropdownMenu.Item
          ref={forwardedRef}
          color="error"
          onSelect={(event) => {
            event.preventDefault();
            onSelect?.(event);
          }}
          {...rest}
        >
          {intl.formatMessage(commonMessages.delete)}
        </DropdownMenu.Item>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>
          {intl.formatMessage({
            defaultMessage:
              "Are you sure you want to delete this notification?",
            id: "XdynkW",
            description:
              "Heading for confirmation alert to delete a notification",
          })}
        </AlertDialog.Title>
        <AlertDialog.Footer>
          <AlertDialog.Action>
            <Button color="error">
              {intl.formatMessage({
                defaultMessage: "Delete notification",
                id: "YaDJN+",
                description: "Button text to confirm deleting a notification",
              })}
            </Button>
          </AlertDialog.Action>
          <AlertDialog.Cancel>
            <Button mode="inline" color="quaternary">
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </AlertDialog.Cancel>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
});

export default RemoveDialog;
