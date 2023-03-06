import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { PlusIcon } from "@heroicons/react/24/outline";

import { Dialog, Button, IconButton } from "@gc-digital-talent/ui";
import { MultiSelectField } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";

import {
  Role,
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
  User,
} from "~/api/generated";
import { getFullNameHtml } from "~/utils/nameUtils";

type FormValues = {
  roles: Array<string>;
};

export type IndividualRoleSubmitData = Partial<UpdateUserAsAdminInput>;

interface AddIndividualRoleDialogProps {
  user: User;
  availableRoles: Array<Role>;
  onAddRoles: (
    submitData: UpdateUserAsAdminInput,
  ) => Promise<UpdateUserAsAdminMutation["updateUserAsAdmin"]>;
}

const AddIndividualRoleDialog = ({
  user,
  availableRoles,
  onAddRoles,
}: AddIndividualRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
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
    return onAddRoles({
      roles: {
        attach: {
          roles: formValues.roles,
        },
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
        !user?.roleAssignments?.some(
          (assignment) => assignment.role?.id === role.id,
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
        <IconButton color="primary" mode="solid" icon={PlusIcon}>
          {label}
        </IconButton>
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
              <MultiSelectField
                id="roles"
                name="roles"
                label={intl.formatMessage({
                  defaultMessage: "Individual roles",
                  id: "tuXnJB",
                  description: "Label for the input to add roles to a user",
                })}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select roles...",
                  id: "eW7I5E",
                  description: "Placeholder text for role selection input",
                })}
                options={roleOptions}
              />
              <Dialog.Footer>
                <Dialog.Close>
                  <Button mode="outline" color="secondary">
                    {intl.formatMessage({
                      defaultMessage: "Cancel and go back",
                      id: "tiF/jI",
                      description: "Close dialog button",
                    })}
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
                    : intl.formatMessage({
                        defaultMessage: "Save changes",
                        id: "UGk7lG",
                        description: "Button to save the roles to a user",
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

export default AddIndividualRoleDialog;
