import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import zipWith from "lodash/zipWith";
import { useMutation } from "urql";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { Select, enumToOptions, Combobox } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  PoolStatus,
  User,
  Pool,
  PoolCandidate,
  PoolCandidateStatus,
  UpdatePoolCandidateStatusInput,
} from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";
import {
  getShortPoolTitleHtml,
  getShortPoolTitleLabel,
} from "~/utils/poolUtils";

import UpdatePoolCandidateStatus_Mutation from "./mutation";

type FormValues = {
  status: PoolCandidate["status"];
  additionalPools?: Pool["id"][];
};

interface ChangeStatusDialogProps {
  selectedCandidate: PoolCandidate;
  user: User;
  pools: Pool[];
}

const ChangeStatusDialog = ({
  selectedCandidate,
  user,
  pools,
}: ChangeStatusDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = React.useState(false);
  const methods = useForm<FormValues>();

  const [{ fetching }, executeMutation] = useMutation(
    UpdatePoolCandidateStatus_Mutation,
  );

  // an array of the user's pool candidates and filter out all the nulls and maybes
  const userPoolCandidatesSafe = user.poolCandidates
    ? user.poolCandidates.filter(notEmpty).map((poolCandidate) => {
        return poolCandidate;
      })
    : [];

  // all the user's pools by pool ID
  const userPools = new Map(
    userPoolCandidatesSafe.map((poolCandidate) => [
      poolCandidate.pool.id,
      {
        poolCandidate,
        pool: poolCandidate.pool,
      },
    ]),
  );

  // all the user's pool IDs
  const userPoolIds = userPoolCandidatesSafe.map(
    (poolCandidate) => poolCandidate.pool.id,
  );

  const requestMutation = async (
    id: string,
    values: UpdatePoolCandidateStatusInput,
  ) => {
    const result = await executeMutation({ id, poolCandidate: values });
    if (result.data?.updatePoolCandidateStatus) {
      return result.data.updatePoolCandidateStatus;
    }
    return Promise.reject(result.error);
  };

  const submitForm: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    // we need to update the original pool candidate, and possibly additional ones from other pools
    const poolCandidatesToUpdate = [
      selectedCandidate,
      ...(formValues.additionalPools ?? []).map(
        (poolId) => userPools.get(poolId)?.poolCandidate,
      ),
    ].filter(notEmpty);

    // fire off all the mutations
    const promises = poolCandidatesToUpdate.map((poolCandidate) => {
      return requestMutation(poolCandidate.id, {
        status: formValues.status,
      });
    });

    // wait for all the mutations to finish
    Promise.allSettled(promises)
      .then((settledResults) => {
        // attach the promise results to the original pool candidates that were mutated
        const requestsWithResults = zipWith(
          poolCandidatesToUpdate,
          settledResults,
          (poolCandidate, settledResult) => {
            return {
              poolCandidate,
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
              defaultMessage: "Status updated successfully",
              id: "nYriNg",
              description:
                "Toast for successful status update on view-user page",
            }),
          );
        } else {
          toast.error(
            <>
              {intl.formatMessage({
                defaultMessage: "Failed updating status",
                id: "BnSa6Y",
                description: "Toast for failed status update on view-user page",
              })}
              <ul>
                {rejectedRequests.map((r) => (
                  <li key={r.poolCandidate.id}>
                    {getShortPoolTitleHtml(intl, r.poolCandidate.pool, {
                      defaultTitle: r.poolCandidate.id,
                    })}
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
            defaultMessage: "Failed updating status",
            id: "BnSa6Y",
            description: "Toast for failed status update on view-user page",
          }),
        );
      });
  };
  const { handleSubmit } = methods;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="black" mode="inline" data-h2-padding="base(0)">
          <span data-h2-text-decoration="base(underline)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "{status} <hidden>Change status for {poolName}</hidden>",
                id: "QJPsGW",
                description:
                  "Button to change a users status in a pool - located in the table on view-user page",
              },
              {
                status: intl.formatMessage(
                  getPoolCandidateStatus(selectedCandidate.status as string),
                ),
                poolName: getShortPoolTitleLabel(intl, selectedCandidate?.pool),
              },
            )}
          </span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Change status",
            id: "SARjte",
            description: "title for change status dialog on view-user page",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage({
              defaultMessage: "You're about to change status for this user:",
              id: "p+YRN1",
              description:
                "First section of text on the change candidate status dialog",
            })}
          </p>
          <p className="font-bold">
            - {getFullNameHtml(user.firstName, user.lastName, intl)}
          </p>
          <p className="mt-6">
            {intl.formatMessage({
              defaultMessage: "From the following pool:",
              id: "FUxE8S",
              description:
                "Second section of text on the change candidate status dialog",
            })}
          </p>
          <p className="font-bold">
            - {getShortPoolTitleHtml(intl, selectedCandidate?.pool)}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitForm)}>
              <p className="mt-6">
                {intl.formatMessage({
                  defaultMessage: "Choose status:",
                  id: "Zbk4zf",
                  description:
                    "Third section of text on the change candidate status dialog",
                })}
              </p>
              <div data-h2-margin="base(x.5, 0, x.125, 0)">
                <Select
                  id="changeStatusDialog-status"
                  name="status"
                  label={intl.formatMessage({
                    defaultMessage: "Pool status",
                    id: "n9YPWe",
                    description:
                      "Label displayed on the status field of the change candidate status dialog",
                  })}
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a pool status",
                    id: "Bkxf6p",
                    description:
                      "Placeholder displayed on the status field of the change candidate status dialog.",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  options={enumToOptions(PoolCandidateStatus).map(
                    ({ value }) => ({
                      value,
                      label: intl.formatMessage(getPoolCandidateStatus(value)),
                    }),
                  )}
                />
              </div>
              <p className="mt-6">
                {intl.formatMessage({
                  defaultMessage:
                    "If you want this status to change across multiple pools, select them here:",
                  id: "wiUfZL",
                  description:
                    "Header for section to add additional pools to the change status operation",
                })}
              </p>
              <div data-h2-margin="base(x.5, 0, x.125, 0)">
                <Combobox
                  id="changeStatusDialog-additionalPools"
                  name="additionalPools"
                  isMulti
                  label={intl.formatMessage({
                    defaultMessage: "Additional pools",
                    id: "8V8WwR",
                    description:
                      "Label displayed on the additional pools field of the change candidate status dialog",
                  })}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Select additional pools",
                    id: "xjZO11",
                    description:
                      "Placeholder displayed on the additional pools field of the change candidate status dialog.",
                  })}
                  options={pools
                    .filter((pool) => userPoolIds.includes(pool.id)) // only show pools with user's candidates in them
                    .filter((pool) => selectedCandidate.pool.id !== pool.id) // don't show the pool of the currently selected candidate as an additional option
                    .filter(
                      (pool) =>
                        pool.status === PoolStatus.Published ||
                        pool.status === PoolStatus.Closed,
                    )
                    .map((pool) => {
                      return {
                        value: pool.id,
                        label: getShortPoolTitleLabel(intl, pool),
                      };
                    })}
                />
              </div>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button type="button" color="secondary">
                    <span data-h2-text-decoration="base(underline)">
                      {intl.formatMessage(formMessages.cancelGoBack)}
                    </span>
                  </Button>
                </Dialog.Close>

                <Button
                  disabled={fetching}
                  type="submit"
                  mode="solid"
                  color="secondary"
                  className="flex"
                  data-h2-align-items="base(center)"
                >
                  {fetching ? (
                    intl.formatMessage(commonMessages.saving)
                  ) : (
                    <span data-h2-text-decoration="base(underline)">
                      {intl.formatMessage({
                        defaultMessage: "Change status",
                        id: "iuve97",
                        description:
                          "Confirmation button for change status dialog",
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

export default ChangeStatusDialog;
