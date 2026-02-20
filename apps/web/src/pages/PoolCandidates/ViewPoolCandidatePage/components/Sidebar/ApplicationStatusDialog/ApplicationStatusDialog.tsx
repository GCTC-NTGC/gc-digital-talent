import { useState } from "react";
import { useIntl } from "react-intl";
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

import ToAssessStatusForm from "./ToAssessStatusForm";

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

interface ApplicationStatusDialogProps {
  query: FragmentType<typeof ApplicationStatusDialog_Fragment>;
}

const ApplicationStatusDialog = ({ query }: ApplicationStatusDialogProps) => {
  const intl = useIntl();
  const application = getFragment(ApplicationStatusDialog_Fragment, query);
  const [isOpen, setOpen] = useState<boolean>(false);

  const close = () => {
    setOpen(false);
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
          {intl.formatMessage(applicationMessages.applicationStatus)}
        </Dialog.Header>
        {application.status?.value === ApplicationStatus.ToAssess && (
          <ToAssessStatusForm id={application.id} onSubmit={close} />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ApplicationStatusDialog;
