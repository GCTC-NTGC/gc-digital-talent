import React from "react";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";

const SubmitForPublishingDialog = () => {
  const intl = useIntl();

  const dialogTitle = intl.formatMessage({
    defaultMessage: "Submit for publishing",
    id: "I5q1n6",
    description: "Title for dialog to submit a process for publishing",
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button mode="inline" color="primary">
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
            {intl.formatMessage({
              defaultMessage:
                "If you are ready to publish this advertisement please <a>get in touch with an administrator</a>.",
              id: "EqUTLs",
              description:
                "Instructions on how to submit a process for publishing",
            })}
          </p>
          <p data-h2-margin="base(x1 0)">
            {intl.formatMessage({
              defaultMessage:
                "The GC Digital talent team will review and publish your advertisement.",
              id: "m+M6WO",
              description:
                "Description of what happens after a process is submitted for publishing",
            })}
          </p>
          <Dialog.Footer data-h2-justify-content="base(flex-start)">
            <Dialog.Close>
              <Button mode="inline" color="secondary">
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
