import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";

import { Dialog, Button, Ul } from "@gc-digital-talent/ui";
import { Input } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import { User, DeleteUserMutation } from "@gc-digital-talent/graphql";

import { getFullNameHtml, getFullNameLabel } from "~/utils/nameUtils";

interface FormValues {
  roles: string[];
  team: string | null;
}

interface AddTeamRoleDialogProps {
  user: Pick<User, "deletedDate" | "firstName" | "lastName">;
  onDeleteUser: () => Promise<DeleteUserMutation["deleteUser"]>;
}

const DeleteUserDialog = ({ user, onDeleteUser }: AddTeamRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { deletedDate, firstName, lastName } = user;
  const userNameHtml = getFullNameHtml(firstName, lastName, intl);
  const userNameExpected = getFullNameLabel(firstName, lastName, intl);

  const methods = useForm<FormValues>({
    defaultValues: {
      roles: [],
      team: null,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleAddRoles = async () => {
    return onDeleteUser().then(() => {
      setIsOpen(false);
      toast.success(
        intl.formatMessage({
          defaultMessage: "User deleted successfully",
          id: "rTnjej",
          description: "Message displayed when a user has been deleted",
        }),
      );
    });
  };

  const label = intl.formatMessage({
    defaultMessage: "Delete this user",
    id: "5jm/N7",
    description: "Label on the button to open the delete user dialog",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          color="error"
          mode="solid"
          icon={TrashIcon}
          disabled={!!deletedDate}
        >
          {label}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You are about to delete the following user from the platform:",
              id: "inxVq8",
              description: "Lead in text for the delete user form.",
            })}
          </p>
          <Ul className="my-3">
            <li className="font-bold">{userNameHtml}</li>
          </Ul>
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage: "Please write the user's full name to confirm:",
              id: "YexsZi",
              description: "Lead in text for the delete user form.",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddRoles)}>
              <div className="flex flex-col gap-y-6">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label={intl.formatMessage({
                    defaultMessage: "User name:",
                    id: "+s+emq",
                    description:
                      "Label for the user name input in the delete user dialog",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                    validate: (value) =>
                      value === userNameExpected ||
                      intl.formatMessage(
                        {
                          defaultMessage:
                            "Value must match the users full name: {name}",
                          id: "6mCorq",
                          description:
                            "Placeholder text for user name input in the delete user dialog",
                        },
                        { name: userNameExpected },
                      ),
                  }}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Write name here",
                    id: "B164SZ",
                    description:
                      "Placeholder text for user name input in the delete user dialog",
                  })}
                />
              </div>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button color="primary">
                    {intl.formatMessage(formMessages.cancelGoBack)}
                  </Button>
                </Dialog.Close>
                <Button
                  mode="solid"
                  color="error"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage({
                        defaultMessage: "Delete user",
                        id: "5l+q/p",
                        description: "Submit button in delete user dialog",
                      })}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteUserDialog;
