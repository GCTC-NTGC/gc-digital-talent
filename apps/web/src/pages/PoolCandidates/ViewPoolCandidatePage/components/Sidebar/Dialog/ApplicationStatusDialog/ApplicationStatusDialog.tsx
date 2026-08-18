import { useState } from "react";
import type { MessageDescriptor } from "react-intl";
import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/16/solid/PencilSquareIcon";

import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  ApplicationStatus,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import type { StatusButtonProps } from "@gc-digital-talent/ui";
import { Dialog, StatusButton } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import applicationMessages from "~/messages/applicationMessages";

import ToAssessStatusForm from "./ToAssessStatusForm";
import type { ApplicationStatusFormProps, MutationHandler } from "../types";
import DisqualifiedStatusForm from "./DisqualifiedStatusForm";
import QualifiedStatusForm from "./QualifiedStatusForm";
import RemovedStatusForm from "./RemovedStatusForm";
import messages from "./messages";

const ApplicationStatusDialog_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationStatusDialog on PoolCandidate {
    id
    applicationStatusData {
      status {
        value
        label {
          localized
        }
      }
    }

    ...QualifiedStatusForm
    ...DisqualifiedStatusForm
    ...RemovedStatusForm
  }
`);

const statusColorMap = new Map<ApplicationStatus, StatusButtonProps["color"]>([
  [ApplicationStatus.ToAssess, "warning"],
  [ApplicationStatus.Disqualified, "error"],
  [ApplicationStatus.Removed, "black"],
  [ApplicationStatus.Qualified, "success"],
]);

const statusHeaderMap = new Map<ApplicationStatus, MessageDescriptor>([
  [ApplicationStatus.ToAssess, applicationMessages.applicationStatus],
  [ApplicationStatus.Qualified, messages.revertHeader],
  [ApplicationStatus.Disqualified, messages.revertHeader],
  [ApplicationStatus.Removed, messages.revertHeader],
]);

interface ApplicationStatusDialogProps {
  query: FragmentType<typeof ApplicationStatusDialog_Fragment>;
}

const ApplicationStatusDialog = ({ query }: ApplicationStatusDialogProps) => {
  const intl = useIntl();
  const application = getFragment(ApplicationStatusDialog_Fragment, query);
  const [isOpen, setOpen] = useState<boolean>(false);

  if (
    !application.applicationStatusData?.status?.value ||
    application.applicationStatusData?.status?.value === ApplicationStatus.Draft
  ) {
    return null;
  }

  const header = statusHeaderMap.get(
    application.applicationStatusData?.status?.value ??
      ApplicationStatus.ToAssess,
  );

  const handleSubmit: MutationHandler = async (mutation, msgs) => {
    const handleError = () => {
      toast.error(intl.formatMessage(msgs.error));
    };

    await mutation
      .then((res) => {
        if (!res.data || res.error) {
          handleError();
          return;
        }

        toast.success(intl.formatMessage(msgs.success));
        setOpen(false);
      })
      .catch(handleError);
  };

  const commonProps: ApplicationStatusFormProps = {
    id: application.id,
    onSubmit: handleSubmit,
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <StatusButton
          color={statusColorMap.get(
            application.applicationStatusData?.status?.value ??
              ApplicationStatus.ToAssess,
          )}
          icon={PencilSquareIcon}
          block
        >
          {application.applicationStatusData?.status?.label.localized ??
            intl.formatMessage(commonMessages.notAvailable)}
        </StatusButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(header ?? applicationMessages.applicationStatus)}
        </Dialog.Header>

        {application.applicationStatusData?.status?.value ===
          ApplicationStatus.ToAssess && <ToAssessStatusForm {...commonProps} />}

        {application.applicationStatusData?.status?.value ===
          ApplicationStatus.Qualified && (
          <QualifiedStatusForm {...commonProps} query={application} />
        )}

        {application.applicationStatusData?.status?.value ===
          ApplicationStatus.Disqualified && (
          <DisqualifiedStatusForm {...commonProps} query={application} />
        )}

        {application.applicationStatusData?.status?.value ===
          ApplicationStatus.Removed && (
          <RemovedStatusForm {...commonProps} query={application} />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ApplicationStatusDialog;
