import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import zipWith from "lodash/zipWith";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import {
  Select,
  enumToOptions,
  MultiSelectField,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  getPoolCandidateStatus,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import { getFullNameHtml } from "~/utils/nameUtils";
import {
  getFullPoolAdvertisementTitleHtml,
  getFullPoolAdvertisementTitleLabel,
} from "~/utils/poolUtils";
import {
  AdvertisementStatus,
  Applicant,
  Pool,
  PoolCandidate,
  PoolCandidateStatus,
  UpdatePoolCandidateAsAdminInput,
  useUpdatePoolCandidateMutation,
} from "~/api/generated";

type FormValues = {
  status: PoolCandidate["status"];
  additionalPools?: Pool["id"][];
};

export interface ChangeStatusDialogProps {
  selectedCandidate: PoolCandidate;
  user: Applicant;
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

  const [{ fetching }, executeMutation] = useUpdatePoolCandidateMutation();

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
    values: UpdatePoolCandidateAsAdminInput,
  ) => {
    const result = await executeMutation({ id, poolCandidate: values });
    if (result.data?.updatePoolCandidateAsAdmin) {
      return result.data.updatePoolCandidateAsAdmin;
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
                    {getFullPoolAdvertisementTitleHtml(
                      intl,
                      r.poolCandidate.pool,
                      {
                        defaultTitle: r.poolCandidate.id,
                      },
                    )}
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
            {intl.formatMessage({
              defaultMessage: "Change status",
              id: "bl7pCx",
              description:
                "Button to change a users status in a pool - located in the table on view-user page",
            })}
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
          <p data-h2-font-weight="base(700)">
            - {getFullNameHtml(user.firstName, user.lastName, intl)}
          </p>
          <p data-h2-margin="base(x1, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage: "From the following pool:",
              id: "FUxE8S",
              description:
                "Second section of text on the change candidate status dialog",
            })}
          </p>
          <p data-h2-font-weight="base(700)">
            - {getFullPoolAdvertisementTitleHtml(intl, selectedCandidate?.pool)}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitForm)}>
              <p data-h2-margin="base(x1, 0, 0, 0)">
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
                    defaultMessage: "Select a pool status...",
                    id: "usNShh",
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
              <p data-h2-margin="base(x1, 0, 0, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "If you want this status to change across multiple pools, select them here:",
                  id: "wiUfZL",
                  description:
                    "Header for section to add additional pools to the change status operation",
                })}
              </p>
              <div data-h2-margin="base(x.5, 0, x.125, 0)">
                <MultiSelectField
                  id="changeStatusDialog-additionalPools"
                  name="additionalPools"
                  label={intl.formatMessage({
                    defaultMessage: "Additional pools",
                    id: "8V8WwR",
                    description:
                      "Label displayed on the additional pools field of the change candidate status dialog",
                  })}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Select additional pools...",
                    id: "vtXnOQ",
                    description:
                      "Placeholder displayed on the additional pools field of the change candidate status dialog.",
                  })}
                  options={pools
                    .filter((pool) => userPoolIds.includes(pool.id)) // only show pools with user's candidates in them
                    .filter((pool) => selectedCandidate.pool.id !== pool.id) // don't show the pool of the currently selected candidate as an additional option
                    .filter(
                      (pool) =>
                        pool.advertisementStatus ===
                          AdvertisementStatus.Published ||
                        pool.advertisementStatus === AdvertisementStatus.Closed,
                    )
                    .map((pool) => {
                      return {
                        value: pool.id,
                        label: getFullPoolAdvertisementTitleLabel(intl, pool),
                      };
                    })}
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
