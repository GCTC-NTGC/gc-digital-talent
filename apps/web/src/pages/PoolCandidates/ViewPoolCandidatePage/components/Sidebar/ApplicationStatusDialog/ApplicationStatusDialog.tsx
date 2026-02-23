import { useState } from "react";
import { defineMessage, MessageDescriptor, useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/16/solid/PencilSquareIcon";

import {
  ApplicationStatus,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { Dialog, StatusButton, StatusButtonProps } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import applicationMessages from "~/messages/applicationMessages";
import { applicationStatus } from "~/utils/poolCandidate";

import ToAssessStatusForm from "./ToAssessStatusForm";
import { ApplicationStatusFormProps } from "./types";

const ApplicationStatusDialog_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationStatusDialog on PoolCandidate {
    id
    status {
      value
      label {
        localized
      }
    }
  }
`);

const statusColorMap = new Map<ApplicationStatus, StatusButtonProps["color"]>([
  [ApplicationStatus.ToAssess, "warning"],
  [ApplicationStatus.Disqualified, "error"],
  [ApplicationStatus.Removed, "black"],
  [ApplicationStatus.Qualified, "success"],
]);

const revertMessage = defineMessage({
  defaultMessage: "Revert final assessment decision",
  id: "wb/hvK",
  description:
    "Heading for dialog to revert an application assessment decision",
});

const statusHeaderMap = new Map<ApplicationStatus, MessageDescriptor>([
  [ApplicationStatus.ToAssess, applicationMessages.applicationStatus],
  [ApplicationStatus.Qualified, revertMessage],
  [ApplicationStatus.Disqualified, revertMessage],
  [ApplicationStatus.Removed, applicationMessages.reinstate],
]);

interface ApplicationStatusDialogProps {
  query: FragmentType<typeof ApplicationStatusDialog_Fragment>;
}

const ApplicationStatusDialog = ({ query }: ApplicationStatusDialogProps) => {
  const intl = useIntl();
  const application = getFragment(ApplicationStatusDialog_Fragment, query);
  const [isOpen, setOpen] = useState<boolean>(false);

  if (
    !application.status?.value ||
    application.status?.value === ApplicationStatus.Draft
  ) {
    return null;
  }

  const header = statusHeaderMap.get(
    application.status?.value ?? ApplicationStatus.ToAssess,
  );

  const commonProps: ApplicationStatusFormProps = {
    id: application.id,
    onSubmit() {
      setOpen(false);
    },
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <StatusButton
          color={statusColorMap.get(
            application.status?.value ?? ApplicationStatus.ToAssess,
          )}
          icon={PencilSquareIcon}
          block
        >
          {application.status?.label.localized ??
            intl.formatMessage(commonMessages.notAvailable)}
        </StatusButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(header ?? applicationMessages.applicationStatus)}
        </Dialog.Header>
        {application.status?.value === ApplicationStatus.ToAssess && (
          <ToAssessStatusForm {...commonProps} />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ApplicationStatusDialog;
