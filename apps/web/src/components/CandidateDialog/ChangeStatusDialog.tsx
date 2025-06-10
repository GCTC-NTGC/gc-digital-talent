import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import zipWith from "lodash/zipWith";
import { useMutation, useQuery } from "urql";

import { Dialog, Button, Loading, Ul } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { Select, localizedEnumToOptions } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  PoolStatus,
  Pool,
  UpdatePoolCandidateStatusInput,
  graphql,
  PoolCandidateStatus,
  ChangeStatusDialog_UserFragment as ChangeStatusDialogUserFragmentType,
  FragmentType,
  getFragment,
  ChangeStatusDialog_PoolCandidateFragment as CandidateFragment,
} from "@gc-digital-talent/graphql";

import PoolFilterInput from "~/components/PoolFilterInput/PoolFilterInput";
import { getFullNameHtml } from "~/utils/nameUtils";
import {
  getShortPoolTitleHtml,
  getShortPoolTitleLabel,
} from "~/utils/poolUtils";

import UpdatePoolCandidateStatus_Mutation from "./mutation";

const ChangeStatusFormOptions_Fragment = graphql(/* GraphQL */ `
  fragment ChangeStatusFormOptions on Query {
    poolCandidateStatuses: localizedEnumStrings(
      enumName: "PoolCandidateStatus"
    ) {
      value
      label {
        en
        fr
      }
    }
  }
`);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChangeStatusDialog_UserFragment = graphql(/* GraphQL */ `
  fragment ChangeStatusDialog_User on User {
    firstName
    lastName
    poolCandidates {
      id
      status {
        value
        label {
          en
          fr
        }
      }
      expiryDate
      notes
      suspendedAt
      pool {
        id
        processNumber
        name {
          en
          fr
        }
        classification {
          id
          group
          level
        }
        workStream {
          id
          name {
            en
            fr
          }
        }
        publishingGroup {
          value
          label {
            en
            fr
          }
        }
      }
    }
  }
`);

interface FormValues {
  status: PoolCandidateStatus;
  additionalPools?: Pool["id"][];
}

export const ChangeStatusDialog_PoolCandidateFragment = graphql(/* GraphQL */ `
  fragment ChangeStatusDialog_PoolCandidate on PoolCandidate {
    id
    expiryDate
    status {
      value
      label {
        en
        fr
      }
    }
    pool {
      id
      workStream {
        id
        name {
          en
          fr
        }
      }
      name {
        en
        fr
      }
      publishingGroup {
        value
        label {
          en
          fr
        }
      }
      classification {
        id
        group
        level
      }
    }
  }
`);

interface ChangeStatusFormProps {
  selectedCandidate: CandidateFragment;
  optionsQuery?: FragmentType<typeof ChangeStatusFormOptions_Fragment>;
  user: ChangeStatusDialogUserFragmentType;
  onSubmit: () => void;
}

const ChangeStatusDialogForm = ({
  selectedCandidate,
  optionsQuery,
  onSubmit,
  user,
}: ChangeStatusFormProps) => {
  const intl = useIntl();
  const options = getFragment(ChangeStatusFormOptions_Fragment, optionsQuery);

  const methods = useForm<FormValues>({
    defaultValues: { status: selectedCandidate.status?.value },
  });

  const [{ fetching }, executeMutation] = useMutation(
    UpdatePoolCandidateStatus_Mutation,
  );

  // an array of the user's pool candidates and filter out all the nulls and maybes
  const userPoolCandidatesSafe = user.poolCandidates
    ? user.poolCandidates.filter(notEmpty).map((poolCandidate) => poolCandidate)
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
    return Promise.reject(new Error(result.error?.toString()));
  };

  const submitForm: SubmitHandler<FormValues> = (formValues: FormValues) => {
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
          onSubmit();
        } else {
          toast.error(
            <>
              {intl.formatMessage({
                defaultMessage: "Failed updating status",
                id: "BnSa6Y",
                description: "Toast for failed status update on view-user page",
              })}
              <Ul>
                {rejectedRequests.map((r) => (
                  <li key={r.poolCandidate.id}>
                    {getShortPoolTitleHtml(
                      intl,
                      {
                        workStream: r.poolCandidate.pool.workStream,
                        name: r.poolCandidate.pool.name,
                        publishingGroup: r.poolCandidate.pool.publishingGroup,
                        classification: r.poolCandidate.pool.classification,
                      },
                      {
                        defaultTitle: r.poolCandidate.id,
                      },
                    )}
                  </li>
                ))}
              </Ul>
            </>,
          );
        }
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
              defaultMessage: "Select a pool status",
              id: "Bkxf6p",
              description:
                "Placeholder displayed on the status field of the change candidate status dialog.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={localizedEnumToOptions(
              options?.poolCandidateStatuses,
              intl,
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
          <PoolFilterInput
            includeIds={userPoolIds}
            filterInput={{
              statuses: [PoolStatus.Closed, PoolStatus.Published],
            }}
            label={intl.formatMessage({
              defaultMessage: "Additional pools",
              id: "8V8WwR",
              description:
                "Label displayed on the additional pools field of the change candidate status dialog",
            })}
          />
        </div>
        <Dialog.Footer>
          <Button disabled={fetching} type="submit" color="primary">
            {fetching
              ? intl.formatMessage(commonMessages.saving)
              : intl.formatMessage({
                  defaultMessage: "Change status",
                  id: "iuve97",
                  description: "Confirmation button for change status dialog",
                })}
          </Button>
          <Dialog.Close>
            <Button type="button" color="warning" mode="inline">
              {intl.formatMessage(formMessages.cancelGoBack)}
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </form>
    </FormProvider>
  );
};

const ChangeStatusDialog_Query = graphql(/* GraphQL */ `
  query ChangeStatusDialog {
    ...ChangeStatusFormOptions
  }
`);

interface ChangeStatusDialogProps {
  selectedCandidateQuery: FragmentType<
    typeof ChangeStatusDialog_PoolCandidateFragment
  >;
  user: ChangeStatusDialogUserFragmentType;
}

const ChangeStatusDialog = ({
  selectedCandidateQuery,
  user,
}: ChangeStatusDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [{ data, fetching }] = useQuery({ query: ChangeStatusDialog_Query });
  const selectedCandidate = getFragment(
    ChangeStatusDialog_PoolCandidateFragment,
    selectedCandidateQuery,
  );
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="black" mode="inline" data-h2-padding="base(0)">
          <span data-h2-text-decoration="base(underline)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "{status}<hidden> Change status for {poolName}</hidden>",
                id: "DG4c6M",
                description:
                  "Button to change a users status in a pool - located in the table on view-user page",
              },
              {
                status: getLocalizedName(selectedCandidate.status?.label, intl),
                poolName: getShortPoolTitleLabel(intl, {
                  workStream: selectedCandidate.pool.workStream,
                  name: selectedCandidate.pool.name,
                  publishingGroup: selectedCandidate.pool.publishingGroup,
                  classification: selectedCandidate.pool.classification,
                }),
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
          {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
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
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
            {"- "}
            {getShortPoolTitleHtml(intl, {
              workStream: selectedCandidate.pool.workStream,
              name: selectedCandidate.pool.name,
              publishingGroup: selectedCandidate.pool.publishingGroup,
              classification: selectedCandidate.pool.classification,
            })}
          </p>
          {fetching ? (
            <Loading inline />
          ) : (
            <ChangeStatusDialogForm
              selectedCandidate={selectedCandidate}
              user={user}
              optionsQuery={data}
              onSubmit={() => setOpen(false)}
            />
          )}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ChangeStatusDialog;
