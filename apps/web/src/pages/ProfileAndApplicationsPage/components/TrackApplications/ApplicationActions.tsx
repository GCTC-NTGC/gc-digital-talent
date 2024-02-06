import React from "react";
import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";

import { AlertDialog, Button, Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { PoolCandidate } from "~/api/generated";
import { getFullPoolTitleHtml, getFullPoolTitleLabel } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";
import { PAGE_SECTION_ID } from "~/pages/Profile/CareerTimelineAndRecruitmentPage/constants";

type Application = Omit<PoolCandidate, "user">;

interface ActionProps {
  show: boolean;
}

interface ContinueActionProps extends ActionProps {
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
      <Link
        mode="inline"
        fontSize="caption"
        color="black"
        href={paths.application(application.id)}
      >
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
interface ViewActionProps extends ActionProps {
  application: Application;
}

const ViewAction = ({ show, application }: ViewActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { pool } = application;
  const title = getFullPoolTitleLabel(intl, pool);
  if (!show) {
    return null;
  }

  return (
    <Link
      href={paths.application(application.id)}
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
  advertisement: Application["pool"];
}

const SeeAdvertisementAction = ({
  show,
  advertisement,
}: SeeAdvertisementActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const jobTitle = getFullPoolTitleLabel(intl, advertisement);

  if (!show || !advertisement) {
    return null;
  }

  return (
    <Link
      mode="inline"
      href={paths.pool(advertisement.id)}
      color="black"
      fontSize="caption"
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
interface SupportActionProps extends ActionProps {
  application: Application;
}

const SupportAction = ({ show, application }: SupportActionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const jobTitle = getFullPoolTitleLabel(intl, application.pool);
  if (!show) {
    return null;
  }

  return (
    <Link
      href={paths.support()}
      state={{ referrer: window.location.href }}
      mode="inline"
      color="black"
      fontSize="caption"
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

interface CopyApplicationIdActionProps extends ActionProps {
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
  const jobTitle = getFullPoolTitleLabel(intl, application.pool);
  return (
    <Button
      mode="inline"
      color="black"
      fontSize="caption"
      data-h2-vertical-align="base(top)"
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
interface VisitCareerTimelineActionProps extends ActionProps {
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
  const jobTitle = getFullPoolTitleLabel(intl, application.pool);

  if (!show) {
    return null;
  }

  const recruitmentSectionUrl = paths.careerTimelineAndRecruitment(userID, {
    section: PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES,
  });

  return (
    <Link
      href={recruitmentSectionUrl}
      mode="inline"
      color="black"
      fontSize="caption"
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

export interface DeleteActionProps extends ActionProps {
  application: Application;
  onDelete: () => void;
}

const DeleteAction = ({ show, application, onDelete }: DeleteActionProps) => {
  const intl = useIntl();

  if (!show) {
    return null;
  }

  const name = getFullPoolTitleLabel(intl, application.pool);
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
              {intl.formatMessage(commonMessages.cancel)}
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

export default {
  ContinueAction,
  SeeAdvertisementAction,
  DeleteAction,
  SupportAction,
  ViewAction,
  CopyApplicationIdAction,
  VisitCareerTimelineAction,
};
