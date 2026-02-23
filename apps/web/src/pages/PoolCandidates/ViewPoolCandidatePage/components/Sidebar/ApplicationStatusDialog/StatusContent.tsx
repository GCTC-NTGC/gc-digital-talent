import { useIntl } from "react-intl";

import { Submit } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Button, ButtonProps, Dialog, Notice } from "@gc-digital-talent/ui";
import {
  ApplicationStatus,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import {
  DATE_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

export const StatusChangeNotice = () => {
  const intl = useIntl();

  return (
    <Notice.Root mode="inline" color="warning" small>
      <Notice.Title>
        {intl.formatMessage(commonMessages.important)}
      </Notice.Title>
      <Notice.Content>
        <p>{intl.formatMessage(formMessages.candidateNotify)}</p>
      </Notice.Content>
    </Notice.Root>
  );
};

interface FooterProps {
  submitProps?: {
    color?: ButtonProps["color"];
    label?: string;
  };
}

export const Footer = ({ submitProps }: FooterProps) => {
  const intl = useIntl();

  return (
    <Dialog.Footer>
      <Submit
        text={
          submitProps?.label ??
          intl.formatMessage(commonMessages.saveAndContinue)
        }
        color={submitProps?.color}
      />
      <Dialog.Close>
        <Button color="warning" mode="inline">
          {intl.formatMessage(formMessages.cancelGoBack)}
        </Button>
      </Dialog.Close>
    </Dialog.Footer>
  );
};

const ApplicationStatusDialogContent_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationStatusDialogContent on PoolCandidate {
    status {
      value
      label {
        localized
      }
    }
    statusUpdatedAt
  }
`);

interface ContentProps extends FooterProps {
  query: FragmentType<typeof ApplicationStatusDialogContent_Fragment>;
  reason?: string;
}

export const Content = ({ query, reason, submitProps }: ContentProps) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const application = getFragment(
    ApplicationStatusDialogContent_Fragment,
    query,
  );

  if (
    !application.status ||
    application.status.value === ApplicationStatus.Draft
  ) {
    return null;
  }

  return (
    <>
      <p className="mb-6">
        {intl.formatMessage(
          {
            defaultMessage:
              "Candidates was marked <strong>{status}</strong> on <strong>{date}</strong>",
            id: "VZg3ul",
            description:
              "Message indicating the application status and date it was updated",
          },
          {
            status: application.status.label.localized ?? notAvailable,
            date: application.statusUpdatedAt
              ? formatDate({
                  date: parseDateTimeUtc(application.statusUpdatedAt),
                  formatString: DATE_FORMAT_STRING,
                  intl,
                })
              : notAvailable,
          },
        )}
      </p>
      {reason && (
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage: "For the following reason",
            id: "vibJ0E",
            description:
              "Lead-in text for the reason an application decision was made",
          }) + intl.formatMessage(commonMessages.dividingColon)}
          <span className="font-bold">{reason}</span>
        </p>
      )}
      <p className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            'Do you wish to revert this decision and set candidate status to "Under assessment"?',
          id: "jo9Uct",
          description:
            "Confirmation question for reverting a decision of an application",
        })}
      </p>
      <StatusChangeNotice />
      <Footer submitProps={submitProps} />
    </>
  );
};
