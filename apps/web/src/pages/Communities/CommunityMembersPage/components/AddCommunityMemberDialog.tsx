import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import debounce from "lodash/debounce";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import { useMutation } from "urql";
import { useOutletContext } from "react-router-dom";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { Combobox, Select } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  RoleInput,
  CommunityMembersPage_CommunityFragment as CommunityMembersPageCommunityFragmentType,
} from "@gc-digital-talent/graphql";

import { getFullNameAndEmailLabel } from "~/utils/nameUtils";
import { CommunityMember } from "~/utils/communityUtils";
import adminMessages from "~/messages/adminMessages";

import { CommunityMemberFormValues, ContextType } from "./types";
import { getTeamBasedRoleOptions } from "./utils";
import useAvailableUsers from "./useAvailableUsers";
import useAvailableRoles from "./useAvailableRoles";
import { UpdateUserCommunityRoles_Mutation } from "./operations";

interface AddCommunityMemberDialogProps {
  community: CommunityMembersPageCommunityFragmentType;
  members: Array<CommunityMember>;
}

const AddCommunityMemberDialog = ({
  community,
  members,
}: // onSave,
AddCommunityMemberDialogProps) => {
  const intl = useIntl();
  const [query, setQuery] = useState<string>("");
  const {
    users,
    total,
    fetching: usersFetching,
  } = useAvailableUsers(members, {
    publicProfileSearch: query || undefined,
  });

  const { teamId } = useOutletContext<ContextType>();
  const { roles, fetching: rolesFetching } = useAvailableRoles();
  const [, executeMutation] = useMutation(UpdateUserCommunityRoles_Mutation);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const methods = useForm<CommunityMemberFormValues>({
    defaultValues: {
      userId: "",
      communityId: community.id,
      communityDisplay: community.id, // This form field will be disabled and only used for display purposes.
      roles: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSave = async (formValues: CommunityMemberFormValues) => {
    const roleInputArray: RoleInput[] = formValues.roles.map((role) => {
      return { roleId: role, teamId };
    });

    await executeMutation({
      updateUserRolesInput: {
        userId: formValues.userId,
        roleAssignmentsInput: {
          attach: roleInputArray,
        },
      },
    })
      .then((res) => {
        if (!res.error) {
          setIsOpen(false);
          toast.success(
            intl.formatMessage({
              defaultMessage: "Member added successfully",
              id: "hxNP4v",
              description:
                "Alert displayed to user when a community member's roles have been updated",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Member role update failed",
            id: "nKXTN6",
            description:
              "Alert displayed to user when an error occurs while editing a community member's roles",
          }),
        );
      });
  };

  const handleDebouncedSearch = debounce((newQuery: string) => {
    setQuery(newQuery);
  }, 300);

  const roleOptions = getTeamBasedRoleOptions(roles, intl);
  const userOptions = users?.map((user) => ({
    value: user.id,
    label: getFullNameAndEmailLabel(
      user.firstName,
      user.lastName,
      user.email,
      intl,
    ),
  }));

  const label = intl.formatMessage({
    defaultMessage: "Add member",
    id: "wBMn5c",
    description: "Label for the add member to community form",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="secondary" icon={PlusCircleIcon}>
          {label}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage({
              defaultMessage:
                "Select the user you would like to add to this community.",
              id: "eii0/p",
              description:
                "Help text for user field on the add member to community form",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1 0)"
              >
                <Combobox
                  id="userId"
                  name="userId"
                  fetching={usersFetching}
                  isExternalSearch
                  onSearch={handleDebouncedSearch}
                  total={total}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  label={intl.formatMessage({
                    defaultMessage: "User name",
                    id: "pQyhXY",
                    description:
                      "Label for the user select field on community membership form",
                  })}
                  options={userOptions ?? []}
                />
                {/** Note: Only one option since we are adding to this community's users */}
                <input type="hidden" name="communityId" value={community.id} />
                <Select
                  id="communityDisplay"
                  name="communityDisplay"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  disabled
                  label={intl.formatMessage(adminMessages.community)}
                  options={[
                    {
                      value: community.id,
                      label: getLocalizedName(community.name, intl),
                    },
                  ]}
                />
                <Combobox
                  id="roles"
                  name="roles"
                  isMulti
                  fetching={rolesFetching}
                  label={intl.formatMessage({
                    defaultMessage: "Member roles",
                    id: "yHKr/C",
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

export default AddCommunityMemberDialog;
