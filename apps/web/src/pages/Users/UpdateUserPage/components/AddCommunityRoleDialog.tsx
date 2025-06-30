import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { useQuery } from "urql";

import { Dialog, Button, Ul } from "@gc-digital-talent/ui";
import { Combobox, Select } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
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
  graphql,
  RoleInput,
} from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";

import { UpdateUserDataAuthInfoType } from "../UpdateUserPage";
import { isCommunityTeamable } from "./helpers";

const AddCommunityRoleCommunities_Query = graphql(/* GraphQL */ `
  query AddCommunityRoleCommunities {
    communities {
      id
      name {
        en
        fr
      }
      teamIdForRoleAssignment
    }
  }
`);

interface FormValues {
  roles: string[];
  community: string | null;
}

interface AddCommunityRoleDialogProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
  authInfo: UpdateUserDataAuthInfoType;
  communityRoles: Role[];
  onAddRoles: (
    submitData: UpdateUserRolesInput,
  ) => Promise<UpdateUserRolesMutation["updateUserRoles"]>;
}

const AddCommunityRoleDialog = ({
  user,
  authInfo,
  communityRoles,
  onAddRoles,
}: AddCommunityRoleDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id, firstName, lastName } = user;
  const userName = getFullNameHtml(firstName, lastName, intl);

  const methods = useForm<FormValues>({
    defaultValues: {
      roles: [],
      community: null,
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const handleAddRoles = async (formValues: FormValues) => {
    let { roles } = formValues;
    // despite the typing, roles is just a string may be complicated by there being only one team based role available
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    const roleInputArray: RoleInput[] = roles.map((role) => {
      return { roleId: role, teamId: formValues.community };
    });

    return onAddRoles({
      userId: id,
      roleAssignmentsInput: {
        attach: roleInputArray,
      },
    }).then(() => {
      setIsOpen(false);
      toast.success(intl.formatMessage(adminMessages.rolesAdded));
    });
  };

  const dialogLabel = intl.formatMessage({
    defaultMessage: "Add community role",
    id: "WovyCU",
    description: "Header for the form to add a community membership to a user",
  });

  const buttonLabel = intl.formatMessage({
    defaultMessage: "Add community role",
    id: "yzvT6g",
    description:
      "Button label for the form to add a community membership to a user",
  });

  // if a community is selected, eliminate existing roles from the dropdown
  const selectedCommunity = watch("community");
  const alreadyUsedRoleIds =
    authInfo?.roleAssignments
      ?.filter(
        (roleAssignment) =>
          isCommunityTeamable(roleAssignment?.teamable) &&
          roleAssignment?.teamable.teamIdForRoleAssignment ===
            selectedCommunity,
      )
      .map((roleAssignment) => roleAssignment?.role?.id)
      .filter(notEmpty) ?? [];
  const roleOptions = communityRoles
    .filter((role) => !alreadyUsedRoleIds.includes(role.id))
    .map((role) => ({
      label: getLocalizedName(role.displayName, intl),
      value: role.id,
    }));

  const [{ data: communityData }] = useQuery({
    query: AddCommunityRoleCommunities_Query,
  });

  const communityOptions = communityData?.communities
    .filter(notEmpty)
    .filter((community) => !!community?.teamIdForRoleAssignment)
    .map((community) => ({
      label: getLocalizedName(community.name, intl),
      value: community.teamIdForRoleAssignment ?? "", // should never be empty, just satisfies type
    }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="primary" mode="solid" icon={PlusIcon}>
          {buttonLabel}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{dialogLabel}</Dialog.Header>
        <Dialog.Body>
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage:
                "You are about to add roles for the following member:",
              id: "0cevfA",
              description: "Lead in text for the add role to user form.",
            })}
          </p>
          <Ul>
            <li className="font-bold">
              <span>{userName}</span>
            </li>
          </Ul>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage: "Select the community and roles you want to add",
              id: "58l6yP",
              description:
                "Lead in text for the pick community and roles inputs.",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddRoles)}>
              <div className="flex flex-col gap-y-6">
                <Select
                  id="community"
                  name="community"
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select community",
                    id: "OTWd3v",
                    description:
                      "Placeholder text for community selection input",
                  })}
                  label={intl.formatMessage(adminMessages.community)}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  options={communityOptions ?? []}
                />
                <Combobox
                  id="roles"
                  name="roles"
                  isMulti
                  label={intl.formatMessage({
                    defaultMessage: "Community roles",
                    id: "6UiKYE",
                    description:
                      "Label for the input to select role of a community role",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Select role",
                    id: "mTsq+x",
                    description: "Placeholder text for role selection input",
                  })}
                  options={roleOptions}
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
                  color="primary"
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

export default AddCommunityRoleDialog;
