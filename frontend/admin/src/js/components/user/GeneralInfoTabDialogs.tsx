import React, { useState } from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import Button from "@common/components/Button";
import { getLocale } from "@common/helpers/localize";
import { enumToOptions } from "@common/helpers/formUtils";
import { getPoolCandidateStatus } from "@common/constants/localizedConstants";
import { InputError, InputWrapper } from "@common/components/inputPartials";
import { toast } from "react-toastify";
import { UserRemoveIcon } from "@heroicons/react/solid";
import { isEmpty } from "lodash";
import {
  CreatePoolCandidateAsAdminInput,
  Pool,
  PoolCandidate,
  PoolCandidateStatus,
  UpdatePoolCandidateAsAdminInput,
  useCreatePoolCandidateMutation,
  useDeletePoolCandidateMutation,
  User,
  useUpdatePoolCandidateMutation,
} from "../../api/generated";

export interface TableDialogProps {
  selectedCandidate: PoolCandidate | null;
  user: User;
  onDismiss: () => void;
}

interface CloseDialogButtonProps {
  close: () => void;
}

const CloseDialogButton: React.FC<CloseDialogButtonProps> = ({ close }) => {
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

interface ConfirmDialogButtonProps {
  onConfirm: () => void;
  title: string;
  icon?: React.FC<{ style: { width: string } }>;
}

const ConfirmDialogButton: React.FC<ConfirmDialogButtonProps> = ({
  onConfirm,
  title,
  icon,
}) => {
  const Icon = icon || null;
  return (
    <Button
      type="button"
      mode="solid"
      color="secondary"
      onClick={onConfirm}
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
    >
      {Icon ? (
        <>
          <Icon style={{ width: "1.5rem" }} />
          <span data-h2-padding="b(left, xs)" data-h2-font-style="b(underline)">
            {title}
          </span>
        </>
      ) : (
        <span data-h2-font-style="b(underline)">{title}</span>
      )}
    </Button>
  );
};

export const ChangeStatusDialog: React.FC<TableDialogProps> = ({
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
    if (!selectedCandidate || !selectedStatus) {
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
          inputId="status"
          label={intl.formatMessage({
            defaultMessage: "Pool status",
            description:
              "Label displayed on the status field of the change candidate status dialog",
          })}
          required
        >
          <select
            data-h2-radius="b(s)"
            data-h2-padding="b(all, xs)"
            data-h2-font-size="b(normal)"
            data-h2-width="b(100)"
            id="status"
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
              <option data-h2-font-family="b(sans)" key={value} value={value}>
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

export const ChangeDateDialog: React.FC<TableDialogProps> = ({
  selectedCandidate,
  user,
  onDismiss,
}) => {
  const intl = useIntl();

  const [selectedDate, setSelectedDate] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [, executeMutation] = useUpdatePoolCandidateMutation();

  const resetAndClose = () => {
    setSelectedDate("");
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
    if (!selectedCandidate || !selectedDate) {
      setShowErrorMessage(true);
      return;
    }

    await handleUpdateCandidate(selectedCandidate.id, {
      expiryDate: selectedDate as PoolCandidateStatus,
    })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Expiry date updated successfully",
            description:
              "Toast for successful expiry date update on view-user page",
          }),
        );
        resetAndClose();
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed updating expiry date",
            description:
              "Toast for failed expiry date update on view-user page",
          }),
        );
      });
  };

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Expiry Date",
        description: "title for change expiry date dialog on view-user page",
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
              defaultMessage: "Change date",
              description: "Confirmation button for change expiry date dialog",
            })}
          />
        </div>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "You're about to change the expiry date for this user:",
          description:
            "First section of text on the change candidate expiry date dialog",
        })}
      </p>
      <p>
        - {user.firstName} {user.lastName}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage: "Set an expiry date for this candidate on this pool:",
          description:
            "Second section of text on the change candidate expiry date dialog",
        })}
      </p>
      <div data-h2-margin="b(bottom, xxs)">
        <InputWrapper
          inputId="date"
          label={intl.formatMessage({
            defaultMessage: "Expiry date",
            description:
              "Label displayed on the date field of the change candidate expiry date dialog",
          })}
          required
        >
          <input
            data-h2-radius="b(s)"
            data-h2-padding="b(all, xs)"
            data-h2-width="b(100)"
            data-h2-font-size="b(normal)"
            data-h2-font-family="b(sans)"
            id="date"
            type="date"
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </InputWrapper>
        <div data-h2-display="block" data-h2-margin="b(top, xxs)">
          <InputError
            isVisible={showErrorMessage}
            error={intl.formatMessage({
              defaultMessage: "Please select a date",
              description:
                "Error displayed on the change candidate expiry date dialog if no date selected",
            })}
          />
        </div>
      </div>
    </Dialog>
  );
};

export const RemoveFromPoolDialog: React.FC<TableDialogProps> = ({
  selectedCandidate,
  user,
  onDismiss,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const [, executeMutation] = useDeletePoolCandidateMutation();

  const handleRemoveCandidate = async (id: string) => {
    const res = await executeMutation({ id });
    if (res.data?.deletePoolCandidate) {
      return res.data.deletePoolCandidate;
    }
    return Promise.reject(res.error);
  };

  const handleSubmit = async () => {
    if (!selectedCandidate?.id) {
      return;
    }

    await handleRemoveCandidate(selectedCandidate.id)
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Candidate removed successfully",
            description:
              "Toast for successful removal of candidate from pool on view-user page",
          }),
        );
        onDismiss();
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed updating expiry date",
            description:
              "Toast for failed removal of candidate from pool on view-user page",
          }),
        );
      });
  };

  const boldText = (msg: string) => {
    return <span data-h2-font-weight="b(bold)">{msg}</span>;
  };

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Remove from pool",
        description: "title for change expiry date dialog on view-user page",
      })}
      color="ts-primary"
      isOpen={selectedCandidate !== null}
      onDismiss={onDismiss}
      footer={
        <div
          data-h2-display="b(flex)"
          data-h2-justify-content="b(space-between))"
        >
          <CloseDialogButton close={onDismiss} />
          <ConfirmDialogButton
            onConfirm={handleSubmit}
            title={intl.formatMessage({
              defaultMessage: "Remove from pool",
              description:
                "Confirmation button for removing candidate from pool dialog",
            })}
            icon={UserRemoveIcon}
          />
        </div>
      }
    >
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "You're about to <boldText>remove the following user:</boldText>",
            description:
              "First section of text on the remove candidate from pool dialog, ignore things in <> tags please",
          },
          {
            boldText,
          },
        )}
      </p>
      <p>
        - {user.firstName} {user.lastName}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage: "From the following pool:",
          description:
            "Second section of text on the remove candidate from pool dialog",
        })}
      </p>
      <p>- {selectedCandidate?.pool?.name?.[locale]}</p>
    </Dialog>
  );
};

export const AddToPoolDialog: React.FC<{
  user: User;
  pools: Pool[];
  isVisible: boolean;
  onDismiss: () => void;
}> = ({ isVisible, user, pools, onDismiss }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const [selectedPool, setSelectedPool] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showPoolErrorMessage, setShowPoolErrorMessage] = useState(false);
  const [showDateErrorMessage, setShowDateErrorMessage] = useState(false);

  const [, executeMutation] = useCreatePoolCandidateMutation();

  const resetAndClose = () => {
    setSelectedPool("");
    setSelectedDate("");
    setShowPoolErrorMessage(false);
    setShowDateErrorMessage(false);

    onDismiss();
  };

  const handleCreateCandidate = async (
    values: CreatePoolCandidateAsAdminInput,
  ) => {
    const res = await executeMutation({ poolCandidate: values });
    if (res.data?.createPoolCandidateAsAdmin) {
      return res.data.createPoolCandidateAsAdmin;
    }
    return Promise.reject(res.error);
  };

  const handleSubmit = async () => {
    if (!selectedPool) {
      setShowPoolErrorMessage(true);
      return;
    }
    if (!selectedDate) {
      setShowPoolErrorMessage(false);
      setShowDateErrorMessage(true);
      return;
    }

    await handleCreateCandidate({
      pool: {
        connect: selectedPool,
      },
      user: {
        connect: user.id,
      },
      expiryDate: selectedDate,
    })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "User added successfully",
            description:
              "Toast for successful add user to pool on view-user page",
          }),
        );
        resetAndClose();
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed adding user",
            description: "Toast for failed add user to pool on view-user page",
          }),
        );
      });
  };

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Add to different pool",
        description: "title for add to pool dialog on view-user page",
      })}
      color="ts-primary"
      isOpen={isVisible}
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
              defaultMessage: "Add to new pool",
              description: "Confirmation button for add to pool dialog",
            })}
          />
        </div>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage: "You're about to add this user to a different pool:",
          description: "First section of text on the add user to pool dialog",
        })}
      </p>
      <p>
        - {user.firstName} {user.lastName}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage: "Choose pool:",
          description: "Second section of text on the add user to pool dialog",
        })}
      </p>
      <div data-h2-margin="b(bottom, xxs)">
        <InputWrapper
          inputId="pool"
          label={intl.formatMessage({
            defaultMessage: "Pools",
            description:
              "Label displayed on the pools field of the add user to pool dialog",
          })}
          required
        >
          <select
            data-h2-radius="b(s)"
            data-h2-padding="b(all, xs)"
            data-h2-font-size="b(normal)"
            data-h2-width="b(100)"
            id="pool"
            defaultValue=""
            onChange={(e) => setSelectedPool(e.target.value)}
          >
            <option value="" disabled>
              {intl.formatMessage({
                defaultMessage: "Select a pool...",
                description:
                  "Placeholder displayed on the pool field of the add user to pool dialog.",
              })}
            </option>
            {pools.map(
              (pool) =>
                !isEmpty(pool?.name?.[locale]) && (
                  <option
                    data-h2-font-family="b(sans)"
                    key={pool?.id}
                    value={pool?.id}
                  >
                    {pool?.name?.[locale]}
                  </option>
                ),
            )}
          </select>
        </InputWrapper>
        <div data-h2-display="block" data-h2-margin="b(top, xxs)">
          <InputError
            isVisible={showPoolErrorMessage}
            error={intl.formatMessage({
              defaultMessage: "Please select a pool",
              description:
                "Error displayed on the add user to pool dialog if no pool selected",
            })}
          />
        </div>
      </div>
      <p>
        {intl.formatMessage({
          defaultMessage: "Set an expiry date for this candidate on this pool:",
          description: "Third section of text on the add user to pool dialog",
        })}
      </p>
      <div data-h2-margin="b(bottom, xxs)">
        <InputWrapper
          inputId="date"
          label={intl.formatMessage({
            defaultMessage: "Expiry date",
            description:
              "Label displayed on the date field of the add user to pool dialog",
          })}
          required
        >
          <input
            data-h2-radius="b(s)"
            data-h2-padding="b(all, xs)"
            data-h2-width="b(100)"
            data-h2-font-size="b(normal)"
            data-h2-font-family="b(sans)"
            data-h2-border="b(darkgray, all, solid, s)"
            id="date"
            type="date"
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </InputWrapper>
        <div data-h2-display="block" data-h2-margin="b(top, xxs)">
          <InputError
            isVisible={showDateErrorMessage}
            error={intl.formatMessage({
              defaultMessage: "Please select an expiry date",
              description:
                "Error displayed on the add user to pool dialog if no date selected",
            })}
          />
        </div>
      </div>
    </Dialog>
  );
};
