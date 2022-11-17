import React from "react";
import { useIntl } from "react-intl";

import { Button, Link } from "@common/components";
import AlertDialog from "@common/components/AlertDialog";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";

import { useDirectIntakeRoutes } from "../../../directIntakeRoutes";

import type { Application } from "./ApplicationCard";

export interface ActionProps {
  show: boolean;
}

export interface ContinueActionProps extends ActionProps {
  application: Application;
}

const ContinueAction = ({ show, application }: ContinueActionProps) => {
  const intl = useIntl();
  const paths = useDirectIntakeRoutes();
  const { poolAdvertisement } = application;

  if (!show) {
    return null;
  }

  return (
    <Link href={paths.reviewApplication(application.id)}>
      {intl.formatMessage(
        {
          defaultMessage: "Continue my application<hidden> {name}</hidden>",
          id: "60Ee78",
          description: "Link text to continue a specific application",
        },
        {
          name: getFullPoolAdvertisementTitle(intl, poolAdvertisement),
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
  const paths = useDirectIntakeRoutes();

  if (!show || !advertisement) {
    return null;
  }

  return (
    <Link href={paths.pool(advertisement.id)}>
      {intl.formatMessage(
        {
          defaultMessage: "See advertisement<hidden> {name}</hidden>",
          id: "HXNJ6Z",
          description: "Link text to see an applications advertisement",
        },
        {
          name: getFullPoolAdvertisementTitle(intl, advertisement),
        },
      )}
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

  const name = getFullPoolAdvertisementTitle(
    intl,
    application.poolAdvertisement,
  );
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button mode="inline" color="black">
          {intl.formatMessage(
            {
              defaultMessage: "Delete<hidden> application {name}</hidden>",
              id: "1lmME7",
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
          <p>
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
          </p>
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

  const name = getFullPoolAdvertisementTitle(
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
          <p>
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
          </p>
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
};
