import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "urql";
import { defineMessage, MessageDescriptor, useIntl } from "react-intl";

import {
  ApplicationStatus,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { Dialog, Notice, Pending } from "@gc-digital-talent/ui";
import { RadioGroup } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  errorMessages,
  formMessages,
  narrowEnumType,
  sortLocalizedEnumOptions,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import applicationMessages from "~/messages/applicationMessages";

import { ApplicationStatusFormProps, FormValues } from "./types";
import useApplicationStatusMutation from "./useApplicationStatusMutation";
import {
  DisqualifiedFields,
  QualifiedFields,
  RemovedFields,
} from "./StatusFields";
import ApplicationStatusDialogFooter from "./ApplicationStatusDialogFooter";
import StatusChangeNotice from "./StatusChangeNotice";

const ApplicationStatusFormOptions_Query = graphql(/** GraphQL */ `
  query ApplicationStatusFormOptions {
    ...QualifiedFieldsOptions
    ...DisqualifiedFieldsOptions
    ...RemovedFieldsOptions
    statuses: localizedEnumOptions(enumName: "ApplicationStatus") {
      ... on LocalizedApplicationStatus {
        value
        label {
          localized
        }
      }
    }
  }
`);

const statusMessageMap = new Map<ApplicationStatus, MessageDescriptor>([
  [
    ApplicationStatus.ToAssess,
    defineMessage({
      defaultMessage: "Candidate has not been fully assessed yet",
      id: "Mst3hH",
      description: "Description of the 'to assess' application status",
    }),
  ],
  [
    ApplicationStatus.Disqualified,
    defineMessage({
      defaultMessage: "Candidate did not pass a required assessment",
      id: "hOnqmx",
      description: "Description of the 'disqualified' application status",
    }),
  ],
  [
    ApplicationStatus.Removed,
    defineMessage({
      defaultMessage:
        "Candidate assessment was not completed for a technical reason",
      id: "10hx1y",
      description: "Description of the 'removed' application status",
    }),
  ],
  [
    ApplicationStatus.Qualified,
    defineMessage({
      defaultMessage: "Candidate passed all required assessments",
      id: "TyCRsf",
      description: "Description of the 'qualified' application status",
    }),
  ],
]);

const ToAssessStatusForm = ({ id, onSubmit }: ApplicationStatusFormProps) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues: {
      status: ApplicationStatus.ToAssess,
    },
  });

  const { submitStatusChange } = useApplicationStatusMutation();

  const [{ data, fetching, error }] = useQuery({
    query: ApplicationStatusFormOptions_Query,
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: Could not save application status",
        id: "pDHM6j",
        description: "Error message when status could not be updated",
      }),
    );
  };

  const handleSubmit = async (formValues: FormValues) => {
    await submitStatusChange(id, formValues)
      .then((res) => {
        if (res.error || !res.data) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Application status updated successfully!",
            id: "EYWt+5",
            description: "Success message when updating application status",
          }),
        );

        onSubmit?.();
      })
      .catch(handleError);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <Dialog.Body>
          <div className="flex flex-col gap-y-6">
            <Pending fetching={fetching} error={error} inline>
              <RadioGroup
                idPrefix="status"
                name="status"
                legend={intl.formatMessage(
                  applicationMessages.applicationStatus,
                )}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                items={sortLocalizedEnumOptions(
                  ENUM_SORT_ORDER.APPLICATION_STATUS,
                  narrowEnumType(
                    unpackMaybes(data?.statuses),
                    "ApplicationStatus",
                  ),
                )
                  .filter((status) => status.value !== ApplicationStatus.Draft)
                  .map((status) => ({
                    value: status.value,
                    label:
                      status.label?.localized ??
                      intl.formatMessage(commonMessages.notAvailable),
                    contentBelow: intl.formatMessage(
                      statusMessageMap.get(status.value) ??
                        commonMessages.notAvailable,
                    ),
                  }))}
              />
              {data && (
                <>
                  <QualifiedFields query={data} />
                  <DisqualifiedFields query={data} />
                  <RemovedFields query={data} />
                </>
              )}
            </Pending>
            <StatusChangeNotice />
          </div>
          <ApplicationStatusDialogFooter />
        </Dialog.Body>
      </form>
    </FormProvider>
  );
};

export default ToAssessStatusForm;
