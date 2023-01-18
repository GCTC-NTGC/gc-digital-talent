import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "@common/components/Toast";
import { Input, Select, Submit, TextArea } from "@common/components/form";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import Heading from "@common/components/Heading";
import Well from "@common/components/Well";
import { CalendarIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { enumToOptions } from "@common/helpers/formUtils";
import { getPoolCandidateStatus } from "@common/constants/localizedConstants";
import { strToFormDate } from "@common/helpers/dateUtils";
import { commonMessages } from "@common/messages";
import { emptyToNull } from "@common/helpers/util";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import {
  PoolCandidateStatus,
  Scalars,
  UpdatePoolCandidateAsAdminInput,
  useGetPoolCandidateStatusQuery,
  useUpdatePoolCandidateStatusMutation,
  type PoolCandidate,
} from "../../../api/generated";

export type FormValues = {
  status?: PoolCandidate["status"];
  notes?: PoolCandidate["notes"];
  expiryDate?: PoolCandidate["expiryDate"];
};

export interface ApplicationStatusFormProps {
  isSubmitting: boolean;
  application: Omit<PoolCandidate, "user">;
  onSubmit: (values: UpdatePoolCandidateAsAdminInput) => void;
}

export const ApplicationStatusForm = ({
  application,
  onSubmit,
  isSubmitting,
}: ApplicationStatusFormProps) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues: {
      status: application.status ?? undefined,
      notes: application.notes ?? "",
      expiryDate: application.expiryDate
        ? strToFormDate(application.expiryDate)
        : undefined,
    },
  });
  const { handleSubmit } = methods;

  const handleFormSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    onSubmit({
      status: values.status,
      notes: values.notes,
      expiryDate: values.expiryDate || emptyToNull(values.expiryDate),
    });

    // recycle the field reset from Eric in UpdateSearchRequest.tsx
    methods.resetField("status", {
      keepDirty: false,
      defaultValue: values.status,
    });
    methods.resetField("notes", {
      keepDirty: false,
      defaultValue: values.notes,
    });
    methods.resetField("expiryDate", {
      keepDirty: false,
      defaultValue: values.expiryDate,
    });
  };

  const allowedStatuses = enumToOptions(PoolCandidateStatus).filter(
    ({ value }) => {
      return (
        value !== PoolCandidateStatus.Draft &&
        value !== PoolCandidateStatus.DraftExpired &&
        value !== PoolCandidateStatus.Expired
      );
    },
  );

  return (
    <div data-h2-width="base(100%)">
      <Heading
        level="h2"
        data-h2-font-size="base(h5)"
        data-h2-font-weight="base(400)"
        data-h2-margin="base(x1, 0, 0, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "Application status",
          id: "/s66sg",
          description: "Title for admins to edit an applications status.",
        })}
      </Heading>
      <Well>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Heading
              level="h3"
              data-h2-font-size="base(h6)"
              data-h2-margin="base(0, 0, x0.25, 0)"
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-gap="base(x0.25, 0)"
            >
              <CalendarIcon
                data-h2-width="base(0.75em)"
                data-h2-height="base(0.75em)"
                data-h2-margin="base(0, x0.25, 0, 0)"
              />
              <span>
                {intl.formatMessage({
                  defaultMessage: "Candidate status",
                  id: "ETrCOq",
                  description:
                    "Title for admin editing a pool candidates status",
                })}
              </span>
            </Heading>
            <Select
              label={intl.formatMessage({
                defaultMessage: "Candidate pool status",
                id: "/pHz5L",
                description: "Label for the current applications pool status",
              })}
              required
              rules={{ required: true }}
              id="status"
              name="status"
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a status",
                id: "VMhVyJ",
                description: "Placeholder text for the pool status field",
              })}
              options={allowedStatuses.map(({ value }) => ({
                value,
                label: intl.formatMessage(getPoolCandidateStatus(value)),
              }))}
            />
            <Input
              id="expiryDate"
              name="expiryDate"
              label={intl.formatMessage({
                defaultMessage: "Candidate expiry date",
                id: "SoKPAb",
                description:
                  "Label displayed on the pool candidate application form expiry date field.",
              })}
              type="date"
            />
            <Heading
              level="h3"
              data-h2-font-size="base(h6)"
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
            >
              <PencilSquareIcon
                data-h2-width="base(0.75em)"
                data-h2-height="base(0.75em)"
                data-h2-margin="base(0, x0.25, 0, 0)"
              />
              <span>
                {intl.formatMessage({
                  defaultMessage: "Notes",
                  id: "npC3bT",
                  description:
                    "Title for admin editing a pool candidates notes",
                })}
              </span>
            </Heading>
            <p data-h2-margin="base(x0.5, 0, x0.5, 0)">
              {intl.formatMessage({
                id: "zLvpBy",
                defaultMessage:
                  "These notes are shared between all managers of this pool, but not to candidates.",
                description: "Description of the pool candidate notes field.",
              })}
            </p>
            <TextArea
              id="notes"
              name="notes"
              label={intl.formatMessage(
                {
                  defaultMessage: "Notes - {poolName}",
                  id: "Yr4DW5",
                  description:
                    "Label for the notes field on the pool candidate application",
                },
                {
                  poolName: getFullPoolAdvertisementTitle(
                    intl,
                    application.pool,
                  ),
                },
              )}
            />
            <Submit
              color="cta"
              isSubmitting={isSubmitting}
              text={intl.formatMessage({
                id: "OunUSG",
                defaultMessage: "Save changes",
                description:
                  "Text for the pool candidate application status submit button",
              })}
              isSubmittingText={intl.formatMessage({
                defaultMessage: "Saving...",
                id: "4Czd5U",
                description:
                  "Text displayed on the pool candidate application submit button while saving",
              })}
            />
          </form>
        </FormProvider>
      </Well>
    </div>
  );
};

interface ApplicationStatusFormApiProps {
  id: Scalars["ID"];
}

const ApplicationStatusFormApi = ({ id }: ApplicationStatusFormApiProps) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useGetPoolCandidateStatusQuery({
    variables: { id },
  });

  const [{ fetching: mutationFetching }, executeMutation] =
    useUpdatePoolCandidateStatusMutation();

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: could not update pool candidate status",
        id: "FSlrKF",
        description:
          "Message displayed when an error occurs while an admin updates a pool candidate",
      }),
    );
  };

  const handleUpdate = (input: UpdatePoolCandidateAsAdminInput) => {
    executeMutation({ id, input })
      .then((result) => {
        if (result.data?.updatePoolCandidateAsAdmin) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool candidate status updated successfully",
              id: "uSdcX4",
              description:
                "Message displayed when a pool candidate has been updated by and admin",
            }),
          );
        } else {
          handleError();
        }
      })
      .catch(() => {
        handleError();
      });
  };

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolCandidate ? (
        <ApplicationStatusForm
          isSubmitting={mutationFetching}
          application={data.poolCandidate}
          onSubmit={handleUpdate}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Pool Candidate {id} not found.",
                id: "atniLV",
                description: "Message displayed for pool candidate not found.",
              },
              { id },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export default ApplicationStatusFormApi;
