import React from "react";
import { useIntl } from "react-intl";

import Dialog from "@common/components/Dialog";
import CloseButton from "./CloseButton";

import type { BasicDialogProps } from "./types";

const mailAccessor = (...chunks: string[]) => (
  <a
    href="mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca"
    data-h2-color="base(ia-primary) base:hover(dark.ia-primary)"
  >
    {chunks}
  </a>
);

const ApplyDialog: React.FC<BasicDialogProps> = ({ isOpen, onDismiss }) => {
  const intl = useIntl();
  const Close = React.useMemo(
    () => <CloseButton onClick={onDismiss} />,
    [onDismiss],
  );
  return (
    <Dialog
      centered
      isOpen={isOpen}
      onDismiss={onDismiss}
      color="ia-secondary"
      title={intl.formatMessage({
        defaultMessage: "Apply Now",
        description: "Heading for the apply now dialog",
      })}
      footer={Close}
    >
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "Please send your resume and cover letter explaining your passion for IT and why you're interested in joining the program to: <mailLink>edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca</mailLink>. A team member will contact you in 3-5 business days",
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
          description: "Second paragraph for apply now dialog",
        })}
      </p>
      <p data-h2-margin="base(x1, 0, 0, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Thank you for your interest in this Program. We look forward to hearing from you!",
          description: "Third paragraph for apply now dialog",
        })}
      </p>
    </Dialog>
  );
};

export default ApplyDialog;
