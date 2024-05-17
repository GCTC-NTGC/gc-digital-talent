import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import debounce from "lodash/debounce";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { useMutation } from "urql";

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
import { TeamMembersPage_TeamFragment as TeamMembersPageTeamFragmentType } from "@gc-digital-talent/graphql";

import { getFullNameAndEmailLabel } from "~/utils/nameUtils";
import { TeamMember } from "~/utils/teamUtils";
import adminMessages from "~/messages/adminMessages";

import { TeamMemberFormValues } from "./types";
import { getTeamBasedRoleOptions } from "./utils";
import useAvailableUsers from "./useAvailableUsers";
import useAvailableRoles from "./useAvailableRoles";
import { UpdateUserTeamRoles_Mutation } from "./operations";

interface AddTeamMemberDialogProps {
  team: TeamMembersPageTeamFragmentType;
  members: Array<TeamMember>;
}

const AddTeamMemberDialog = ({
  team,
  members,
}: // onSave,
AddTeamMemberDialogProps) => {
  const intl = useIntl();
  const [query, setQuery] = useState<string>("");
  const {
    users,
    total,
    fetching: usersFetching,
  } = useAvailableUsers(members, {
    publicProfileSearch: query || undefined,
  });
  const { roles, fetching: rolesFetching } = useAvailableRoles();
  const [, executeMutation] = useMutation(UpdateUserTeamRoles_Mutation);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const methods = useForm<TeamMemberFormValues>({
    defaultValues: {
      userId: "",
      teamId: team.id,
      teamDisplay: team.id, // This form field will be disabled and only used for display purposes.
      roles: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSave = async (formValues: TeamMemberFormValues) => {
    await executeMutation({
      teamRoleAssignments: {
        userId: formValues.userId,
        teamId: formValues.teamId,
        roleAssignments: {
          attach: {
            roles: formValues.roles,
          },
        },
      },
    })
      .then((res) => {
        if (!res.error) {
          setIsOpen(false);
          toast.success(
            intl.formatMessage({
              defaultMessage: "Member added successfully",
              id: "AKQeBC",
              description:
                "Alert displayed to user when a team member's roles have been updated",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Member role update failed",
            id: "Ly2bBb",
            description:
              "Alert displayed to user when an error occurs while editing a team member's roles",
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
    defaultMessage: "Add new member",
    id: "+e2nr6",
    description: "Label for the add member to team form",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="primary" icon={PlusIcon}>
          {label}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                "Search for a new member from the list of approved managers.",
              id: "Mz61q/",
              description:
                "Help text for user field on the add member to team form",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                className="flex"
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
                    defaultMessage: "Manager name",
                    id: "1BEtoY",
                    description:
                      "Label for the user select field on team membership form",
                  })}
                  options={userOptions ?? []}
                />
                {/** Note: Only one option since we are adding to this team's users */}
                <input type="hidden" name="teamId" value={team.id} />
                <Select
                  id="teamDisplay"
                  name="teamDisplay"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  disabled
                  label={intl.formatMessage(adminMessages.team)}
                  options={[
                    {
                      value: team.id,
                      label: getLocalizedName(team.displayName, intl),
                    },
                  ]}
                />
                <Combobox
                  id="roles"
                  name="roles"
                  isMulti
                  fetching={rolesFetching}
                  label={intl.formatMessage({
                    defaultMessage: "Membership roles",
                    id: "cOJVBW",
                    description:
                      "Label for the input to add roles to a user's team membership",
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

export default AddTeamMemberDialog;
