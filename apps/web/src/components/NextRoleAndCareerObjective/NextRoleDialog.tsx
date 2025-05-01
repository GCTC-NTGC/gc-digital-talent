import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Button, Dialog } from "@gc-digital-talent/ui";

import NextRole from "./NextRole";

export const NextRoleDialog_Fragment = graphql(/* GraphQL */ `
  fragment NextRoleDialog on User {
    firstName
    employeeProfile {
      ...NextRoleInfo
    }
  }
`);

interface NextRoleDialogProps {
  nextRoleDialogQuery: FragmentType<typeof NextRoleDialog_Fragment>;
  trigger?: ReactNode;
  defaultOpen?: boolean;
}

const NextRoleDialog = ({
  nextRoleDialogQuery,
  trigger,
  defaultOpen = false,
}: NextRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(defaultOpen);
  const nextRole = getFragment(NextRoleDialog_Fragment, nextRoleDialogQuery);

  const title = intl.formatMessage(
    {
      defaultMessage: "{firstName}'s next role",
      id: "F7hMI9",
      description: "Title for next role dialog",
    },
    {
      firstName:
        nextRole.firstName ?? intl.formatMessage(commonMessages.notFound),
    },
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger || <Button>{title}</Button>}</Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Learn more about the role this nominee is seeking next in their career path.",
            id: "0Ejl5g",
            description: "Subtitle for dialog viewing next role info",
          })}
        >
          {title}
        </Dialog.Header>
        <Dialog.Body>
          {/* TODO: Add well with null message if fragment is undefined? */}
          {nextRole.employeeProfile && (
            <NextRole nextRoleQuery={nextRole.employeeProfile} />
          )}
          <Dialog.Footer>
            <Dialog.Close>
              <Button mode="inline" color="quaternary">
                {intl.formatMessage(commonMessages.close)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NextRoleDialog;
