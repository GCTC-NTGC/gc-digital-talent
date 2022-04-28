import React from "react";
import { useIntl } from "react-intl";

import Dialog from "@common/components/Dialog";

import type { BasicDialogProps } from "./types";

const RequirementDialog: React.FC<BasicDialogProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      color="ia-secondary"
      title={intl.formatMessage({
        defaultMessage: "Applicants must meet the following requirements:",
        description: "Heading for the applicant requirements dialog",
      })}
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            'Please send your resume and cover letter explaining your passion for IT and why you\'re interested in joining the program to: <a href="mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca">edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca</a>. A team member will contact you in 3-5 business days',
          description: "First paragraph for the applicant requirements dialog",
        })}
      </p>
    </Dialog>
  );
};

export default RequirementDialog;
