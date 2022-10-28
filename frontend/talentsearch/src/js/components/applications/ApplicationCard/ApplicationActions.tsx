import React from "react";
import { useIntl } from "react-intl";

import { Button, Link } from "@common/components";
import AlertDialog from "@common/components/AlertDialog";
import { getLocale } from "@common/helpers/localize";
import { notEmpty } from "@common/helpers/util";

import { useDirectIntakeRoutes } from "../../../directIntakeRoutes";

import type { Application } from "./ApplicationCard";
import getFullPoolAdvertisementTitle from "../../pool/getFullPoolAdvertisementTitle";

export interface ActionProps {
  show: boolean;
}

export interface ContinueActionProps extends ActionProps {
  application: Application;
}

const ContinueAction = ({ show, application }: ContinueActionProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
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
          name: notEmpty(poolAdvertisement?.name)
            ? poolAdvertisement?.name[locale]
            : application.id,
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
  const locale = getLocale(intl);
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
          name: notEmpty(advertisement.name)
            ? advertisement.name[locale]
            : advertisement.id,
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
  const cancelRef = React.useRef(null);
  const [isOpen, setOpen] = React.useState<boolean>(false);

  const onDismiss = () => setOpen(false);

  if (!show) {
    return null;
  }

  const name = application.poolAdvertisement
    ? getFullPoolAdvertisementTitle(intl, application.poolAdvertisement)
    : "";

  return (
    <>
      <Button mode="inline" color="black" onClick={() => setOpen(true)}>
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
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onDismiss={onDismiss}
        title={intl.formatMessage(
          {
            defaultMessage: "Delete Application",
            id: "FFD16/",
            description:
              "Title for the modal that appears when a user attempts to delete an application",
          },
          { name },
        )}
      >
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
          <Button
            mode="outline"
            color="primary"
            type="button"
            ref={cancelRef}
            onClick={onDismiss}
          >
            {intl.formatMessage({
              defaultMessage: "Cancel",
              id: "/JLaO5",
              description: "Link text to cancel deleting application.",
            })}
          </Button>
          <span data-h2-margin="base(0, 0, 0, x.5)">
            <Button mode="solid" color="cta" type="button" onClick={onDelete}>
              {intl.formatMessage({
                defaultMessage: "Delete",
                id: "IUQGA0",
                description: "Link text to delete.",
              })}
            </Button>
          </span>
        </AlertDialog.Footer>
      </AlertDialog>
    </>
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
  const cancelRef = React.useRef(null);
  const [isOpen, setOpen] = React.useState<boolean>(false);

  const onDismiss = () => setOpen(false);

  if (!show) {
    return null;
  }

  const name = application.poolAdvertisement
    ? getFullPoolAdvertisementTitle(intl, application.poolAdvertisement)
    : "";

  return (
    <>
      <Button mode="inline" color="black" onClick={() => setOpen(true)}>
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
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onDismiss={onDismiss}
        title={intl.formatMessage({
          defaultMessage: "Archive Application",
          id: "yiJYdP",
          description:
            "Title for the modal that appears when a user attempts to archive an application",
        })}
      >
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
          <Button
            mode="outline"
            color="primary"
            type="button"
            ref={cancelRef}
            onClick={onDismiss}
          >
            {intl.formatMessage({
              defaultMessage: "Cancel",
              id: "r6DZ71",
              description: "Link text to cancel archiving application.",
            })}
          </Button>
          <span data-h2-margin="base(0, 0, 0, x.5)">
            <Button mode="solid" color="cta" type="button" onClick={onArchive}>
              {intl.formatMessage({
                defaultMessage: "Archive",
                id: "PXfQOZ",
                description: "Link text to archive application.",
              })}
            </Button>
          </span>
        </AlertDialog.Footer>
      </AlertDialog>
    </>
  );
};

export default {
  ContinueAction,
  SeeAdvertisementAction,
  DeleteAction,
  ArchiveAction,
};
