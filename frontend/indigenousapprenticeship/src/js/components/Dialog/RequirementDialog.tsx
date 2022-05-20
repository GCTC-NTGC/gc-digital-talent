import React from "react";
import { useIntl } from "react-intl";

import Dialog from "@common/components/Dialog";
import CloseButton from "./CloseButton";

import type { BasicDialogProps } from "./types";

const RequirementDialog: React.FC<BasicDialogProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();
  const Close = React.useMemo(
    () => <CloseButton onClick={onDismiss} />,
    [onDismiss],
  );

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      color="ia-secondary"
      title={intl.formatMessage({
        defaultMessage: "Applicants must meet the following requirements:",
        description: "Heading for the applicant requirements dialog",
      })}
      footer={Close}
    >
      <ul>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "Are First Nations (status or non-status), Inuit, or Métis",
            description: "IAP Requirement list item one",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "Have a high school diploma or equivalent (a GED)",
            description: "IAP Requirement list item two",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage: "Be a minimum of 16 years old",
            description: "IAP Requirement list item three",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "Have a passion for and an interest in information technology (IT), with that passion and interest demonstrated through personal, volunteer, community, or professional life experience",
            description: "IAP Requirement list item four",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "Have a commitment to learn throughout the duration of the program, both on-the-job and by following an online training program",
            description: "IAP Requirement list item five",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "Individuals who are offered positions with the flexibility of working from home must have adequate internet access to support remote work.",
            description: "IAP Requirement list item six",
          })}
        </li>
      </ul>
    </Dialog>
  );
};

export default RequirementDialog;
