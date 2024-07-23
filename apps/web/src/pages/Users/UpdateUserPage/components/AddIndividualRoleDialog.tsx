import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { Combobox } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  UpdateUserRolesInput,
  UpdateUserRolesMutation,
  Role,
  User,
  RoleInput,
} from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";

type FormValues = {
  roles: Array<string>;
};

interface AddIndividualRoleDialogProps {
  user: User;
  availableRoles: Array<Role>;
  onAddRoles: (
    submitData: UpdateUserRolesInput,
  ) => Promise<UpdateUserRolesMutation["updateUserRoles"]>;
}

const AddIndividualRoleDialog = ({
  user,
  availableRoles,
  onAddRoles,
}: AddIndividualRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const userName = getFullNameHtml(user.firstName, user.lastName, intl);

  const methods = useForm<FormValues>({
    defaultValues: {
      roles: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleAddRoles = async (formValues: FormValues) => {
    const roleInputArray: RoleInput[] = formValues.roles.map((role) => {
      return { roleId: role };
    });

    return onAddRoles({
      userId: user.id,
      roleAssignmentsInput: {
        attach: roleInputArray,
      },
    }).then(() => {
      setIsOpen(false);
      toast.success(
        intl.formatMessage({
          defaultMessage: "Role(s) added successfully",
          id: "/17wgm",
          description:
            "Message displayed to user when one or more roles have been added to a user",
        }),
      );
    });
  };

  const label = intl.formatMessage({
    defaultMessage: "Add new role",
    id: "2lNHxh",
    description: "Label for the form to add a role to a user",
  });

  const roleOptions = availableRoles
    .filter((role) => {
      return (
        !role.isTeamBased &&
        !user?.authInfo?.roleAssignments?.some(
          (assignment) => assignment?.role?.id === role.id,
        )
      );
    })
    .map((role) => ({
      label: getLocalizedName(role.displayName, intl),
      value: role.id,
    }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="primary" mode="solid" icon={PlusIcon}>
          {label}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin="base(0, 0 ,x1, 0)">
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
            <form onSubmit={handleSubmit(handleAddRoles)}>
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
                <Dialog.Close>
                  <Button color="secondary">
                    {intl.formatMessage(formMessages.cancelGoBack)}
                  </Button>
                </Dialog.Close>
                <Button
                  mode="solid"
                  color="secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage(formMessages.saveChanges)}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddIndividualRoleDialog;
