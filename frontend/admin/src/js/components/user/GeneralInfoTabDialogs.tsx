import React, { useState } from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import Button from "@common/components/Button";
import { getLocale } from "@common/helpers/localize";
import { enumToOptions } from "@common/helpers/formUtils";
import { getPoolCandidateStatus } from "@common/constants/localizedConstants";
import { InputError, InputWrapper } from "@common/components/inputPartials";
import { toast } from "react-toastify";
import {
  PoolCandidate,
  PoolCandidateStatus,
  UpdatePoolCandidateAsAdminInput,
  User,
  useUpdatePoolCandidateMutation,
} from "../../api/generated";

export interface DialogProps {
  selectedCandidate: PoolCandidate | null;
  user: User;
  onDismiss: () => void;
}

export interface CloseDialogButtonProps {
  close: () => void;
}

export const CloseDialogButton: React.FC<CloseDialogButtonProps> = ({
  close,
}) => {
  const intl = useIntl();
  return (
    <Button type="button" mode="outline" color="secondary" onClick={close}>
      <span data-h2-font-style="b(underline)">
        {intl.formatMessage({
          defaultMessage: "Cancel and go back",
          description: "Close dialog button",
        })}
      </span>
    </Button>
  );
};

export interface ConfirmDialogButtonProps {
  onConfirm: () => void;
  title: string;
}

export const ConfirmDialogButton: React.FC<ConfirmDialogButtonProps> = ({
  onConfirm,
  title,
}) => {
  return (
    <Button type="button" mode="solid" color="secondary" onClick={onConfirm}>
      <span data-h2-font-style="b(underline)">{title}</span>
    </Button>
  );
};

export const ChangeStatusDialog: React.FC<DialogProps> = ({
  selectedCandidate,
  user,
  onDismiss,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [, executeMutation] = useUpdatePoolCandidateMutation();

  const resetAndClose = () => {
    setSelectedStatus("");
    setShowErrorMessage(false);

    onDismiss();
  };

  const handleUpdateCandidate = async (
    id: string,
    values: UpdatePoolCandidateAsAdminInput,
  ) => {
    const res = await executeMutation({ id, poolCandidate: values });
    if (res.data?.updatePoolCandidateAsAdmin) {
      return res.data.updatePoolCandidateAsAdmin;
    }
    return Promise.reject(res.error);
  };

  const handleSubmit = async () => {
    if (selectedCandidate === null || !selectedStatus) {
      setShowErrorMessage(true);
      return;
    }

    await handleUpdateCandidate(selectedCandidate.id, {
      status: selectedStatus as PoolCandidateStatus,
    })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Status updated successfully",
            description: "Toast for successful status update on view-user page",
          }),
        );
        resetAndClose();
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed updating status",
            description: "Toast for failed status update on view-user page",
          }),
        );
      });
  };

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Change status",
        description: "title for change status dialog on view-user page",
      })}
      color="ts-primary"
      isOpen={selectedCandidate !== null}
      onDismiss={resetAndClose}
      footer={
        <div
          data-h2-display="b(flex)"
          data-h2-justify-content="b(space-between))"
        >
          <CloseDialogButton close={resetAndClose} />
          <ConfirmDialogButton
            onConfirm={handleSubmit}
            title={intl.formatMessage({
              defaultMessage: "Change status",
              description: "Confirmation button for change status dialog",
            })}
          />
        </div>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage: "You're about to change status for this user:",
          description:
            "First section of text on the change candidate status dialog",
        })}
      </p>
      <p>
        - {user.firstName} {user.lastName}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage: "From the following pool:",
          description:
            "Second section of text on the change candidate status dialog",
        })}
      </p>
      <p>- {selectedCandidate?.pool?.name?.[locale]}</p>
      <p>
        {intl.formatMessage({
          defaultMessage: "Choose status:",
          description:
            "Third section of text on the change candidate status dialog",
        })}
      </p>
      <div data-h2-margin="b(bottom, xxs)">
        <InputWrapper
          inputId="new-status"
          label={intl.formatMessage({
            defaultMessage: "Pool status",
            description:
              "Label displayed on the status field of the change candidate status dialog",
          })}
          required
        >
          <select
            data-h2-radius="b(s)"
            data-h2-padding="b(left, xxs) b(top-bottom, xs)"
            data-h2-font-size="b(normal)"
            data-h2-width="b(100)"
            id="new-status"
            defaultValue=""
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="" disabled>
              {intl.formatMessage({
                defaultMessage: "Select a pool status...",
                description:
                  "Placeholder displayed on the status field of the change candidate status dialog.",
              })}
            </option>
            {enumToOptions(PoolCandidateStatus).map(({ value }) => (
              <option
                data-h2-font-size="b(normal)"
                data-h2-font-family="b(sans)"
                key={value}
                value={value}
              >
                {intl.formatMessage(getPoolCandidateStatus(value))}
              </option>
            ))}
          </select>
        </InputWrapper>
        <div data-h2-display="block" data-h2-margin="b(top, xxs)">
          <InputError
            isVisible={showErrorMessage}
            error={intl.formatMessage({
              defaultMessage: "Please select a status",
              description:
                "Error displayed on the change candidate status dialog if no status selected",
            })}
          />
        </div>
      </div>
    </Dialog>
  );
};
