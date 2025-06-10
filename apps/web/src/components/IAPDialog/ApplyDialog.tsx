import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Button, Dialog, Link } from "@gc-digital-talent/ui";

import CloseButton from "./CloseButton";
import { BasicDialogProps } from "./types";

const mailAccessor = (chunks: ReactNode) => (
  <Link
    external
    color="secondary"
    href="mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca"
  >
    {chunks}
  </Link>
);

const ApplyDialog = ({ btnProps }: BasicDialogProps) => {
  const intl = useIntl();
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="primary" mode="solid" {...btnProps}>
          {intl.formatMessage({
            defaultMessage: "Apply Now",
            id: "DvmNR7",
            description: "Button text to apply for program",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        closeLabel={intl.formatMessage({
          defaultMessage: "Close",
          id: "4p0QdF",
          description: "Button text used to close an open modal",
        })}
      >
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Apply Now",
            id: "ce892L",
            description: "Heading for the apply now dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "Please send your résumé and cover letter explaining your passion for IT and why you're interested in joining the program to: <mailLink>edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca</mailLink>. A team member will contact you in 5-10 business days.",
                id: "i2LB7R",
                description: "First paragraph for apply now dialog",
              },
              {
                mailLink: mailAccessor,
              },
            )}
          </p>
          <p data-h2-margin="base(x1, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "We want to let you know that in the meantime, updates are being made on this site that will allow Indigenous peoples who are interested in joining the IT Apprenticeship Program to apply online.",
              id: "BSSYnh",
              description: "Second paragraph for apply now dialog",
            })}
          </p>
          <p data-h2-margin="base(x1, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Thank you for your interest in this program. We look forward to hearing from you!",
              id: "tBGvoD",
              description: "Third paragraph for apply now dialog",
            })}
          </p>
          <Dialog.Footer>
            <Dialog.Close>
              <CloseButton />
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ApplyDialog;
