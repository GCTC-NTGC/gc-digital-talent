import React, { useState } from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import Button from "@common/components/Button";
import { enumToOptions } from "@common/helpers/formUtils";
import { getPoolCandidateStatus } from "@common/constants/localizedConstants";
import { InputError, InputWrapper } from "@common/components/inputPartials";
import { toast } from "react-toastify";
import { UserMinusIcon } from "@heroicons/react/24/solid";
import { getFullNameHtml } from "@common/helpers/nameUtils";
import { refresh } from "@common/helpers/router";
import { FormProvider, useForm } from "react-hook-form";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
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
} from "../../../api/generated";

export interface TableDialogProps {
  selectedCandidate: PoolCandidate | null;
  user: User;
}

const ModalTableButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, ...rest }, forwardedRef) => (
  <Button
    ref={forwardedRef}
    {...rest}
    color="black"
    mode="inline"
    data-h2-padding="base(0)"
  >
    <span data-h2-text-decoration="base(underline)">{children}</span>
  </Button>
));

const CloseDialogButton = () => {
  const intl = useIntl();
  return (
    <Dialog.Close>
      <Button type="button" mode="outline" color="secondary">
        <span data-h2-text-decoration="base(underline)">
          {intl.formatMessage({
            defaultMessage: "Cancel and go back",
            id: "tiF/jI",
            description: "Close dialog button",
          })}
        </span>
      </Button>
    </Dialog.Close>
  );
};

interface ConfirmDialogButtonProps {
  onConfirm: () => void;
  title: string;
  icon?: React.FC<{ style: { width: string } }>;
  disabled: boolean;
}

const ConfirmDialogButton: React.FC<ConfirmDialogButtonProps> = ({
  onConfirm,
  title,
  icon,
  disabled,
}) => {
  const Icon = icon || null;

  return (
    <Dialog.Close>
      <Button
        type="button"
        mode="solid"
        color="secondary"
        disabled={disabled}
        onClick={onConfirm}
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
      >
        {Icon ? (
          <>
            <Icon style={{ width: "1.5rem" }} />
            <span
              data-h2-padding="base(0, 0, 0, x.25)"
              data-h2-text-decoration="base(underline)"
            >
              {title}
            </span>
          </>
        ) : (
          <span data-h2-text-decoration="base(underline)">{title}</span>
        )}
      </Button>
    </Dialog.Close>
  );
};

export const ChangeStatusDialog: React.FC<TableDialogProps> = ({
  selectedCandidate,
  user,
}) => {
  const intl = useIntl();
  const methods = useForm();

  const [selectedStatus, setSelectedStatus] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [, executeMutation] = useUpdatePoolCandidateMutation();

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

    setSubmitting(true);

    await handleUpdateCandidate(selectedCandidate.id, {
      status: selectedStatus as PoolCandidateStatus,
    })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Status updated successfully",
            id: "nYriNg",
            description: "Toast for successful status update on view-user page",
          }),
        );
        refresh();
      })
      .catch(() => {
        setSubmitting(false);
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed updating status",
            id: "BnSa6Y",
            description: "Toast for failed status update on view-user page",
          }),
        );
      });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <ModalTableButton>
          {intl.formatMessage({
            defaultMessage: "Change status",
            id: "bl7pCx",
            description:
              "Button to change a users status in a pool - located in the table on view-user page",
          })}
        </ModalTableButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-primary">
          {intl.formatMessage({
            defaultMessage: "Change status",
            id: "SARjte",
            description: "title for change status dialog on view-user page",
          })}
        </Dialog.Header>

        <p>
          {intl.formatMessage({
            defaultMessage: "You're about to change status for this user:",
            id: "p+YRN1",
            description:
              "First section of text on the change candidate status dialog",
          })}
        </p>
        <p>- {getFullNameHtml(user.firstName, user.lastName, intl)}</p>
        <p data-h2-margin="base(x1, 0, 0, 0)">
          {intl.formatMessage({
            defaultMessage: "From the following pool:",
            id: "FUxE8S",
            description:
              "Second section of text on the change candidate status dialog",
          })}
        </p>
        <p>- {getFullPoolAdvertisementTitle(intl, selectedCandidate?.pool)}</p>
        <p data-h2-margin="base(x1, 0, 0, 0)">
          {intl.formatMessage({
            defaultMessage: "Choose status:",
            id: "Zbk4zf",
            description:
              "Third section of text on the change candidate status dialog",
          })}
        </p>
        <FormProvider {...methods}>
          <div data-h2-margin="base(x.5, 0, x.125, 0)">
            <InputWrapper
              inputId="status"
              label={intl.formatMessage({
                defaultMessage: "Pool status",
                id: "n9YPWe",
                description:
                  "Label displayed on the status field of the change candidate status dialog",
              })}
              required
            >
              <select
                data-h2-radius="base(s)"
                data-h2-padding="base(x.25)"
                data-h2-font-size="base(copy)"
                data-h2-width="base(100%)"
                id="status"
                defaultValue=""
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="" disabled>
                  {intl.formatMessage({
                    defaultMessage: "Select a pool status...",
                    id: "usNShh",
                    description:
                      "Placeholder displayed on the status field of the change candidate status dialog.",
                  })}
                </option>
                {enumToOptions(PoolCandidateStatus).map(({ value }) => (
                  <option
                    data-h2-font-family="base(sans)"
                    key={value}
                    value={value}
                  >
                    {intl.formatMessage(getPoolCandidateStatus(value))}
                  </option>
                ))}
              </select>
            </InputWrapper>
            <div
              data-h2-display="base(block)"
              data-h2-margin="base(x.125, 0, 0, 0)"
            >
              <InputError
                isVisible={showErrorMessage}
                error={intl.formatMessage({
                  defaultMessage: "Please select a status",
                  id: "eaHqS2",
                  description:
                    "Error displayed on the change candidate status dialog if no status selected",
                })}
              />
            </div>
          </div>
        </FormProvider>
        <Dialog.Footer>
          <CloseDialogButton />
          <ConfirmDialogButton
            onConfirm={handleSubmit}
            title={
              submitting
                ? intl.formatMessage({
                    defaultMessage: "Submitting",
                    id: "gCbb9X",
                    description: "Text on submit button when submitting",
                  })
                : intl.formatMessage({
                    defaultMessage: "Change status",
                    id: "iuve97",
                    description: "Confirmation button for change status dialog",
                  })
            }
            disabled={submitting}
          />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export const ChangeDateDialog: React.FC<TableDialogProps> = ({
  selectedCandidate,
  user,
}) => {
  const intl = useIntl();
  const methods = useForm();

  const [selectedDate, setSelectedDate] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [, executeMutation] = useUpdatePoolCandidateMutation();

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

    setSubmitting(true);

    await handleUpdateCandidate(selectedCandidate.id, {
      expiryDate: selectedDate as PoolCandidateStatus,
    })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Expiry date updated successfully",
            id: "HwPuG0",
            description:
              "Toast for successful expiry date update on view-user page",
          }),
        );
        refresh();
      })
      .catch(() => {
        setSubmitting(false);
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed updating expiry date",
            id: "qSTIKZ",
            description:
              "Toast for failed expiry date update on view-user page",
          }),
        );
      });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <ModalTableButton>{selectedCandidate?.expiryDate}</ModalTableButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-primary">
          {intl.formatMessage({
            defaultMessage: "Expiry Date",
            id: "zDO6tt",
            description:
              "title for change expiry date dialog on view-user page",
          })}
        </Dialog.Header>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "You're about to change the expiry date for this user:",
            id: "JjTGYe",
            description:
              "First section of text on the change candidate expiry date dialog",
          })}
        </p>
        <p>- {getFullNameHtml(user.firstName, user.lastName, intl)}</p>
        <p data-h2-margin="base(x1, 0, 0, 0)">
          {intl.formatMessage({
            defaultMessage:
              "Set an expiry date for this candidate on this pool:",
            id: "n+d6QE",
            description:
              "Second section of text on the change candidate expiry date dialog",
          })}
        </p>
        <FormProvider {...methods}>
          <div data-h2-margin="base(x.5, 0, x.125, 0)">
            <InputWrapper
              inputId="date"
              label={intl.formatMessage({
                defaultMessage: "Expiry date",
                id: "WAO4vD",
                description:
                  "Label displayed on the date field of the change candidate expiry date dialog",
              })}
              required
            >
              <input
                data-h2-radius="base(s)"
                data-h2-padding="base(x.25)"
                data-h2-width="base(100%)"
                data-h2-font-size="base(copy)"
                data-h2-font-family="base(sans)"
                id="date"
                type="date"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </InputWrapper>
            <div
              data-h2-display="base(block)"
              data-h2-margin="base(x.125, 0, 0, 0)"
            >
              <InputError
                isVisible={showErrorMessage}
                error={intl.formatMessage({
                  defaultMessage: "Please select a date",
                  id: "Cbo1no",
                  description:
                    "Error displayed on the change candidate expiry date dialog if no date selected",
                })}
              />
            </div>
          </div>
        </FormProvider>
        <Dialog.Footer>
          <CloseDialogButton />
          <ConfirmDialogButton
            onConfirm={handleSubmit}
            title={
              submitting
                ? intl.formatMessage({
                    defaultMessage: "Submitting",
                    id: "gCbb9X",
                    description: "Text on submit button when submitting",
                  })
                : intl.formatMessage({
                    defaultMessage: "Change date",
                    id: "gvomlw",
                    description:
                      "Confirmation button for change expiry date dialog",
                  })
            }
            disabled={submitting}
          />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

// Currently unused - keeping this incase we want to bring it back later
export const RemoveFromPoolDialog: React.FC<TableDialogProps> = ({
  selectedCandidate,
  user,
}) => {
  const intl = useIntl();

  const [submitting, setSubmitting] = useState(false);

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

    setSubmitting(true);

    await handleRemoveCandidate(selectedCandidate.id)
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Candidate removed successfully",
            id: "tmbdSb",
            description:
              "Toast for successful removal of candidate from pool on view-user page",
          }),
        );
      })
      .catch(() => {
        setSubmitting(false);
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed updating expiry date",
            id: "uOtDuW",
            description:
              "Toast for failed removal of candidate from pool on view-user page",
          }),
        );
      });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <ModalTableButton>
          {intl.formatMessage({
            defaultMessage: "Remove from pool",
            id: "KyMCYC",
            description:
              "title for change expiry date dialog on view-user page",
          })}
        </ModalTableButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-primary">
          {intl.formatMessage({
            defaultMessage: "Remove from pool",
            id: "KyMCYC",
            description:
              "title for change expiry date dialog on view-user page",
          })}
        </Dialog.Header>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "You're about to <strong>remove the following user:</strong>",
            id: "0cEmmG",
            description:
              "First section of text on the remove candidate from pool dialog, ignore things in <> tags please",
          })}
        </p>
        <p>- {getFullNameHtml(user.firstName, user.lastName, intl)}</p>
        <p data-h2-margin="base(x1, 0, 0, 0)">
          {intl.formatMessage({
            defaultMessage: "From the following pool:",
            id: "vyJpp2",
            description:
              "Second section of text on the remove candidate from pool dialog",
          })}
        </p>
        <p>- {getFullPoolAdvertisementTitle(intl, selectedCandidate?.pool)}</p>
        <Dialog.Footer>
          <CloseDialogButton />
          <ConfirmDialogButton
            onConfirm={handleSubmit}
            title={
              submitting
                ? intl.formatMessage({
                    defaultMessage: "Submitting",
                    id: "gCbb9X",
                    description: "Text on submit button when submitting",
                  })
                : intl.formatMessage({
                    defaultMessage: "Remove from pool",
                    id: "98PjUH",
                    description:
                      "Confirmation button for removing candidate from pool dialog",
                  })
            }
            disabled={submitting}
            icon={UserMinusIcon}
          />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export const AddToPoolDialog: React.FC<{
  user: User;
  pools: Pool[];
}> = ({ user, pools }) => {
  const intl = useIntl();
  const methods = useForm();

  const [selectedPool, setSelectedPool] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showPoolErrorMessage, setShowPoolErrorMessage] = useState(false);
  const [showDateErrorMessage, setShowDateErrorMessage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [, executeMutation] = useCreatePoolCandidateMutation();

  const currentPools: string[] = [];
  user.poolCandidates?.forEach((candidate) => {
    if (candidate?.pool?.id) {
      currentPools.push(candidate?.pool?.id);
    }
  });

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

    setSubmitting(true);

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
            id: "O8U5Sz",
            description:
              "Toast for successful add user to pool on view-user page",
          }),
        );
        refresh();
      })
      .catch(() => {
        setSubmitting(false);
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed adding user",
            id: "GZqEuI",
            description: "Toast for failed add user to pool on view-user page",
          }),
        );
      });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="primary" mode="outline">
          <span data-h2-text-decoration="base(underline)">
            {intl.formatMessage({
              defaultMessage: "Add user to pool",
              id: "4Irijj",
              description: "Button to add user to pool on the view-user page",
            })}
          </span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-primary">
          {intl.formatMessage({
            defaultMessage: "Add to different pool",
            id: "CTWpfa",
            description: "title for add to pool dialog on view-user page",
          })}
        </Dialog.Header>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "You're about to add this user to a different pool:",
            id: "8Y+eEc",
            description: "First section of text on the add user to pool dialog",
          })}
        </p>
        <p>- {getFullNameHtml(user.firstName, user.lastName, intl)}</p>
        <p data-h2-margin="base(x1, 0, 0, 0)">
          {intl.formatMessage({
            defaultMessage: "Choose pool:",
            id: "K3LEpl",
            description:
              "Second section of text on the add user to pool dialog",
          })}
        </p>
        <FormProvider {...methods}>
          <div data-h2-margin="base(x.5, 0, x.125, 0)">
            <InputWrapper
              inputId="pool"
              label={intl.formatMessage({
                defaultMessage: "Pools",
                id: "aJVlIF",
                description:
                  "Label displayed on the pools field of the add user to pool dialog",
              })}
              required
            >
              <select
                data-h2-radius="base(s)"
                data-h2-padding="base(x.25)"
                data-h2-font-size="base(copy)"
                data-h2-width="base(100%)"
                id="pool"
                defaultValue=""
                onChange={(e) => setSelectedPool(e.target.value)}
              >
                <option value="" disabled>
                  {intl.formatMessage({
                    defaultMessage: "Select a pool...",
                    id: "X198m3",
                    description:
                      "Placeholder displayed on the pool field of the add user to pool dialog.",
                  })}
                </option>
                {pools.map((pool) => {
                  if (currentPools.includes(pool.id)) {
                    return null;
                  }
                  return (
                    <option
                      data-h2-font-family="base(sans)"
                      key={pool?.id}
                      value={pool?.id}
                    >
                      {getFullPoolAdvertisementTitle(intl, pool)}
                    </option>
                  );
                })}
              </select>
            </InputWrapper>
            <div
              data-h2-display="base(block)"
              data-h2-margin="base(x.125, 0, 0, 0)"
            >
              <InputError
                isVisible={showPoolErrorMessage}
                error={intl.formatMessage({
                  defaultMessage: "Please select a pool",
                  id: "uJSvlo",
                  description:
                    "Error displayed on the add user to pool dialog if no pool selected",
                })}
              />
            </div>
          </div>
          <p data-h2-margin="base(x1, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Set an expiry date for this candidate on this pool:",
              id: "9NDM+k",
              description:
                "Third section of text on the add user to pool dialog",
            })}
          </p>
          <div data-h2-margin="base(x.5, 0, x.125, 0)">
            <InputWrapper
              inputId="date"
              label={intl.formatMessage({
                defaultMessage: "Expiry date",
                id: "sICXeM",
                description:
                  "Label displayed on the date field of the add user to pool dialog",
              })}
              required
            >
              <input
                data-h2-radius="base(s)"
                data-h2-padding="base(x.25)"
                data-h2-width="base(100%)"
                data-h2-font-size="base(copy)"
                data-h2-font-family="base(sans)"
                data-h2-border="base(all, 1px, solid, dark.dt-gray)"
                id="date"
                type="date"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </InputWrapper>
            <div
              data-h2-display="base(block)"
              data-h2-margin="base(x.125, 0, 0, 0)"
            >
              <InputError
                isVisible={showDateErrorMessage}
                error={intl.formatMessage({
                  defaultMessage: "Please select an expiry date",
                  id: "k2FnXH",
                  description:
                    "Error displayed on the add user to pool dialog if no date selected",
                })}
              />
            </div>
          </div>
        </FormProvider>
        <Dialog.Footer>
          <CloseDialogButton />
          <ConfirmDialogButton
            onConfirm={handleSubmit}
            title={
              submitting
                ? intl.formatMessage({
                    defaultMessage: "Submitting",
                    id: "gCbb9X",
                    description: "Text on submit button when submitting",
                  })
                : intl.formatMessage({
                    defaultMessage: "Add to new pool",
                    id: "yypk6/",
                    description: "Confirmation button for add to pool dialog",
                  })
            }
            disabled={submitting}
          />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
