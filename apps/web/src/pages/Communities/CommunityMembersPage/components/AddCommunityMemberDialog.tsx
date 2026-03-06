import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import debounce from "lodash/debounce";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import { useMutation } from "urql";
import { useOutletContext } from "react-router";

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
  CommunityMembersPage_CommunityFragment as CommunityMembersPageCommunityFragmentType,
} from "@gc-digital-talent/graphql";

import RolesAndPermissionsPageMessage from "~/components/RolesAndPermissionsPageMessage/RolesAndPermissionsPageMessage";

import { CommunityMemberFormValues, ContextType } from "./types";
import { getTeamBasedRoleOptions } from "./utils";
import useAvailableUsers from "./useAvailableUsers";
import useAvailableRoles from "./useAvailableRoles";
import { UpdateUserCommunityRoles_Mutation } from "./operations";

interface AddCommunityMemberDialogProps {
  community: CommunityMembersPageCommunityFragmentType;
}

const AddCommunityMemberDialog = ({
  community,
}: AddCommunityMemberDialogProps) => {
  const intl = useIntl();
  const [query, setQuery] = useState<string>("");
  const { users, fetching: usersFetching } = useAvailableUsers(query);

  const { teamId } = useOutletContext<ContextType>();
  const { roles, fetching: rolesFetching } = useAvailableRoles();
  const [, executeMutation] = useMutation(UpdateUserCommunityRoles_Mutation);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const methods = useForm<CommunityMemberFormValues>({
    defaultValues: {
      userId: "",
      communityId: community.id,
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
              id: "KESOSJ",
              description:
                "Alert displayed to user when a community member was added to a community",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Member addition failed",
            id: "BbI16K",
            description:
              "Alert displayed to user when a community member was not added to a community",
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
    label: user.workEmail ?? user.id,
  }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="primary" icon={PlusCircleIcon}>
          {intl.formatMessage({
            defaultMessage: "Add member",
            id: "MkUz+j",
            description: "Label for the add member to community form (action)",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage:
                "Select the user you would like to add to {teamName} along with their roles.",
              id: "fuGqZQ",
              description: "Subtitle for the add member to team form",
            },
            {
              teamName: getLocalizedName(community.name, intl),
            },
          )}
        >
          {intl.formatMessage({
            defaultMessage: "Add member",
            id: "IHyNL8",
            description: "Title for the add member to community form",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <RolesAndPermissionsPageMessage />
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div className="flex flex-col gap-y-6">
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Only users with verified employee emails can be added to this community.",
                    id: "FnvqtK",
                    description:
                      "Warning that only verified work emails can be selected",
                  })}
                </p>
                <Combobox
                  id="userId"
                  name="userId"
                  fetching={usersFetching}
                  isExternalSearch
                  onSearch={handleDebouncedSearch}
                  total={users.length}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  label={intl.formatMessage({
                    defaultMessage: "Verified employee email",
                    id: "dRH0kc",
                    description: "A label for a verified work email",
                  })}
                  options={userOptions ?? []}
                />
                <input type="hidden" name="communityId" value={community.id} />
                <Combobox
                  id="roles"
                  name="roles"
                  isMulti
                  fetching={rolesFetching}
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
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage({
                        defaultMessage: "Save and add member",
                        id: "mKrj0x",
                        description: "Label for add member to a community form",
                      })}
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
