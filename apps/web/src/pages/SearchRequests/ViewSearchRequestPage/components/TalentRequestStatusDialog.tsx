import { useState, type ChangeEventHandler } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import PencilSquareIcon from "@heroicons/react/16/solid/PencilSquareIcon";
import { useMutation } from "urql";

import {
  type TalentRequestInProgressDetail,
  type TalentRequestCompletionDetail,
  type FragmentType,
  TalentRequestStatus,
} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  Button,
  Dialog,
  StatusButton,
  type StatusButtonProps,
} from "@gc-digital-talent/ui";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  errorMessages,
  formMessages,
  narrowEnumType,
  sortLocalizedEnumOptions,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { DateInput, RadioGroup, Select } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import talentRequestMessages from "~/messages/talentRequestMessages";

const COLOUR_MAP: Record<
  TalentRequestStatus | "default",
  StatusButtonProps["color"]
> = {
  [TalentRequestStatus.New]: "warning",
  [TalentRequestStatus.InProgress]: "primary",
  [TalentRequestStatus.Completed]: "black",
  default: "black",
} as const;

interface FormValues {
  talentRequestStatus: TalentRequestStatus;
  inProgressDetails?: TalentRequestInProgressDetail | null;
  completionDetails?: TalentRequestCompletionDetail | null;
  followUpDate?: string | null;
}

const UpdateTalentRequestStatus = graphql(/** GraphQL */ `
  mutation UpdatePoolCandidateSearchRequestStatus(
    $id: ID!
    $input: UpdatePoolCandidateSearchRequestStatusInput!
  ) {
    updatePoolCandidateSearchRequestStatus(
      id: $id
      poolCandidateSearchRequest: $input
    ) {
      id
    }
  }
`);

const TalentRequestStatusDialog_Fragment = graphql(/** GraphQL */ `
  fragment PoolCandidateSearchRequestStatusDialog on PoolCandidateSearchRequest {
    id
    talentRequestStatus {
      value
      label {
        localized
      }
    }
    inProgressDetails {
      value
    }
    completionDetails {
      value
    }
    followUpDate
  }
`);

export const TalentRequestStatusOptions_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestStatusOptions on Query {
    statuses: localizedEnumOptions(enumName: "TalentRequestStatus") {
      ... on LocalizedTalentRequestStatus {
        value
        label {
          localized
        }
      }
    }

    inProgressDetails: localizedEnumOptions(
      enumName: "TalentRequestInProgressDetail"
    ) {
      ... on LocalizedTalentRequestInProgressDetail {
        value
        label {
          localized
        }
      }
    }

    completionDetails: localizedEnumOptions(
      enumName: "TalentRequestCompletionDetail"
    ) {
      ... on LocalizedTalentRequestCompletionDetail {
        value
        label {
          localized
        }
      }
    }
  }
`);

export type TalentRequestStatusOptions = FragmentType<
  typeof TalentRequestStatusOptions_Fragment
>;

interface TalentRequestStatusDialogProps {
  query: FragmentType<typeof TalentRequestStatusDialog_Fragment>;
  optionsQuery?: TalentRequestStatusOptions;
}

const TalentRequestStatusDialog = ({
  query,
  optionsQuery,
}: TalentRequestStatusDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [{ fetching }, executeMutation] = useMutation(
    UpdateTalentRequestStatus,
  );
  const talentRequest = getFragment(TalentRequestStatusDialog_Fragment, query);
  const options = getFragment(
    TalentRequestStatusOptions_Fragment,
    optionsQuery,
  );
  const methods = useForm<FormValues>({
    defaultValues: {
      talentRequestStatus:
        talentRequest.talentRequestStatus?.value ??
        TalentRequestStatus.InProgress,
      inProgressDetails: talentRequest.inProgressDetails?.value,
      completionDetails: talentRequest.completionDetails?.value,
      followUpDate: talentRequest.followUpDate,
    },
  });
  const currentStatus = methods.watch("talentRequestStatus");
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const handleSubmit = async (values: FormValues) => {
    if (fetching) return;

    await executeMutation({
      id: talentRequest.id,
      input: {
        status: values.talentRequestStatus,
        inProgressDetails:
          values.talentRequestStatus === TalentRequestStatus.InProgress
            ? values.inProgressDetails
            : null,
        completionDetails:
          values.talentRequestStatus === TalentRequestStatus.Completed
            ? values.completionDetails
            : null,
        followUpDate:
          values.talentRequestStatus === TalentRequestStatus.InProgress
            ? values.followUpDate
            : null,
      },
    })
      .then((res) => {
        if (
          res.error ||
          !res.data?.updatePoolCandidateSearchRequestStatus?.id
        ) {
          throw new Error(res.error?.toString() ?? "Unknown error");
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Talent request updated successfully.",
            id: "b6mzab",
            description:
              "Message displayed after a talent requests status was updated",
          }),
        );

        methods.reset(values);
        setOpen(false);
      })
      .catch(() =>
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: Could not update talent request status",
            id: "L9xXMG",
            description:
              "Error message when attempting to update a talent request status",
          }),
        ),
      );
  };

  const handleFormChange: ChangeEventHandler<HTMLFormElement> = (e) => {
    if (e.target.type === "radio" && e.target.name === "talentRequestStatus") {
      const config = { shouldValidate: true, shouldDirty: true };
      methods.setValue("followUpDate", null, config);
      methods.setValue("inProgressDetails", null, config);
      methods.setValue("completionDetails", null, config);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <StatusButton
          color={
            COLOUR_MAP[talentRequest.talentRequestStatus?.value ?? "default"]
          }
          icon={PencilSquareIcon}
          block
        >
          {talentRequest.talentRequestStatus?.label?.localized ??
            intl.formatMessage(commonMessages.notAvailable)}
        </StatusButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Update request status",
            id: "7QwKdF",
            description: "Heading for updating a talent request status",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              onChange={handleFormChange}
            >
              <div className="flex flex-col gap-y-6">
                <RadioGroup
                  idPrefix="talentRequestStatus"
                  name="talentRequestStatus"
                  legend={intl.formatMessage({
                    defaultMessage: "Request status",
                    id: "mIffJX",
                    description: "Label for the request status input",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  items={sortLocalizedEnumOptions(
                    ENUM_SORT_ORDER.TALENT_REQUEST_STATUS,
                    narrowEnumType(
                      unpackMaybes(options?.statuses),
                      "TalentRequestStatus",
                    ),
                  )
                    .filter(
                      (status) => status.value !== TalentRequestStatus.New,
                    )
                    .map((status) => ({
                      value: status.value,
                      label: status.label?.localized ?? notAvailable,
                    }))}
                />
                {currentStatus === TalentRequestStatus.InProgress && (
                  <>
                    <Select
                      id="inProgressDetails"
                      name="inProgressDetails"
                      label={intl.formatMessage({
                        defaultMessage: "In-progress details",
                        id: "coi+kV",
                        description:
                          "Label for in-progress talent request details",
                      })}
                      nullSelection={intl.formatMessage(
                        uiMessages.nullSelectionOption,
                      )}
                      rules={{
                        required: intl.formatMessage(errorMessages.required),
                      }}
                      options={narrowEnumType(
                        unpackMaybes(options?.inProgressDetails),
                        "TalentRequestInProgressDetail",
                      ).map((detail) => ({
                        value: detail.value,
                        label: detail.label.localized ?? notAvailable,
                      }))}
                    />
                    <DateInput
                      id="followUpDate"
                      name="followUpDate"
                      legend={intl.formatMessage(
                        talentRequestMessages.followUpDate,
                      )}
                      round="floor"
                      rules={{
                        required: intl.formatMessage(errorMessages.required),
                      }}
                    />
                  </>
                )}
                {currentStatus === TalentRequestStatus.Completed && (
                  <Select
                    id="completionDetails"
                    name="completionDetails"
                    label={intl.formatMessage({
                      defaultMessage: "Completion details",
                      id: "B88lvt",
                      description: "Label for closed talent request details",
                    })}
                    nullSelection={intl.formatMessage(
                      uiMessages.nullSelectionOption,
                    )}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    options={narrowEnumType(
                      unpackMaybes(options?.completionDetails),
                      "TalentRequestCompletionDetail",
                    ).map((detail) => ({
                      value: detail.value,
                      label: detail.label.localized ?? notAvailable,
                    }))}
                  />
                )}
              </div>
              <Dialog.Footer>
                <Button type="submit">
                  {fetching
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage(formMessages.saveChanges)}
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

export default TalentRequestStatusDialog;
