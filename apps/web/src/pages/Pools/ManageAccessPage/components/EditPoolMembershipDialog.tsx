import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import { useMutation } from "urql";

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
  RoleInput,
  ManageAccessPagePoolFragment as ManageAccessPagePoolFragmentType,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";

import { ManageAccessFormValues, PoolTeamMember } from "./types";
import useAvailableRoles from "./useAvailableRoles";
import { UpdateUserProcessRoles_Mutation } from "./operations";

interface EditPoolMembershipDialogProps {
  user: PoolTeamMember;
  pool: ManageAccessPagePoolFragmentType;
  hasPlatformAdmin: boolean;
}

const EditPoolMembershipDialog = ({
  user,
  pool,
  hasPlatformAdmin,
}: EditPoolMembershipDialogProps) => {
  const intl = useIntl();
  const poolId = pool.id;
  const { roles, fetching } = useAvailableRoles();
  const [, executeMutation] = useMutation(UpdateUserProcessRoles_Mutation);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const initialRolesIds = user.roles.map((role) => role.id);

  const methods = useForm<ManageAccessFormValues>({
    defaultValues: {
      userId: user.id,
      userDisplay: user.id,
      poolId: pool.id,
      roles: initialRolesIds,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSave = async (formValues: ManageAccessFormValues) => {
    const rolesToAttach = formValues.roles.filter(
      (role) => !initialRolesIds.includes(role),
    );
    const rolesToAttachArray: RoleInput[] = rolesToAttach.map((role) => {
      return { roleId: role, teamId: poolId };
    });

    const rolesToDetach = initialRolesIds.filter((roleId) => {
      const role = user.roles.find((userRole) => userRole.id === roleId);
      if (!hasPlatformAdmin && role?.name === "community_admin") {
        return false;
      }
      return !formValues.roles.includes(roleId);
    });
    const rolesToDetachArray: RoleInput[] = rolesToDetach.map((roleId) => {
      return { roleId, teamId: poolId };
    });

    await executeMutation({
      updateUserRolesInput: {
        userId: formValues.userId,
        roleAssignmentsInput: {
          attach: rolesToAttachArray.length ? rolesToAttachArray : undefined,
          detach: rolesToDetachArray.length ? rolesToDetachArray : undefined,
        },
      },
    })
      .then((res) => {
        if (!res.error) {
          setIsOpen(false);
          toast.success(
            intl.formatMessage({
              defaultMessage: "Roles updated successfully",
              id: "Jc9FDx",
              description:
                "Alert displayed to user when a community member's roles have been updated",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Role update failed",
            id: "bmOZXl",
            description:
              "Alert displayed to user when an error occurs while editing a community member's roles",
          }),
        );
      });
  };

  const roleOptions = roles.map((role) => ({
    label: getLocalizedName(role.displayName, intl),
    value: role.id,
  }));

  const userName = getFullNameLabel(user.firstName, user.lastName, intl);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          color="secondary"
          aria-label={intl.formatMessage(
            {
              defaultMessage:
                "Edit community roles of {userName} in {poolName}",
              id: "aSCx7d",
              description:
                "Aria label for the dialog trigger to edit user community membership",
            },
            {
              userName,
              poolName: getLocalizedName(pool.name, intl),
            },
          )}
          icon={PencilSquareIcon}
          mode="icon_only"
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage: "Change the roles of {userName} in {poolName}.",
              id: "CEatcZ",
              description: "Help text for the edit community membership form",
            },
            {
              userName,
              poolName: getLocalizedName(pool.name, intl),
            },
          )}
        >
          {intl.formatMessage({
            defaultMessage: "Edit community roles",
            id: "eS/PsM",
            description: "Label for the form to edit user community membership",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1 0)"
              >
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="poolId" value={pool.id} />
                <Combobox
                  id="roles"
                  name="roles"
                  isMulti
                  fetching={fetching}
                  label={intl.formatMessage({
                    defaultMessage: "Roles",
                    id: "RIcumI",
                    description:
                      "Label for the input to add roles to a user's community membership",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Select roles",
                    id: "Cn73yN",
                    description: "Placeholder text for role selection input",
                  })}
                  options={roleOptions}
                />
              </div>
              <Dialog.Footer>
                <Button color="secondary" type="submit" disabled={isSubmitting}>
                  {isSubmitting
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

export default EditPoolMembershipDialog;
