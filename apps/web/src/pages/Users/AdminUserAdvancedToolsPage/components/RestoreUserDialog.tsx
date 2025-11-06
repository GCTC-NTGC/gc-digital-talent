import { useState } from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import { useMutation } from "urql";

import { Dialog, Button, Ul } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { graphql, FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import { getFullNameLabel } from "~/utils/nameUtils";

const RestoreUser_Mutation = graphql(/** GraphQL */ `
  mutation RestoreUser($id: ID!) {
    restoreUser(id: $id) {
      id
    }
  }
`);

const RestoreUserDialog_Fragment = graphql(/** GraphQL */ `
  fragment RestoreUserDialog on User {
    id
    firstName
    lastName
    deletedDate
  }
`);

interface RestoreUserDialogProps {
  query: FragmentType<typeof RestoreUserDialog_Fragment>;
}

const RestoreUserDialog = ({ query }: RestoreUserDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = getFragment(RestoreUserDialog_Fragment, query);
  const [{ fetching }, executeMutation] = useMutation(RestoreUser_Mutation);
  const fullName = getFullNameLabel(user?.firstName, user?.lastName, intl);

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error restoring user.",
        id: "sn+r8z",
        description:
          "Error message when attempting to restore a soft-deleted user.",
      }),
    );
  };

  const handleSubmit = async () => {
    if (fetching) return;

    await executeMutation({ id: user?.id ?? "" })
      .then((res) => {
        if (res.error || !res.data?.restoreUser) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "User restored successfully!",
            id: "bqS+15",
            description: "Success message after restoring a soft-deleted user",
          }),
        );
        setIsOpen(false);
      })
      .catch(handleError);
  };

  const label = intl.formatMessage({
    defaultMessage: "Restore user",
    id: "CzZm8F",
    description: "Label for restoring a user",
  });

  const deletedDate = user.deletedDate
    ? formatDate({
        date: parseDateTimeUtc(user.deletedDate),
        formatString: "yyyy-MM-dd",
        intl,
      })
    : intl.formatMessage(commonMessages.notAvailable);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          color="warning"
          mode="solid"
          icon={TrashIcon}
          disabled={!user.deletedDate}
        >
          {label}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You are about to restore the following user from the platform",
              id: "W8SKx+",
              description: "Lead in text for the restore user form.",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <Ul className="my-3">
            <li className="font-bold">{fullName}</li>
          </Ul>
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage: "This user was archived on",
              id: "j5IepM",
              description:
                "Description of the form to restore a soft-deleted user",
            }) +
              intl.formatMessage(commonMessages.dividingColon) +
              deletedDate}
          </p>
          <Dialog.Footer>
            <Button mode="solid" color="warning" onClick={handleSubmit}>
              {fetching ? intl.formatMessage(commonMessages.saving) : label}
            </Button>
            <Dialog.Close>
              <Button color="warning" mode="inline">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RestoreUserDialog;
