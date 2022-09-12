import React from "react";
import { useIntl } from "react-intl";

import { Button, Link } from "@common/components";
import AlertDialog from "@common/components/AlertDialog";
import { getLocale } from "@common/helpers/localize";
import { notEmpty } from "@common/helpers/util";
import { refresh } from "@common/helpers/router";

import { toast } from "react-toastify";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";

import type { Application } from "./ApplicationCard";
import {
  useArchiveApplicationMutation,
  useDeleteApplicationMutation,
} from "../../api/generated";
import getFullPoolAdvertisementTitle from "../pool/getFullPoolAdvertisementTitle";

interface ActionProps {
  show: boolean;
}

interface ContinueActionProps extends ActionProps {
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
    <Link href={paths.poolApply(application.id)}>
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

interface SeeAdvertisementActionProps extends ActionProps {
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
    <Link href={paths.poolAdvertisement(advertisement.id)}>
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

interface DeleteActionProps extends ActionProps {
  application: Application;
}

const DeleteAction = ({ show, application }: DeleteActionProps) => {
  const intl = useIntl();
  const cancelRef = React.useRef(null);
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [, executeMutation] = useDeleteApplicationMutation();

  const onDismiss = () => setOpen(false);

  const onDelete = () => {
    executeMutation({
      id: application.id,
    }).then((result) => {
      if (result.data?.deleteApplication) {
        refresh();
        toast.success(
          intl.formatMessage({
            defaultMessage: "Application deleted successfully!",
            id: "xdGPxT",
            description:
              "Message displayed to user after application is deleted successfully.",
          }),
        );
      } else {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: deleting application failed",
            id: "M3c9Yo",
            description:
              "Message displayed to user after application fails to get deleted.",
          }),
        );
      }
    });
  };

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

interface ArchiveActionProps extends ActionProps {
  application: Application;
}

const ArchiveAction = ({ show, application }: ArchiveActionProps) => {
  const intl = useIntl();
  const cancelRef = React.useRef(null);
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [, executeMutation] = useArchiveApplicationMutation();

  const onDismiss = () => setOpen(false);

  const onArchive = () => {
    executeMutation({
      id: application.id,
    }).then((result) => {
      if (result.data?.archiveApplication) {
        refresh();
        toast.success(
          intl.formatMessage({
            defaultMessage: "Application archived successfully!",
            id: "KEhCJX",
            description:
              "Message displayed to user after application is archived successfully.",
          }),
        );
      } else {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: archiving application failed",
            id: "i3IjQt",
            description:
              "Message displayed to user after application fails to get archived.",
          }),
        );
      }
    });
  };

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
