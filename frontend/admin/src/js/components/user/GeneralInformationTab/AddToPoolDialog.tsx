import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import Dialog from "@common/components/Dialog";
import Button from "@common/components/Button";
import { toast } from "@common/components/Toast";
import { getFullNameHtml } from "@common/helpers/nameUtils";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import { Input, Select } from "@common/components/form";
import { commonMessages, errorMessages } from "@common/messages";
import { currentDate } from "@common/helpers/formUtils";
import {
  AdvertisementStatus,
  CreatePoolCandidateAsAdminInput,
  Pool,
  PoolCandidate,
  useCreatePoolCandidateMutation,
  User,
} from "../../../api/generated";

type FormValues = {
  poolId: Pool["id"];
  expiryDate: PoolCandidate["expiryDate"];
};

export interface AddToPoolDialogProps {
  user: User;
  pools: Pool[];
}

export const AddToPoolDialog: React.FC<AddToPoolDialogProps> = ({
  user,
  pools,
}) => {
  const intl = useIntl();
  const [open, setOpen] = React.useState(false);
  const methods = useForm<FormValues>();

  const [{ fetching }, executeMutation] = useCreatePoolCandidateMutation();

  const currentPools: string[] = [];
  user.poolCandidates?.forEach((candidate) => {
    if (candidate?.pool?.id) {
      currentPools.push(candidate?.pool?.id);
    }
  });

  const requestMutation = async (values: CreatePoolCandidateAsAdminInput) => {
    const result = await executeMutation({ poolCandidate: values });
    if (result.data?.createPoolCandidateAsAdmin) {
      return result.data.createPoolCandidateAsAdmin;
    }
    return Promise.reject(result.error);
  };

  const submitForm: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    await requestMutation({
      pool: {
        connect: formValues.poolId,
      },
      user: {
        connect: user.id,
      },
      expiryDate: formValues.expiryDate,
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
        setOpen(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Failed adding user",
            id: "GZqEuI",
            description: "Toast for failed add user to pool on view-user page",
          }),
        );
      });
  };
  const { handleSubmit } = methods;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
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
            defaultMessage: "Add user to pool",
            id: "bqaNWT",
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
          <form onSubmit={handleSubmit(submitForm)}>
            <div data-h2-margin="base(x.5, 0, x.125, 0)">
              <Select
                id="addToPoolDialog-poolId"
                name="poolId"
                label={intl.formatMessage({
                  defaultMessage: "Pools",
                  id: "aJVlIF",
                  description:
                    "Label displayed on the pools field of the add user to pool dialog",
                })}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a pool...",
                  id: "X198m3",
                  description:
                    "Placeholder displayed on the pool field of the add user to pool dialog.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={pools
                  .filter((pool) => !currentPools.includes(pool.id))
                  .filter(
                    (pool) =>
                      pool.advertisementStatus ===
                      AdvertisementStatus.Published,
                  )
                  .map((pool) => {
                    return {
                      value: pool.id,
                      label: getFullPoolAdvertisementTitle(intl, pool),
                    };
                  })}
              />
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
              <Input
                id="addToPoolDialog-expiryDate"
                label={intl.formatMessage({
                  defaultMessage: "Expiry date",
                  id: "sICXeM",
                  description:
                    "Label displayed on the date field of the add user to pool dialog",
                })}
                type="date"
                name="expiryDate"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                  min: {
                    value: currentDate(),
                    message: intl.formatMessage(errorMessages.futureDate),
                  },
                }}
              />
            </div>
            <Dialog.Footer>
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

              <Button
                disabled={fetching}
                type="submit"
                mode="solid"
                color="secondary"
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
              >
                {fetching ? (
                  intl.formatMessage(commonMessages.saving)
                ) : (
                  <span data-h2-text-decoration="base(underline)">
                    {intl.formatMessage({
                      defaultMessage: "Add to new pool",
                      id: "yypk6/",
                      description: "Confirmation button for add to pool dialog",
                    })}
                  </span>
                )}
              </Button>
            </Dialog.Footer>
          </form>
        </FormProvider>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddToPoolDialog;
