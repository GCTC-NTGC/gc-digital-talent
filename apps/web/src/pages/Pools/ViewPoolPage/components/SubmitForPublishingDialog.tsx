import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Button, Dialog, Link } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { Maybe } from "@gc-digital-talent/graphql";

const contactLink = (chunks: ReactNode) => (
  <Link
    color="secondary"
    external
    href="mailto:recruitmentIMIT-recrutementGITI@tbs-sct.gc.ca"
  >
    {chunks}
  </Link>
);

interface SubmitForPublishingDialogProps {
  isReadyToPublish: Maybe<boolean>;
}

const SubmitForPublishingDialog = ({
  isReadyToPublish,
}: SubmitForPublishingDialogProps) => {
  const intl = useIntl();

  const dialogTitle = intl.formatMessage({
    defaultMessage: "Submit for publishing",
    id: "I5q1n6",
    description: "Title for dialog to submit a process for publishing",
  });

  if (!isReadyToPublish) {
    return (
      <Button
        mode="inline"
        color="secondary"
        onClick={() => {
          toast.error(
            intl.formatMessage({
              defaultMessage:
                "Please complete all advertisement information before publishing.",
              id: "QzU2SL",
              description:
                "Error message displayed when user attempts to publish an incomplete advertisement",
            }),
          );
        }}
      >
        {dialogTitle}
      </Button>
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button mode="inline" color="secondary">
          {dialogTitle}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{dialogTitle}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage({
              defaultMessage:
                " Your advertisement information and assessment plan are complete.",
              id: "SQJgGP",
              description:
                "Lead-in text on a complete process, ready for publishing",
            })}
          </p>
          <p data-h2-margin="base(x1 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "If you are ready to publish this advertisement please <a>get in touch with an administrator</a>.",
                id: "EqUTLs",
                description:
                  "Instructions on how to submit a process for publishing",
              },
              { a: contactLink },
            )}
          </p>
          <p data-h2-margin="base(x1 0)">
            {intl.formatMessage({
              defaultMessage:
                "The GC Digital Talent team will review and publish your advertisement.",
              id: "mbASCD",
              description:
                "Description of what happens after a process is submitted for publishing",
            })}
          </p>
          <Dialog.Footer>
            <Dialog.Close>
              <Button mode="inline" color="primary">
                {intl.formatMessage({
                  defaultMessage: "Close this dialog",
                  id: "n2bW9s",
                  description: "Button text to close a dialog",
                })}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SubmitForPublishingDialog;
