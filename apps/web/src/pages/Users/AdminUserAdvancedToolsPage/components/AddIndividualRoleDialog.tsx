import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useIntl } from "react-intl";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { Combobox } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";

import { getFullNameHtml } from "~/utils/nameUtils";

import {
  getRoleTableFragments,
  RoleTableProps,
  useUpdateRolesMutation,
} from "../utils";

interface FormValues {
  roles: string[];
}

const AddIndividualRoleDialog = ({ query, optionsQuery }: RoleTableProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, options } = getRoleTableFragments({ query, optionsQuery });
  const { updateRoles, methods, fetching } =
    useUpdateRolesMutation<FormValues>();
  if (!user) return null;
  const userName = getFullNameHtml(user?.firstName, user?.lastName, intl);

  const handleAddRoles = async (formValues: FormValues) => {
    const roleInputArray = formValues.roles.map((role) => {
      return { roleId: role };
    });

    await updateRoles({
      userId: user?.id,
      roleAssignmentsInput: {
        attach: roleInputArray,
      },
    }).then(() => {
      setIsOpen(false);
    });
  };

  const buttonLabel = intl.formatMessage({
    defaultMessage: "Add individual role",
    id: "9ufudR",
    description: "Label for the button to add a role to a user",
  });

  const roleOptions = options
    .filter((role) => {
      return (
        !role?.isTeamBased &&
        !user.authInfo?.roleAssignments?.some(
          (assignment) => assignment?.role?.id === role.id,
        ) &&
        role.displayName?.localized
      );
    })
    .map((role) => ({
      label:
        role.displayName?.localized ??
        intl.formatMessage(commonMessages.notAvailable),
      value: role.id,
    }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="primary" mode="solid" icon={PlusIcon}>
          {buttonLabel}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Add individual role",
            id: "QCesvO",
            description: "Header for the form to add a role to a user",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-6">
            {intl.formatMessage(
              {
                defaultMessage:
                  "You are about to add a new role to the following user: <strong>{userName}</strong>",
                id: "TvUVa0",
                description: "Lead in text for the add role to user form.",
              },
              { userName },
            )}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleAddRoles)}>
              <Combobox
                id="roles"
                name="roles"
                isMulti
                label={intl.formatMessage({
                  defaultMessage: "Individual roles",
                  id: "tuXnJB",
                  description: "Label for the input to add roles to a user",
                })}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select roles",
                  id: "Cn73yN",
                  description: "Placeholder text for role selection input",
                })}
                options={roleOptions}
              />
              <Dialog.Footer>
                <Button color="primary" type="submit">
                  {fetching
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage(formMessages.saveChanges)}
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

export default AddIndividualRoleDialog;
