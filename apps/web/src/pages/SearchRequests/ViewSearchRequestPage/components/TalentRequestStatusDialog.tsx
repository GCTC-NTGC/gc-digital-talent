import { useState, type ChangeEventHandler } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import PencilSquareIcon from "@heroicons/react/16/solid/PencilSquareIcon";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { Button, Dialog, StatusButton } from "@gc-digital-talent/ui";
import {
  commonMessages,
  errorMessages,
  formMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { DateInput, RadioGroup, Select } from "@gc-digital-talent/forms";

import talentRequestMessages from "~/messages/talentRequestMessages";

interface FormValues {
  talentRequestStatus?: string;
  inProgressDetails?: string | null;
  closedDetails?: string | null;
  followUpDate?: string | null;
}

const TalentRequestStatusDialog_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestStatusDialog on PoolCandidateSearchRequest {
    status {
      value
      label {
        localized
      }
    }
  }
`);

interface TalentRequestStatusDialogProps {
  query: FragmentType<typeof TalentRequestStatusDialog_Fragment>;
}

const TalentRequestStatusDialog = ({
  query,
}: TalentRequestStatusDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);
  const talentRequest = getFragment(TalentRequestStatusDialog_Fragment, query);
  const methods = useForm<FormValues>({
    defaultValues: {},
  });
  const currentStatus = methods.watch("talentRequestStatus");

  const handleSubmit = async (values: FormValues) => {
    toast.success(
      intl.formatMessage({
        defaultMessage: "Talent request updated successfully.",
        id: "b6mzab",
        description:
          "Message displayed after a talent requests status was updated",
      }),
    );
  };

  const handleFormChange: ChangeEventHandler<HTMLFormElement> = (e) => {
    if (e.target.type === "radio" && e.target.name === "talentRequestStatus") {
      const config = { shouldValidate: true, shouldDirty: true };
      methods.setValue("followUpDate", null, config);
      methods.setValue("inProgressDetails", null, config);
      methods.setValue("closedDetails", null, config);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <StatusButton color="warning" icon={PencilSquareIcon} block>
          {talentRequest.status?.label?.localized ??
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
                  items={[
                    {
                      value: "IN_PROGRESS",
                      label: "In progress",
                    },
                    {
                      value: "CLOSED",
                      label: "Closed",
                    },
                  ]}
                />
                {currentStatus === "IN_PROGRESS" && (
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
                      options={[]}
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
                {currentStatus === "CLOSED" && (
                  <Select
                    id="closedDetails"
                    name="closedDetails"
                    label={intl.formatMessage({
                      defaultMessage: "Closed details",
                      id: "xxiQ9n",
                      description:
                        "Label for in-progress talent request details",
                    })}
                    nullSelection={intl.formatMessage(
                      uiMessages.nullSelectionOption,
                    )}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    options={[]}
                  />
                )}
              </div>
              <Dialog.Footer>
                <Button type="submit">
                  {intl.formatMessage(formMessages.saveChanges)}
                </Button>
                <Dialog.Close>
                  <Button color="warning" mode="inline">
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
