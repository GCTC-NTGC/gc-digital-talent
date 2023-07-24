import React from "react";
import { useIntl } from "react-intl";

import { AlertDialog, Button, Link } from "@gc-digital-talent/ui";

import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";

import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import { PAGE_SECTION_ID } from "~/pages/Profile/CareerTimelineAndRecruitmentPage/constants";
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
  const { pool } = application;

  if (!show) {
    return null;
  }

  return (
    <div data-h2-margin="l-tablet(0, 0, 0, auto)">
      <Link mode="inline" href={paths.application(application.id)}>
        {intl.formatMessage(
          {
            defaultMessage: "Continue this application<hidden> {name}</hidden>",
            id: "51B5l9",
            description: "Link text to continue a specific application",
          },
          {
            name: getFullPoolTitleHtml(intl, pool),
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
  const { pool } = application;
  const title = getFullPoolTitleHtml(intl, pool) && "";
  if (!show) {
    return null;
  }

  return (
    <Link
      href={paths.application(application.id)}
      mode="inline"
      data-h2-font-size="base(caption)"
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
      data-h2-color="base(black.light)"
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

export interface SeeAdvertisementActionProps extends ActionProps {
  advertisement: Application["pool"];
}

const SeeAdvertisementAction = ({
  show,
  advertisement,
}: SeeAdvertisementActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const jobTitle = getFullPoolTitleHtml(intl, advertisement) && "";

  if (!show || !advertisement) {
    return null;
  }

  return (
    <Link
      mode="inline"
      href={paths.pool(advertisement.id)}
      data-h2-color="base(black.light)"
      data-h2-font-size="base(caption)"
      aria-label={intl.formatMessage(
        {
          defaultMessage: "Review the {title} job advertisement",
          id: "5pTphq",
          description: "Link text to see an applications advertisement",
        },
        {
          title: jobTitle,
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
          name: jobTitle,
        },
      )}
    </Link>
  );
};
export interface SupportActionProps extends ActionProps {
  application: Application;
}

const SupportAction = ({ show, application }: SupportActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const jobTitle = getFullPoolTitleHtml(intl, application.pool) && "";
  if (!show) {
    return null;
  }

  return (
    <Link
      href={paths.support()}
      mode="inline"
      data-h2-color="base(black.light)"
      data-h2-font-size="base(caption)"
      aria-label={intl.formatMessage(
        {
          defaultMessage: "Get support for the {title} job",
          id: "yE/QNS",
          description: "Link text to direct a user to the support page",
        },
        {
          title: jobTitle,
        },
      )}
    >
      {intl.formatMessage({
        defaultMessage: "Get support",
        id: "rXdaZW",
        description: "Link text to direct a user to the support page",
      })}
    </Link>
  );
};

export interface CopyApplicationIdActionProps extends ActionProps {
  application: Application;
}
const CopyApplicationIdAction = ({
  show,
  application,
}: CopyApplicationIdActionProps) => {
  const intl = useIntl();
  const [linkCopied, setLinkCopied] = React.useState<boolean>(false);
  if (!show) {
    return null;
  }
  const jobTitle = getFullPoolTitleHtml(intl, application.pool) && "";
  return (
    <Button
      mode="inline"
      data-h2-color="base(black.light)"
      data-h2-font-size="base(caption)"
      icon={linkCopied ? CheckIcon : undefined}
      onClick={() => {
        navigator.clipboard.writeText(application.id);
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
                title: jobTitle,
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
                title: jobTitle,
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
export interface VisitCareerTimelineActionProps extends ActionProps {
  userID: string;
  application: Application;
}
const VisitCareerTimelineAction = ({
  show,
  userID,
  application,
}: VisitCareerTimelineActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const jobTitle = getFullPoolTitleHtml(intl, application.pool) && "";

  if (!show) {
    return null;
  }

  const recruitmentSectionUrl = paths.careerTimelineAndRecruitment(userID, {
    applicationId: application.id,
    section: PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES,
  });

  return (
    <Link
      href={recruitmentSectionUrl}
      mode="inline"
      data-h2-color="base(black.light)"
      data-h2-font-size="base(caption)"
      aria-label={intl.formatMessage(
        {
          defaultMessage: "Manage the {title} recruitment",
          id: "utl6O/",
          description:
            "Link text to direct a user to the recruitment section on the career timeline page",
        },
        {
          title: jobTitle,
        },
      )}
    >
      {intl.formatMessage({
        defaultMessage: "Manage recruitment",
        id: "GZXf3A",
        description:
          "Link text to direct a user to the recruitment section on the career timeline page",
      })}
    </Link>
  );
};

export interface ManageAvailabilityActionProps extends ActionProps {
  userID: string;
  application: Application;
}
const ManageAvailabilityAction = ({
  show,
  userID,
  application,
}: ManageAvailabilityActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const jobTitle = getFullPoolTitleHtml(intl, application.pool) && "";

  if (!show) {
    return null;
  }

  return (
    <Link
      href={paths.profile(userID)}
      mode="inline"
      data-h2-color="base(black.light)"
      data-h2-font-size="base(caption)"
      aria-label={intl.formatMessage(
        {
          defaultMessage:
            "Manage your availability for the {title} recruitment",
          id: "3QkRNc",
          description:
            "Link text to direct a user to change the availability of the specific recruitment process",
        },
        {
          title: jobTitle,
        },
      )}
    >
      {intl.formatMessage({
        defaultMessage: "Manage availability",
        id: "SjhNGq",
        description:
          "Link text to direct a user to change the availability of the specific recruitment process",
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

  const name = getFullPoolTitleHtml(intl, application.pool) && "";
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button
          mode="inline"
          type="button"
          data-h2-color="base(error.dark)"
          data-h2-font-size="base(caption)"
          aria-label={intl.formatMessage(
            {
              defaultMessage: "Delete your application to the {title} job",
              id: "5O4CY1",
              description: "Link text to delete a specific application",
            },
            {
              title: name,
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
            <Button color="primary" type="button">
              {intl.formatMessage({
                defaultMessage: "Cancel",
                id: "/JLaO5",
                description: "Link text to cancel deleting application.",
              })}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button mode="solid" color="error" type="button" onClick={onDelete}>
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

  const name = getFullPoolTitleHtml(intl, application.pool);

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button mode="inline" type="button" color="secondary">
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
            <Button color="primary" type="button">
              {intl.formatMessage({
                defaultMessage: "Cancel",
                id: "r6DZ71",
                description: "Link text to cancel archiving application.",
              })}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              mode="solid"
              color="secondary"
              type="button"
              onClick={onArchive}
            >
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
  CopyApplicationIdAction,
  VisitCareerTimelineAction,
  ManageAvailabilityAction,
};
