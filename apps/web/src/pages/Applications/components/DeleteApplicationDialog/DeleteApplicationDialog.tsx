import TrashIcon from "@heroicons/react/16/solid/TrashIcon";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useMutation } from "urql";

import { Button, Dialog, Ul } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  ApplicationStatus,
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

const DeleteApplication_Mutation = graphql(/** GraphQL */ `
  mutation DeleteApplication($id: ID!) {
    deleteApplication(id: $id) {
      id
    }
  }
`);

const DeleteApplicationDialog_Fragment = graphql(/** GraphQL */ `
  fragment DeleteApplicationDialog on PoolCandidate {
    id
    status {
      value
    }
  }
`);

interface DeleteApplicationDialogProps {
  query: FragmentType<typeof DeleteApplicationDialog_Fragment>;
}

const DeleteApplicationDialog = ({ query }: DeleteApplicationDialogProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const application = getFragment(DeleteApplicationDialog_Fragment, query);
  const [, executeMutation] = useMutation(DeleteApplication_Mutation);

  const title = intl.formatMessage({
    defaultMessage: "Delete application",
    id: "Vu6IUs",
    description: "Title for deleting an application",
  });

  const handleDelete = () => {
    // NOTE: Only drafts can be deleted
    if (application.status?.value !== ApplicationStatus.Draft) {
      toast.error(
        intl.formatMessage({
          defaultMessage:
            "You cannot delete an application that as already been submitted.",
          id: "MwDik0",
          description:
            "Message displayed when a user attempts to delete a submitted application",
        }),
      );

      return;
    }

    executeMutation({ id: application.id })
      .then(async (res) => {
        if (!res?.data?.deleteApplication || res?.error) {
          throw new Error();
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Application deleted successfully.",
            id: "vZuWGT",
            description: "Message displayed after deleting an application",
          }),
        );

        await navigate(paths.applicantDashboard());
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed to delete application.",
            id: "uOrm+o",
            description:
              "Message displayed when an application could no be deleted",
          }),
        );
      });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button mode="inline" color="error" icon={TrashIcon}>
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <Ul className="mb-6" space="md">
            <li>
              {intl.formatMessage({
                defaultMessage: "You will not be considered for this process.",
                id: "QTX+ki",
                description:
                  "Point one, what happens when an application is deleted",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "You will lose any answers to this process’ screening questions.",
                id: "3XF+VC",
                description:
                  "Point two, what happens when an application is deleted",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "Changes to your preferences, career experience and skills are saved to your profile.",
                id: "MIMrQK",
                description:
                  "Point three, what happens when an application is deleted",
              })}
            </li>
          </Ul>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Are you sure you want to delete this application?",
              id: "NcRgcV",
              description:
                "Question confirming the user actually wants to delete an application",
            })}
          </p>
          <Dialog.Footer>
            <Button color="error" onClick={handleDelete}>
              {title}
            </Button>
            <Dialog.Close>
              <Button mode="inline" color="warning">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteApplicationDialog;
