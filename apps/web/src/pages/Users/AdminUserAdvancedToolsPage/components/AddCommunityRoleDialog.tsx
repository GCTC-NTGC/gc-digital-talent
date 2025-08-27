import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useIntl } from "react-intl";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { useQuery } from "urql";

import { Dialog, Button, Ul } from "@gc-digital-talent/ui";
import { Combobox, Select } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";
import { COMMUNITY_ROLES, RoleName } from "@gc-digital-talent/auth";

import { getFullNameHtml } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";

import {
  getRoleTableFragments,
  isCommunityTeamable,
  RoleTableProps,
  useUpdateRolesMutation,
} from "../utils";
import RolesAndPermissionsPageMessage from "~/components/RolesAndPermissionsPageMessage/RolesAndPermissionsPageMessage";

const AddCommunityRoleCommunities_Query = graphql(/* GraphQL */ `
  query AddCommunityRoleCommunities {
    communities {
      id
      name {
        localized
      }
      teamIdForRoleAssignment
    }
  }
`);

interface FormValues {
  roles: string[];
  community: string | null;
}

const AddCommunityRoleDialog = ({ query, optionsQuery }: RoleTableProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, options } = getRoleTableFragments({ query, optionsQuery });
  const { updateRoles, methods, fetching } =
    useUpdateRolesMutation<FormValues>();
  const [{ data }] = useQuery({
    query: AddCommunityRoleCommunities_Query,
  });
  if (!user) return null;
  const userName = getFullNameHtml(user?.firstName, user?.lastName, intl);

  const handleSubmit = async (formValues: FormValues) => {
    let { roles } = formValues;
    // despite the typing, roles is just a string may be complicated by there being only one team based role available
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    const roleInputArray = roles.map((role) => {
      return { roleId: role, teamId: formValues.community };
    });

    await updateRoles({
      userId: user.id,
      roleAssignmentsInput: { attach: roleInputArray },
    }).then(() => setIsOpen(false));
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
  const selectedCommunity = methods.watch("community");

  const currentRoles = unpackMaybes(
    user.authInfo?.roleAssignments
      ?.filter(
        (assignment) =>
          isCommunityTeamable(assignment?.teamable) &&
          assignment?.teamable?.teamIdForRoleAssignment === selectedCommunity,
      )
      .flatMap((assignment) => assignment?.role?.id),
  );

  const communityRoles = options.filter(
    (role) =>
      role.isTeamBased && COMMUNITY_ROLES.includes(role.name as RoleName),
  );

  const roleOptions = communityRoles
    .filter((role) => !currentRoles.includes(role.id))
    .map((role) => ({
      label:
        role.displayName?.localized ??
        intl.formatMessage(commonMessages.notAvailable),
      value: role.id,
    }));

  const communityOptions = unpackMaybes(data?.communities)
    .filter(
      (community) =>
        !!community?.teamIdForRoleAssignment && community.name?.localized,
    )
    .map((community) => ({
      label: community?.name?.localized,
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
          <RolesAndPermissionsPageMessage />
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
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
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
                <Button
                  mode="solid"
                  color="primary"
                  type="submit"
                  disabled={fetching}
                >
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

export default AddCommunityRoleDialog;
