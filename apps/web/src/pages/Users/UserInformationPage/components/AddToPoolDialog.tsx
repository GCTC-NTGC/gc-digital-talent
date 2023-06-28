import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import zipWith from "lodash/zipWith";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { DateInput, MultiSelectField } from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { emptyToNull, notEmpty } from "@gc-digital-talent/helpers";

import { getFullPoolTitleLabel, getFullPoolTitleHtml } from "~/utils/poolUtils";
import { getFullNameHtml } from "~/utils/nameUtils";
import {
  PoolStatus,
  Applicant,
  CreatePoolCandidateAsAdminInput,
  Pool,
  PoolCandidate,
  useCreatePoolCandidateMutation,
} from "~/api/generated";
import adminMessages from "~/messages/adminMessages";

type FormValues = {
  pools: Array<Pool["id"]>;
  expiryDate: PoolCandidate["expiryDate"];
};

export interface AddToPoolDialogProps {
  user: Applicant;
  pools: Pool[];
}

const AddToPoolDialog = ({ user, pools }: AddToPoolDialogProps) => {
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

  const poolsSafe = pools ? pools.filter(notEmpty) : [];
  const poolMap = new Map(poolsSafe.map((pool) => [pool.id, pool]));

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
    const poolsToUpdate = formValues.pools
      .map((poolId) => poolMap.get(poolId))
      .filter(notEmpty);

    const promises = poolsToUpdate.map((pool) => {
      return requestMutation({
        pool: {
          connect: pool?.id,
        },
        user: {
          connect: user.id,
        },
        expiryDate: formValues.expiryDate || emptyToNull(formValues.expiryDate),
      }).catch((err) => {
        throw err;
      });
    });

    Promise.allSettled(promises)
      .then((settledResults) => {
        const requestsWithResults = zipWith(
          poolsToUpdate,
          settledResults,
          (pool, settledResult) => {
            return {
              pool,
              settledResult,
            };
          },
        );
        const rejectedRequests = requestsWithResults.filter(
          (r) => r.settledResult.status === "rejected",
        );

        if (!rejectedRequests.length) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "User added successfully",
              id: "O8U5Sz",
              description:
                "Toast for successful add user to pool on view-user page",
            }),
          );
        } else {
          toast.error(
            <>
              {intl.formatMessage({
                defaultMessage: "Failed to add user to the following pools:",
                id: "6Y6hy9",
                description:
                  "Error message displayed when an attempt to add users to known pools",
              })}
              <ul>
                {rejectedRequests.map((rejected) => (
                  <li key={rejected.pool.id}>
                    {getFullPoolTitleHtml(intl, rejected.pool)}
                  </li>
                ))}
              </ul>
            </>,
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
        pool.status === PoolStatus.Published ||
        pool.status === PoolStatus.Closed,
    )
    .map((pool) => {
      return {
        value: pool.id,
        label: getFullPoolTitleLabel(intl, pool),
      };
    });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="primary">
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
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Add user to pool",
            id: "bqaNWT",
            description: "title for add to pool dialog on view-user page",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You're about to add this user to a different pool:",
              id: "8Y+eEc",
              description:
                "First section of text on the add user to pool dialog",
            })}
          </p>
          <p data-h2-font-weight="base(800)">
            - {getFullNameHtml(user.firstName, user.lastName, intl)}
          </p>
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
                <MultiSelectField
                  id="addToPoolDialog-pools"
                  name="pools"
                  label={intl.formatMessage(adminMessages.pools)}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Select a pool",
                    id: "Rm4SuQ",
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
                <DateInput
                  id="addToPoolDialog-expiryDate"
                  legend={intl.formatMessage({
                    defaultMessage: "Expiry date",
                    id: "sICXeM",
                    description:
                      "Label displayed on the date field of the add user to pool dialog",
                  })}
                  name="expiryDate"
                  // DateInput min validation doesn't work with optional inputs. #7137
                />
              </div>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button type="button" color="secondary">
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
                        description:
                          "Confirmation button for add to pool dialog",
                      })}
                    </span>
                  )}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddToPoolDialog;
