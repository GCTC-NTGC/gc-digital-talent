import { useState } from "react";
import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";

import { AlertDialog, Button, Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Scalars } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

interface ActionProps {
  show: boolean;
  title: string;
}

interface ContinueActionProps extends ActionProps {
  id: Scalars["UUID"]["output"];
}

const ContinueAction = ({ show, title, id }: ContinueActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  if (!show) {
    return null;
  }

  return (
    <div data-h2-margin="l-tablet(0, 0, 0, auto)">
      <Link
        mode="inline"
        fontSize="caption"
        color="black"
        href={paths.application(id)}
      >
        {intl.formatMessage(
          {
            defaultMessage: "Continue this application<hidden> {name}</hidden>",
            id: "51B5l9",
            description: "Link text to continue a specific application",
          },
          {
            name: title,
          },
        )}
      </Link>
    </div>
  );
};
interface ViewActionProps extends ActionProps {
  id: Scalars["UUID"]["output"];
}

const ViewAction = ({ show, id, title }: ViewActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  if (!show) {
    return null;
  }

  return (
    <Link
      href={paths.application(id)}
      mode="inline"
      fontSize="caption"
      color="black"
      aria-label={intl.formatMessage(
        {
          defaultMessage: "Review your application to the {title} job",
          id: "XhQ7Ky",
          description: "Link text to view a specific application",
        },
        {
          title,
        },
      )}
    >
      {intl.formatMessage(
        {
          defaultMessage: "Review application<hidden> {name}</hidden>",
          id: "KZtBcM",
          description: "Link text to view a specific application",
        },
        {
          name: title,
        },
      )}
    </Link>
  );
};

interface SeeAdvertisementActionProps extends ActionProps {
  poolId: Scalars["UUID"]["output"];
}

const SeeAdvertisementAction = ({
  show,
  poolId,
  title,
}: SeeAdvertisementActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  if (!show) {
    return null;
  }

  return (
    <Link
      mode="inline"
      href={paths.pool(poolId)}
      color="black"
      fontSize="caption"
      aria-label={intl.formatMessage(
        {
          defaultMessage: "Review the {title} job advertisement",
          id: "5pTphq",
          description: "Link text to see an applications advertisement",
        },
        {
          title,
        },
      )}
    >
      {intl.formatMessage(
        {
          defaultMessage: "Review job ad<hidden> {name}</hidden>",
          id: "HhuKq4",
          description: "Link text to see an applications advertisement",
        },
        {
          name: title,
        },
      )}
    </Link>
  );
};

interface CopyApplicationIdActionProps extends ActionProps {
  id: Scalars["UUID"]["output"];
}

const CopyApplicationIdAction = ({
  show,
  title,
  id,
}: CopyApplicationIdActionProps) => {
  const intl = useIntl();
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  if (!show) {
    return null;
  }
  return (
    <Button
      mode="inline"
      color="black"
      fontSize="caption"
      data-h2-vertical-align="base(top)"
      icon={linkCopied ? CheckIcon : undefined}
      onClick={async () => {
        await navigator.clipboard.writeText(id);
        setLinkCopied(true);
      }}
      aria-label={
        linkCopied
          ? intl.formatMessage(
              {
                defaultMessage: "Copy your {title} application's ID",
                id: "WJSVBr",
                description: "Button text to copy a specific application ID",
              },
              {
                title,
              },
            )
          : intl.formatMessage(
              {
                defaultMessage: "Your {title} application's ID copied",
                id: "ftg8sT",
                description:
                  "Button text to indicate that a specific application's ID has been copied",
              },
              {
                title,
              },
            )
      }
    >
      {linkCopied
        ? intl.formatMessage({
            defaultMessage: "Application ID copied",
            id: "gBAz/G",
            description:
              "Button text to indicate that a specific application's ID has been copied",
          })
        : intl.formatMessage({
            defaultMessage: "Copy application ID",
            id: "rvoNoQ",
            description: "Button text to copy a specific application ID",
          })}
    </Button>
  );
};

interface DeleteActionProps extends ActionProps {
  onDelete: () => void;
}

const DeleteAction = ({ show, title, onDelete }: DeleteActionProps) => {
  const intl = useIntl();

  if (!show) {
    return null;
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button
          mode="inline"
          type="button"
          color="error"
          fontSize="caption"
          aria-label={intl.formatMessage(
            {
              defaultMessage: "Delete your application to the {title} job",
              id: "5O4CY1",
              description: "Link text to delete a specific application",
            },
            {
              title,
            },
          )}
        >
          {intl.formatMessage(
            {
              defaultMessage: "Delete application<hidden> ({name})</hidden>",
              id: "CH6FQA",
              description: "Link text to delete a specific application",
            },
            {
              name: title,
            },
          )}
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>
          {intl.formatMessage({
            defaultMessage: "Delete Application",
            id: "FFD16/",
            description:
              "Title for the modal that appears when a user attempts to delete an application",
          })}
        </AlertDialog.Title>
        <AlertDialog.Description>
          {intl.formatMessage(
            {
              defaultMessage:
                "Are you sure you would like to delete application {name}?",
              id: "5pZFQ3",
              description:
                "Question displayed when user attempts to delete an application",
            },
            { name: title },
          )}
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button color="primary" type="button">
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button mode="solid" color="error" type="button" onClick={onDelete}>
              {intl.formatMessage(commonMessages.delete)}
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default {
  ContinueAction,
  SeeAdvertisementAction,
  DeleteAction,
  ViewAction,
  CopyApplicationIdAction,
};
