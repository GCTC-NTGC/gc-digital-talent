import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";

import CloseButton from "./CloseButton";
import type { BasicDialogProps } from "./types";

const RequirementDialog = ({ btnProps }: BasicDialogProps) => {
  const intl = useIntl();
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="primary" mode="solid" {...btnProps}>
          {intl.formatMessage({
            defaultMessage: "See Eligibility Criteria",
            id: "+do6jV",
            description: "Button text for program eligibility criteria",
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
            defaultMessage: "Applicants must meet the following requirements:",
            id: "6l9YH+",
            description: "Heading for the applicant requirements dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <ul data-h2-padding="base(0, 0, 0, x1)">
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "Are First Nations (status or non-status), Inuit, or Métis",
                id: "pPOGwF",
                description: "IAP Requirement list item one",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "Have a high school diploma or equivalent (a GED)",
                id: "wgIThY",
                description: "IAP Requirement list item two",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage: "Be a minimum of 16 years old",
                id: "cNXORI",
                description: "IAP Requirement list item three",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "Have a passion for and an interest in information technology (IT), with that passion and interest demonstrated through personal, volunteer, community, or professional life experience",
                id: "27FjxB",
                description: "IAP Requirement list item four",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "Have a commitment to learn throughout the duration of the program, both on-the-job and by following an online training program",
                id: "/ar49+",
                description: "IAP Requirement list item five",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "Individuals who are offered positions with the flexibility of working from home must have adequate internet access to support remote work.",
                id: "+cn9MN",
                description: "IAP Requirement list item six",
              })}
            </li>
          </ul>
          <Dialog.Footer>
            <CloseButton />
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RequirementDialog;
