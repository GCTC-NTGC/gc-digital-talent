import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import { useMutation } from "urql";

import { Dialog, Button, Ul } from "@gc-digital-talent/ui";
import { Input } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import {
  Scalars,
  graphql,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";

interface FormValues {
  userId: Scalars["UUID"]["input"];
  name: string;
}

const DeleteUser_Mutation = graphql(/** GraphQL */ `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`);

const DeleteUserDialog_Fragment = graphql(/** GraphQL */ `
  fragment DeleteUserDialog on User {
    id
    firstName
    lastName
    deletedDate
  }
`);

interface DeleteUserDialogProps {
  query: FragmentType<typeof DeleteUserDialog_Fragment>;
}

const DeleteUserDialog = ({ query }: DeleteUserDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = getFragment(DeleteUserDialog_Fragment, query);
  const [{ fetching }, executeMutation] = useMutation(DeleteUser_Mutation);
  const fullName = getFullNameLabel(user?.firstName, user?.lastName, intl);

  const methods = useForm<FormValues>({
    defaultValues: {
      userId: user?.id ?? "",
    },
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error deleting user.",
        id: "Em4r7U",
        description: "Error message when attempting to delete a user.",
      }),
    );
  };

  const handleSubmit = async (values: FormValues) => {
    if (fetching) return;

    await executeMutation({ id: values.userId ?? user?.id ?? "" })
      .then((res) => {
        if (res.error || !res.data?.deleteUser) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "User deleted successfully!",
            id: "l6wb1k",
            description: "Success message after deleting a user",
          }),
        );
        setIsOpen(false);
      })
      .catch(handleError);
  };

  const label = intl.formatMessage({
    defaultMessage: "Delete this user",
    id: "5jm/N7",
    description: "Label on the button to open the delete user dialog",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          color="error"
          mode="solid"
          icon={TrashIcon}
          disabled={!!user.deletedDate}
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
                "You are about to delete the following user from the platform",
              id: "V6h+Kn",
              description: "Lead in text for the delete user form.",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <Ul className="my-3">
            <li className="font-bold">{fullName}</li>
          </Ul>
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage: "Please write the user's full name to confirm",
              id: "DOQi5y",
              description: "Lead in text for the delete user form.",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-y-6">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label={intl.formatMessage({
                    defaultMessage: "User name:",
                    id: "+s+emq",
                    description:
                      "Label for the user name input in the delete user dialog",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                    validate: (value) =>
                      value === fullName ||
                      intl.formatMessage(
                        {
                          defaultMessage:
                            "Value must match the users full name: {name}",
                          id: "6mCorq",
                          description:
                            "Placeholder text for user name input in the delete user dialog",
                        },
                        { name: fullName },
                      ),
                  }}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Write name here",
                    id: "B164SZ",
                    description:
                      "Placeholder text for user name input in the delete user dialog",
                  })}
                />
              </div>
              <Dialog.Footer>
                <Button mode="solid" color="error" type="submit">
                  {fetching
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage({
                        defaultMessage: "Delete user",
                        id: "5l+q/p",
                        description: "Submit button in delete user dialog",
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

export default DeleteUserDialog;
