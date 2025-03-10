import {
  useState,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { useOutletContext } from "react-router";

import { Dialog, Button, DropdownMenu } from "@gc-digital-talent/ui";
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
  CommunityMembersPage_CommunityFragment as CommunityMembersPageCommunityFragmentType,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import { CommunityMember } from "~/utils/communityUtils";

import { CommunityMemberFormValues, ContextType } from "./types";
import { getTeamBasedRoleOptions } from "./utils";
import useAvailableRoles from "./useAvailableRoles";
import { UpdateUserCommunityRoles_Mutation } from "./operations";

type EditCommunityMemberDialogProps = ComponentPropsWithoutRef<
  typeof DropdownMenu.Item
> & {
  user: CommunityMember;
  community: CommunityMembersPageCommunityFragmentType;
  hasPlatformAdmin: boolean;
};

const EditCommunityMemberDialog = forwardRef<
  ElementRef<typeof DropdownMenu.Item>,
  EditCommunityMemberDialogProps
>(({ user, community, hasPlatformAdmin, onSelect, ...rest }, forwardedRef) => {
  const intl = useIntl();
  const { teamId } = useOutletContext<ContextType>();
  const { roles, fetching } = useAvailableRoles();
  const [, executeMutation] = useMutation(UpdateUserCommunityRoles_Mutation);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const initialRolesIds = user.roles.map((role) => role.id);

  const methods = useForm<CommunityMemberFormValues>({
    defaultValues: {
      userId: user.id,
      userDisplay: user.id,
      communityId: community.id,
      roles: initialRolesIds,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSave = async (formValues: CommunityMemberFormValues) => {
    const rolesToAttach = formValues.roles.filter(
      (role) => !initialRolesIds.includes(role),
    );
    const rolesToAttachArray: RoleInput[] = rolesToAttach.map((role) => {
      return { roleId: role, teamId };
    });

    const rolesToDetach = initialRolesIds.filter((roleId) => {
      const role = user.roles.find((userRole) => userRole.id === roleId);
      if (!hasPlatformAdmin && role?.name === "community_admin") {
        return false;
      }
      return !formValues.roles.includes(roleId);
    });
    const rolesToDetachArray: RoleInput[] = rolesToDetach.map((roleId) => {
      return { roleId, teamId };
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

  const roleOptions = getTeamBasedRoleOptions(roles, intl);

  const userName = getFullNameLabel(user.firstName, user.lastName, intl);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <DropdownMenu.Item
          ref={forwardedRef}
          onSelect={(event) => {
            event.preventDefault();
            onSelect?.(event);
          }}
          {...rest}
        >
          {intl.formatMessage({
            defaultMessage: "Edit community roles",
            id: "PsGkXc",
            description:
              "Label for the form to edit a users community membership",
          })}
        </DropdownMenu.Item>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage:
                "Change the roles of {userName} in {communityName}.",
              id: "AscIUu",
              description: "Help text for the edit community membership form",
            },
            {
              userName,
              communityName: getLocalizedName(community.name, intl),
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
                <input type="hidden" name="communityId" value={community.id} />
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
});

export default EditCommunityMemberDialog;
