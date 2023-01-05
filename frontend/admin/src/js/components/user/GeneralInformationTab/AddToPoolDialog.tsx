import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import Dialog from "@common/components/Dialog";
import Button from "@common/components/Button";
import { toast } from "@common/components/Toast";
import { getFullNameHtml } from "@common/helpers/nameUtils";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import { Input } from "@common/components/form";
import MultiSelectV2 from "@common/components/form/MultiSelect/MultiSelectFieldV2";
import { commonMessages, errorMessages } from "@common/messages";
import { currentDate } from "@common/helpers/formUtils";
import { notEmpty } from "@common/helpers/util";
import {
  AdvertisementStatus,
  Applicant,
  CreatePoolCandidateAsAdminInput,
  Pool,
  PoolCandidate,
  useCreatePoolCandidateMutation,
  Scalars,
} from "../../../api/generated";

type FormValues = {
  pools: Array<Pool["id"]>;
  expiryDate: PoolCandidate["expiryDate"];
};

export interface AddToPoolDialogProps {
  user: Applicant;
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
    const promises: Array<ReturnType<typeof requestMutation>> = [];
    await formValues.pools.forEach(async (poolId) => {
      promises.push(
        requestMutation({
          pool: {
            connect: poolId,
          },
          user: {
            connect: user.id,
          },
          expiryDate: formValues.expiryDate,
        }).catch((err) => {
          throw err;
        }),
      );
    });

    Promise.allSettled(promises)
      .then((responses) => {
        const poolsFailed: Array<Scalars["ID"]> = [];
        responses.forEach((res, index) => {
          if (res.status === "rejected") {
            const poolId = formValues.pools[index];
            if (poolId) {
              poolsFailed.push(poolId);
            }
          }
        });
        if (poolsFailed.length) {
          const poolNames = poolsFailed
            .map((id) => {
              const pool = pools.find((p) => p.id === id);
              if (pool) {
                return getFullPoolAdvertisementTitle(intl, pool);
              }
              return undefined;
            })
            .filter(notEmpty);

          if (poolNames.length) {
            toast.error(
              <>
                {intl.formatMessage({
                  defaultMessage: "Failed to add user to the following pools:",
                  id: "6Y6hy9",
                  description:
                    "Error message displayed when an attempt to add users to known pools",
                })}
                <ul>
                  {poolNames.map((poolName) => (
                    <li key={poolName}>{poolName}</li>
                  ))}
                </ul>
              </>,
            );
          } else {
            toast.error(
              intl.formatMessage({
                defaultMessage: "Failed to add user to one or more pools",
                id: "49Vkag",
                description:
                  "Error message displayed when an attempt to add users to unkown pools",
              }),
            );
          }
        }
        // If failed is same length as the promises,
        // we can assume none of the additions succeeded
        // so, do not show the success toast
        if (poolsFailed.length !== promises.length) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "User added successfully",
              id: "O8U5Sz",
              description:
                "Toast for successful add user to pool on view-user page",
            }),
          );
        }
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

  const poolOptions = pools
    .filter((pool) => !currentPools.includes(pool.id))
    .filter(
      (pool) =>
        pool.advertisementStatus === AdvertisementStatus.Published ||
        pool.advertisementStatus === AdvertisementStatus.Closed,
    )
    .map((pool) => {
      return {
        value: pool.id,
        label: getFullPoolAdvertisementTitle(intl, pool),
      };
    });

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
              <MultiSelectV2
                id="addToPoolDialog-pools"
                name="pools"
                label={intl.formatMessage({
                  defaultMessage: "Pools",
                  id: "aJVlIF",
                  description:
                    "Label displayed on the pools field of the add user to pool dialog",
                })}
                placeholder={intl.formatMessage({
                  defaultMessage: "Select a pool...",
                  id: "X198m3",
                  description:
                    "Placeholder displayed on the pool field of the add user to pool dialog.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={poolOptions}
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
