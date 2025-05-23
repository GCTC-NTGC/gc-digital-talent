import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import Combobox from "@gc-digital-talent/forms/Combobox";
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
  Scalars,
  RoleInput,
} from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";

import { PoolTeamable } from "../types";

interface FormValues {
  roles: Scalars["UUID"]["output"][];
}

interface EditProcessRoleDialogProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
  initialRoles: Role[];
  processRoles: Role[];
  pool: PoolTeamable;
  onEditRoles: (
    submitData: UpdateUserRolesInput,
  ) => Promise<UpdateUserRolesMutation["updateUserRoles"]>;
}

const EditProcessRoleDialog = ({
  user,
  initialRoles,
  processRoles,
  pool,
  onEditRoles,
}: EditProcessRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id, firstName, lastName } = user;

  const userName = getFullNameHtml(firstName, lastName, intl);
  const poolDisplayName = getLocalizedName(pool.name, intl);
  const initialRolesIds = initialRoles.map((role) => role.id);

  const methods = useForm<FormValues>({
    defaultValues: {
      roles: initialRolesIds,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleEditRoles = async (formValues: FormValues) => {
    const rolesToAttach = formValues.roles.filter(
      (role) => !initialRolesIds.includes(role),
    );
    const rolesToAttachArray: RoleInput[] = rolesToAttach.map((role) => {
      return { roleId: role, teamId: pool.teamIdForRoleAssignment };
    });
    const rolesToDetach = initialRolesIds.filter(
      (role) => !formValues.roles.includes(role),
    );
    const rolesToDetachArray: RoleInput[] = rolesToDetach.map((role) => {
      return { roleId: role, teamId: pool.teamIdForRoleAssignment };
    });

    return onEditRoles({
      userId: id,
      roleAssignmentsInput: {
        attach: rolesToAttachArray.length ? rolesToAttachArray : undefined,
        detach: rolesToDetachArray.length ? rolesToDetachArray : undefined,
      },
    })
      .then(() => {
        setIsOpen(false);
        toast.success(intl.formatMessage(adminMessages.rolesUpdated));
      })
      .catch(() => {
        toast.error(intl.formatMessage(adminMessages.rolesUpdateFailed));
      });
  };

  const label = intl.formatMessage({
    defaultMessage: "Edit process roles",
    id: "IReTZe",
    description: "Label for the form to edit a users process membership",
  });

  const roleOptions = processRoles.map((role) => ({
    label: getLocalizedName(role.displayName, intl),
    value: role.id,
  }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="secondary" icon={PencilSquareIcon} mode="icon_only">
          <span data-h2-visually-hidden="base(invisible)">{label}</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin="base(0, 0 ,x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "You are about to edit roles for the following member:",
              id: "nBaT85",
              description: "Lead in text for the edit roles on user form.",
            })}
          </p>
          <ul>
            <li data-h2-font-weight="base(bold)">
              <span>{userName}</span>
            </li>
          </ul>
          <p data-h2-margin="base(x1, 0 ,x1, 0)">
            {intl.formatMessage({
              defaultMessage: "From the following process:",
              id: "7+HKOE",
              description: "Follow in text for the process being updated",
            })}
          </p>
          <ul>
            <li data-h2-font-weight="base(bold)">
              <span>{poolDisplayName}</span>
            </li>
          </ul>
          <p data-h2-margin="base(x1, 0 ,x1, 0)">
            {intl.formatMessage({
              defaultMessage: "Select the roles you want to keep",
              id: "47YSK0",
              description: "Role editing details",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleEditRoles)}>
              <Combobox
                id="roles"
                name="roles"
                isMulti
                label={intl.formatMessage({
                  defaultMessage: "Process roles",
                  id: "eGqjYh",
                  description: "Heading for updating a user's process roles",
                })}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select role",
                  id: "mTsq+x",
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

export default EditProcessRoleDialog;
