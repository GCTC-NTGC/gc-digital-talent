import React from "react";
import { useIntl } from "react-intl";

import { AlertDialog, Button, Link } from "@gc-digital-talent/ui";

import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";

import type { Application } from "./ApplicationCard";

export interface ActionProps {
  show: boolean;
}

export interface ContinueActionProps extends ActionProps {
  application: Application;
}

const ContinueAction = ({ show, application }: ContinueActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { poolAdvertisement } = application;

  if (!show) {
    return null;
  }

  return (
    <div data-h2-margin="base(0, 0, 0, auto)">
      <Link
        type="button"
        mode="solid"
        color="blue"
        href={paths.reviewApplication(application.id)}
      >
        {intl.formatMessage(
          {
            defaultMessage: "Continue this application<hidden> {name}</hidden>",
            id: "51B5l9",
            description: "Link text to continue a specific application",
          },
          {
            name: getFullPoolAdvertisementTitleHtml(intl, poolAdvertisement),
          },
        )}
      </Link>
    </div>
  );
};
export interface ViewActionProps extends ActionProps {
  application: Application;
}

const ViewAction = ({ show, application }: ViewActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { poolAdvertisement } = application;

  if (!show) {
    return null;
  }

  return (
    <Link
      href={paths.reviewApplication(application.id)}
      data-h2-font-weight="base(700)"
      data-h2-color="base(tm-blue.dark)"
    >
      {intl.formatMessage(
        {
          defaultMessage: "View this application<hidden> {name}</hidden>",
          id: "JM30M7",
          description: "Link text to view a specific application",
        },
        {
          name: getFullPoolAdvertisementTitleHtml(intl, poolAdvertisement),
        },
      )}
    </Link>
  );
};

export interface SeeAdvertisementActionProps extends ActionProps {
  advertisement: Application["poolAdvertisement"];
}

const SeeAdvertisementAction = ({
  show,
  advertisement,
}: SeeAdvertisementActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  if (!show || !advertisement) {
    return null;
  }

  return (
    <Link
      href={paths.pool(advertisement.id)}
      data-h2-font-weight="base(700)"
      data-h2-color="base(tm-blue.dark)"
    >
      {intl.formatMessage(
        {
          defaultMessage: "See job ad<hidden> {name}</hidden>",
          id: "si/wtm",
          description: "Link text to see an applications advertisement",
        },
        {
          name: getFullPoolAdvertisementTitleHtml(intl, advertisement),
        },
      )}
    </Link>
  );
};
export type SupportActionProps = ActionProps;

const SupportAction = ({ show }: SupportActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  if (!show) {
    return null;
  }

  return (
    <Link
      href={paths.support()}
      data-h2-font-weight="base(700)"
      data-h2-color="base(tm-blue.dark)"
    >
      {intl.formatMessage({
        defaultMessage: "Get support",
        id: "rXdaZW",
        description: "Link text to direct a user to the support page",
      })}
    </Link>
  );
};

export interface DeleteActionProps extends ActionProps {
  application: Application;
  onDelete: () => void;
}

const DeleteAction = ({ show, application, onDelete }: DeleteActionProps) => {
  const intl = useIntl();

  if (!show) {
    return null;
  }

  const name = getFullPoolAdvertisementTitleHtml(
    intl,
    application.poolAdvertisement,
  );
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button mode="inline" color="red">
          {intl.formatMessage(
            {
              defaultMessage:
                "Delete this application<hidden> ({name})</hidden>",
              id: "10Ous+",
              description: "Link text to delete a specific application",
            },
            {
              name,
            },
          )}
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>
          {intl.formatMessage(
            {
              defaultMessage: "Delete Application",
              id: "FFD16/",
              description:
                "Title for the modal that appears when a user attempts to delete an application",
            },
            { name },
          )}
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
            { name },
          )}
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button mode="outline" color="primary" type="button">
              {intl.formatMessage({
                defaultMessage: "Cancel",
                id: "/JLaO5",
                description: "Link text to cancel deleting application.",
              })}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button mode="solid" color="cta" type="button" onClick={onDelete}>
              {intl.formatMessage({
                defaultMessage: "Delete",
                id: "IUQGA0",
                description: "Link text to delete.",
              })}
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export interface ArchiveActionProps extends ActionProps {
  application: Application;
  onArchive: () => void;
}

const ArchiveAction = ({
  show,
  application,
  onArchive,
}: ArchiveActionProps) => {
  const intl = useIntl();

  if (!show) {
    return null;
  }

  const name = getFullPoolAdvertisementTitleHtml(
    intl,
    application.poolAdvertisement,
  );

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button mode="inline" color="black">
          {intl.formatMessage(
            {
              defaultMessage: "Archive<hidden> application {name}</hidden>",
              id: "6B7e8/",
              description: "Link text to continue a specific application",
            },
            {
              name,
            },
          )}
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>
          {intl.formatMessage({
            defaultMessage: "Archive Application",
            id: "yiJYdP",
            description:
              "Title for the modal that appears when a user attempts to archive an application",
          })}
        </AlertDialog.Title>
        <AlertDialog.Description>
          {intl.formatMessage(
            {
              defaultMessage:
                "Are you sure you would like to archive application {name}?",
              id: "Z0PCOW",
              description:
                "Question displayed when user attempts to archive an application",
            },
            { name },
          )}
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button mode="outline" color="primary" type="button">
              {intl.formatMessage({
                defaultMessage: "Cancel",
                id: "r6DZ71",
                description: "Link text to cancel archiving application.",
              })}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button mode="solid" color="cta" type="button" onClick={onArchive}>
              {intl.formatMessage({
                defaultMessage: "Archive",
                id: "PXfQOZ",
                description: "Link text to archive application.",
              })}
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
  ArchiveAction,
  SupportAction,
  ViewAction,
};
