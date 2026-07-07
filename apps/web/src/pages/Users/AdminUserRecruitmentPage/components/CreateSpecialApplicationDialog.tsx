import { useState } from "react";
import { useIntl } from "react-intl";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "urql";

import { Dialog, Button, Notice } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { DateInput, Select, TextArea } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocale,
  navigationMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { graphql, PoolStatus, getFragment } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { strToFormDate } from "@gc-digital-talent/date-helpers";

import { getFullNameLabel } from "~/utils/nameUtils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getShortPoolTitleLabel } from "~/utils/poolUtils";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import {
  createSpecialApplicationDialogFormValuesToSubmitData,
  type CreateSpecialApplicationDialogFormValues as FormValues,
} from "./utils";

const CreateSpecialApplicationDialog_Mutation = graphql(/* GraphQL */ `
  mutation CreateSpecialApplicationDialog(
    $poolCandidate: CreateSpecialApplicationInput!
  ) {
    createSpecialApplication(poolCandidate: $poolCandidate) {
      id
      applicationStatusData {
        status {
          value
        }
      }
    }
  }
`);

const CreateSpecialApplicationDialogOptions_Query = graphql(/* GraphQL */ `
  query CreateSpecialApplicationDialogOptions(
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
          groupAndLevel
        }
      }
    }
    specialApplicationTypes: localizedEnumStrings(
      enumName: "SpecialApplicationType"
    ) {
      value
      label {
        localized
      }
    }
  }
`);

const CreateSpecialApplicationDialogUser_Fragment = graphql(/** GraphQL */ `
  fragment CreateSpecialApplicationDialogUser on User {
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

interface AddToProcessDialogProps {
  query?: FragmentType<typeof CreateSpecialApplicationDialogUser_Fragment>;
}

const CreateSpecialApplicationDialog = ({ query }: AddToProcessDialogProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const [open, setOpen] = useState(false);
  const methods = useForm<FormValues>();
  const user = getFragment(CreateSpecialApplicationDialogUser_Fragment, query);

  const [{ fetching }, executeMutation] = useMutation(
    CreateSpecialApplicationDialog_Mutation,
  );

  const currentPools = unpackMaybes(user?.poolCandidates).flatMap(
    (candidate) => candidate.pool.id,
  );

  const [{ data }] = useQuery({
    query: CreateSpecialApplicationDialogOptions_Query,
    variables: {
      where: { statuses: [PoolStatus.Closed, PoolStatus.Published] },
      excludeIds: currentPools,
    },
  });

  const poolOptions = unpackMaybes(data?.poolsPaginated.data).map((pool) => ({
    value: pool.id,
    label: getShortPoolTitleLabel(intl, {
      workStream: pool.workStream,
      name: pool.name,
      publishingGroup: pool.publishingGroup,
      classification: pool.classification,
    }),
  }));

  const specialApplicationTypeOptions = unpackMaybes(
    data?.specialApplicationTypes,
  ).map((item) => ({
    value: item.value,
    label: item.label.localized ?? intl.formatMessage(commonMessages.notFound),
  }));

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

  const handleSubmit: SubmitHandler<FormValues> = async (
    values: FormValues,
  ) => {
    if (fetching) return;

    if (!user?.id) {
      handleError();
      return;
    }

    const apiInput = createSpecialApplicationDialogFormValuesToSubmitData(
      user.id,
      values,
    );

    await executeMutation({
      poolCandidate: apiInput,
    }).then((res) => {
      if (res.error || !res.data?.createSpecialApplication) {
        handleError();
        return;
      }

      setOpen(false);

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
  const todayDate = new Date();
  const TEXT_AREA_MAX_WORDS_EN = 200;
  const TEXT_AREA_MAX_WORDS_FR = Math.round(
    TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD,
  );

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
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Add a draft application to a recruitment process on behalf of this user.",
            id: "7tIB6E",
            description: "Title for adding user to a process",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Create special application",
            id: "IS8OFH",
            description: "Title for adding user to a process",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <Notice.Root color="warning">
            <Notice.Title defaultIcon as="h2">
              {intl.formatMessage(commonMessages.important)}
            </Notice.Title>
            <Notice.Content>
              {intl.formatMessage({
                defaultMessage:
                  "Only perform this action after having confirmed the user’s identity and verified that adding them to this process is in compliance with HR policy rules.",
                id: "/wMGW+",
                description:
                  "Warning about adding a user to a process manually",
              })}
            </Notice.Content>
          </Notice.Root>
          <p className="mt-5 text-base font-bold text-black dark:text-white">
            {intl.formatMessage({
              defaultMessage: "User details",
              id: "ZTvxKE",
              description: "Abc",
            })}
            {intl.formatMessage(commonMessages.dividingColon)}
          </p>
          <Notice.Root className="mt-1.5 mb-6 flex flex-col gap-6">
            <Notice.Content>
              <FieldDisplay
                className="mb-3"
                label={intl.formatMessage(commonMessages.name)}
              >
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
                className="mb-6"
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
                options={poolOptions}
              />
              <DateInput
                className="mb-6"
                id="specialApplicationClosingDate"
                name="specialApplicationClosingDate"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                  min: {
                    value: strToFormDate(todayDate.toISOString()),
                    message: intl.formatMessage(errorMessages.futureDate),
                  },
                }}
                legend={intl.formatMessage({
                  defaultMessage: "Extended closing date",
                  id: "9sStNh",
                  description: "Abc",
                })}
              />
              <Select
                className="mb-6"
                id="specialApplicationType"
                label={intl.formatMessage({
                  defaultMessage: "Type of special application",
                  id: "RVp8s8",
                  description: "Abc",
                })}
                name="specialApplicationType"
                nullSelection={intl.formatMessage(
                  uiMessages.nullSelectionOption,
                )}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={specialApplicationTypeOptions}
              />
              <TextArea
                id="specialApplicationJustification"
                name="specialApplicationJustification"
                label={intl.formatMessage({
                  defaultMessage: "Justification",
                  id: "Yy+JXc",
                  description:
                    "Label for justification radio group in the screening decision dialog.",
                })}
                rows={3}
                wordLimit={
                  locale === "en"
                    ? TEXT_AREA_MAX_WORDS_EN
                    : TEXT_AREA_MAX_WORDS_FR
                }
                rules={{ required: intl.formatMessage(errorMessages.required) }}
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

export default CreateSpecialApplicationDialog;
