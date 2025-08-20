import { useState } from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import { FormProvider } from "react-hook-form";

import { Dialog, Button, Chip, IconButton } from "@gc-digital-talent/ui";
import {
  commonMessages,
  formMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { Role } from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";

import {
  getUserRoleDialogFragment,
  UserRoleDialogBaseProps,
  useUpdateRolesMutation,
} from "../utils";

interface FormValues {
  userId: string;
  roleId: string;
}

interface RemoveIndividualRoleDialogProps extends UserRoleDialogBaseProps {
  role: Role;
}

const RemoveIndividualRoleDialog = ({
  query,
  role,
}: RemoveIndividualRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = getUserRoleDialogFragment(query);
  const { updateRoles, methods, fetching } = useUpdateRolesMutation<FormValues>(
    { userId: user.id, roleId: role.id },
  );

  const userName = getFullNameHtml(user.firstName, user.lastName, intl);
  const roleDisplayName =
    role.displayName?.localized ??
    intl.formatMessage(commonMessages.notAvailable);

  const handleSubmit = async (values: FormValues) => {
    await updateRoles({
      userId: values.userId,
      roleAssignmentsInput: { detach: [{ roleId: values.roleId }] },
    }).then(() => setIsOpen(false));
  };

  const label = intl.formatMessage(
    {
      defaultMessage: "Remove role<hidden> {role}</hidden>",
      id: "fyidgo",
      description: "Label for the form to remove a role from a user",
    },
    {
      role: roleDisplayName,
    },
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <IconButton color="error" icon={TrashIcon} label={label} />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p className="mb-6">
            {intl.formatMessage(
              {
                defaultMessage:
                  "You are about to remove a role from the following user: <strong>{userName}</strong>",
                id: "Hy2UdW",
                description:
                  "Lead in text for the remove role from user dialog",
              },
              { userName },
            )}
          </p>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage: "The user will lose the following role:",
              id: "VsV4Vu",
              description:
                "Text notifying user which role will be removed from the user",
            })}
          </p>
          <p className="my-6">
            <Chip color="secondary">{roleDisplayName}</Chip>
          </p>
          <p className="my-6">
            {intl.formatMessage(uiMessages.confirmContinue)}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <Dialog.Footer>
                <Button type="submit" mode="solid" color="error">
                  {fetching
                    ? intl.formatMessage(commonMessages.removing)
                    : label}
                </Button>
                <Dialog.Close>
                  <Button color="warning" mode="inline">
                    {intl.formatMessage(formMessages.cancelGoBack)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RemoveIndividualRoleDialog;
