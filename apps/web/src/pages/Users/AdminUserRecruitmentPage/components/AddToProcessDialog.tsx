import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "urql";

import { Dialog, Button, Notice } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { Select } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  PoolStatus,
  FragmentType,
  getFragment,
  Scalars,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getFullNameLabel } from "~/utils/nameUtils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getShortPoolTitleLabel } from "~/utils/poolUtils";

const AddToProcessDialog_Mutation = graphql(/* GraphQL */ `
  mutation AddToProcessDialog_Mutation(
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

const AvailableProcessesToAddTo_Query = graphql(/* GraphQL */ `
  query AvailableProcessesToAddTo(
    $where: PoolFilterInput
    $excludeIds: [UUID!]
  ) {
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

const AddToProcessDialog_Fragment = graphql(/** GraphQL */ `
  fragment AddToProcessDialog on User {
    id
    firstName
    lastName
    email
    poolCandidates {
      pool {
        id
      }
    }
  }
`);

interface FormValues {
  pool: Scalars["UUID"]["input"];
  expiryDate: Scalars["Date"]["input"];
}

interface AddToProcessDialogProps {
  query?: FragmentType<typeof AddToProcessDialog_Fragment>;
}

const AddToProcessDialog = ({ query }: AddToProcessDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const methods = useForm<FormValues>();
  const user = getFragment(AddToProcessDialog_Fragment, query);

  const [{ fetching }, executeMutation] = useMutation(
    AddToProcessDialog_Mutation,
  );

  const currentPools = unpackMaybes(user?.poolCandidates).flatMap(
    (candidate) => candidate.pool.id,
  );

  const [{ data }] = useQuery({
    query: AvailableProcessesToAddTo_Query,
    variables: {
      where: { statuses: [PoolStatus.Closed, PoolStatus.Published] },
      excludeIds: currentPools,
    },
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to add user to process.",
        id: "3EI6TE",
        description:
          "Error message displayed when an attempt to add users to known pools",
      }),
    );
  };

  const handleSubmit: SubmitHandler<FormValues> = async ({
    pool,
    expiryDate,
  }: FormValues) => {
    if (fetching) return;

    if (!user?.id) {
      handleError();
      return;
    }

    await executeMutation({
      poolCandidate: {
        pool: { connect: pool },
        expiryDate,
        user: { connect: user.id },
      },
    }).then((res) => {
      if (res.error || !res.data?.createPoolCandidateAsAdmin) {
        handleError();
        return;
      }

      toast.success(
        intl.formatMessage({
          defaultMessage: "User added successfully",
          id: "O8U5Sz",
          description:
            "Toast for successful add user to pool on view-user page",
        }),
      );
    });
  };

  const fullName = getFullNameLabel(user?.firstName, user?.lastName, intl);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="error">
          {intl.formatMessage({
            defaultMessage: "Add user to process",
            id: "1XiWQu",
            description: "Button text to add a user to a process",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(
            {
              defaultMessage: "Add {name} to recruitment process",
              id: "KqodT+",
              description: "Title for adding user to a process",
            },
            { name: fullName },
          )}
        </Dialog.Header>
        <Dialog.Body>
          <Notice.Root color="error" mode="card">
            <Notice.Title defaultIcon>
              {intl.formatMessage({
                defaultMessage:
                  "Only perform this action after having confirmed the user’s identity and verified that adding them to this process is in compliance with HR policy rules.",
                id: "/wMGW+",
                description:
                  "Warning about adding a user to a process manually",
              })}
            </Notice.Title>
          </Notice.Root>
          <Notice.Root className="my-6 flex flex-col gap-6">
            <Notice.Content>
              <FieldDisplay label={intl.formatMessage(commonMessages.name)}>
                {fullName}
              </FieldDisplay>
              <FieldDisplay label={intl.formatMessage(commonMessages.email)}>
                {user?.email ?? intl.formatMessage(commonMessages.notProvided)}
              </FieldDisplay>
            </Notice.Content>
          </Notice.Root>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <Select
                id="pool"
                name="pool"
                label={intl.formatMessage(
                  navigationMessages.recruitmentProcesses,
                )}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a recruitment process",
                  id: "eXBqXJ",
                  description: "Placeholder value for process selection input",
                })}
                options={unpackMaybes(data?.poolsPaginated.data).map(
                  (pool) => ({
                    value: pool.id,
                    label: getShortPoolTitleLabel(intl, {
                      workStream: pool.workStream,
                      name: pool.name,
                      publishingGroup: pool.publishingGroup,
                      classification: pool.classification,
                    }),
                  }),
                )}
              />
              <Dialog.Footer>
                <Button disabled={fetching} type="submit" color="error">
                  {fetching
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage({
                        defaultMessage: "Add user to recruitment process",
                        id: "1M398Y",
                        description:
                          "Submit button text for adding user to process",
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

export default AddToProcessDialog;
