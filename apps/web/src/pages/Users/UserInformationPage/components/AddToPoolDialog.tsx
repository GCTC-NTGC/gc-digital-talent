import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import zipWith from "lodash/zipWith";
import { useMutation, useQuery } from "urql";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { DateInput } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import { currentDate } from "@gc-digital-talent/date-helpers";
import {
  emptyToNull,
  notEmpty,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import {
  graphql,
  PoolStatus,
  User,
  CreatePoolCandidateAsAdminInput,
  Pool,
  PoolCandidate,
  UserInfoFragment as UserInfoFragmentType,
} from "@gc-digital-talent/graphql";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import { getFullNameHtml } from "~/utils/nameUtils";
import PoolFilterInput from "~/components/PoolFilterInput/PoolFilterInput";

const AddToPoolDialog_Mutation = graphql(/* GraphQL */ `
  mutation AddToPoolDialog_Mutation(
    $poolCandidate: CreatePoolCandidateAsAdminInput!
  ) {
    createPoolCandidateAsAdmin(poolCandidate: $poolCandidate) {
      pool {
        id
      }
      user {
        id
      }
      expiryDate
      status {
        value
      }
    }
  }
`);

const AvailablePoolsToAddTo_Query = graphql(/* GraphQL */ `
  query AvailablePoolsToAddTo($where: PoolFilterInput, $excludeIds: [UUID!]) {
    poolsPaginated(where: $where, excludeIds: $excludeIds, first: 1000) {
      data {
        id
        publishingGroup {
          value
          label {
            en
            fr
          }
        }
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
        classification {
          id
          group
          level
        }
      }
    }
  }
`);

interface FormValues {
  pools: Pool["id"][];
  expiryDate: PoolCandidate["expiryDate"];
}

type UserInfoFragmentPoolCandidates =
  NonNullable<UserInfoFragmentType>["poolCandidates"];

interface AddToPoolDialogProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
  poolCandidates: UserInfoFragmentPoolCandidates;
}

const AddToPoolDialog = ({ user, poolCandidates }: AddToPoolDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const methods = useForm<FormValues>();
  const { id, firstName, lastName } = user;

  const [{ fetching }, executeMutation] = useMutation(AddToPoolDialog_Mutation);

  const currentPools: string[] = [];
  poolCandidates?.forEach((candidate) => {
    if (candidate?.pool?.id) {
      currentPools.push(candidate?.pool?.id);
    }
  });

  const [{ data: poolsData }] = useQuery({
    query: AvailablePoolsToAddTo_Query,
    variables: {
      where: { statuses: [PoolStatus.Closed, PoolStatus.Published] },
      excludeIds: currentPools,
    },
  });
  const poolsSafe = unpackMaybes(poolsData?.poolsPaginated.data);
  const poolMap = new Map(poolsSafe.map((pool) => [pool.id, pool]));

  const requestMutation = async (values: CreatePoolCandidateAsAdminInput) => {
    const result = await executeMutation({ poolCandidate: values });
    if (result.data?.createPoolCandidateAsAdmin) {
      return result.data.createPoolCandidateAsAdmin;
    }
    return Promise.reject(new Error(result.error?.toString()));
  };

  const submitForm: SubmitHandler<FormValues> = (formValues: FormValues) => {
    const poolsToUpdate = formValues.pools
      .map((poolId) => poolMap.get(poolId))
      .filter(notEmpty);

    const promises = poolsToUpdate.map(async (pool) => {
      return await requestMutation({
        pool: {
          connect: pool?.id,
        },
        user: {
          connect: id,
        },
        expiryDate: formValues.expiryDate ?? emptyToNull(formValues.expiryDate),
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
                    {getShortPoolTitleHtml(intl, {
                      workStream: rejected.pool.workStream,
                      name: rejected.pool.name,
                      publishingGroup: rejected.pool.publishingGroup,
                      classification: rejected.pool.classification,
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
        <Button color="secondary">
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
          {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
          <p data-h2-font-weight="base(800)">
            - {getFullNameHtml(firstName, lastName, intl)}
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
                <PoolFilterInput excludeIds={currentPools} />
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
                  rules={{
                    min: {
                      value: currentDate(),
                      message: intl.formatMessage(errorMessages.futureDate),
                    },
                  }}
                />
              </div>
              <Dialog.Footer>
                <Button disabled={fetching} type="submit" color="primary">
                  {fetching
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage({
                        defaultMessage: "Add to new pool",
                        id: "yypk6/",
                        description:
                          "Confirmation button for add to pool dialog",
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
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddToPoolDialog;
