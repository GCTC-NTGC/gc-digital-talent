import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import { useMutation, useQuery } from "urql";

import { toast } from "@gc-digital-talent/toast";
import {
  DateInput,
  Select,
  Submit,
  TextArea,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { Heading, Well } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { emptyToNull } from "@gc-digital-talent/helpers";
import {
  PoolCandidateStatus,
  UpdatePoolCandidateStatusInput,
  type PoolCandidate,
  FragmentType,
  getFragment,
  graphql,
  ApplicationStatusForm_PoolCandidateFragmentFragment,
} from "@gc-digital-talent/graphql";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import adminMessages from "~/messages/adminMessages";

type FormValues = {
  status?: PoolCandidateStatus;
  notes?: PoolCandidate["notes"];
  expiryDate?: PoolCandidate["expiryDate"];
};

const ApplicationStatusFormOptions_Query = graphql(/* GraphQL */ `
  query ApplicationStatusFormOptions {
    statuses: localizedEnumStrings(enumName: "PoolCandidateStatus") {
      value
      label {
        en
        fr
      }
    }
  }
`);

export interface ApplicationStatusFormProps {
  isSubmitting: boolean;
  application: ApplicationStatusForm_PoolCandidateFragmentFragment;
  onSubmit: (values: UpdatePoolCandidateStatusInput, notes: string) => void;
}

export const ApplicationStatusForm = ({
  application,
  onSubmit,
  isSubmitting,
}: ApplicationStatusFormProps) => {
  const intl = useIntl();
  const [{ data }] = useQuery({ query: ApplicationStatusFormOptions_Query });
  const methods = useForm<FormValues>({
    defaultValues: {
      status: application.status?.value ?? undefined,
      notes: application.notes ?? "",
      expiryDate: application.expiryDate
        ? strToFormDate(application.expiryDate)
        : undefined,
    },
  });
  const { handleSubmit } = methods;

  const handleFormSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    onSubmit(
      {
        status: values.status,

        expiryDate: values.expiryDate || emptyToNull(values.expiryDate),
      },
      values.notes ?? "",
    );

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

  const allowedStatuses = data?.statuses?.filter((status) => {
    return (
      status?.value !== PoolCandidateStatus.Draft &&
      status?.value !== PoolCandidateStatus.DraftExpired &&
      status?.value !== PoolCandidateStatus.Expired
    );
  });

  return (
    <div data-h2-width="base(100%)">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Well>
            <div
              data-h2-display="base(grid)"
              data-h2-grid-template-columns="l-tablet(1fr 1fr)"
              data-h2-gap="base(x1)"
            >
              <div>
                <Heading
                  level="h4"
                  size="h5"
                  data-h2-font-weight="base(400)"
                  data-h2-margin="base(0, 0, x0.5, 0)"
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
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x.5 0)"
                >
                  <Select
                    label={intl.formatMessage({
                      defaultMessage: "Candidate pool status",
                      id: "/pHz5L",
                      description:
                        "Label for the current applications pool status",
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
                    options={localizedEnumToOptions(allowedStatuses, intl)}
                  />
                  <DateInput
                    id="expiryDate"
                    name="expiryDate"
                    legend={intl.formatMessage({
                      defaultMessage: "Candidate expiry date",
                      id: "SoKPAb",
                      description:
                        "Label displayed on the pool candidate application form expiry date field.",
                    })}
                  />
                </div>
              </div>
              <div>
                <Heading
                  level="h4"
                  size="h5"
                  data-h2-font-weight="base(400)"
                  data-h2-margin="base(0, 0, x0.25, 0)"
                  data-h2-display="base(flex)"
                  data-h2-align-items="base(center)"
                  data-h2-gap="base(x0.25, 0)"
                >
                  <PencilSquareIcon
                    data-h2-width="base(0.75em)"
                    data-h2-height="base(0.75em)"
                    data-h2-margin="base(0, x0.25, 0, 0)"
                  />
                  <span>{intl.formatMessage(adminMessages.notes)}</span>
                </Heading>
                <p data-h2-margin="base(x0.25 0)">
                  {intl.formatMessage({
                    id: "JDQvla",
                    defaultMessage:
                      "These notes are shared between all managers of this pool, but not to candidates.",
                    description: "Description of pool candidate notes field",
                  })}
                </p>
                <TextArea
                  id="notes"
                  name="notes"
                  label={intl.formatMessage(
                    {
                      defaultMessage: "Notes - {poolName}",
                      id: "9Aa5c0",
                      description:
                        "Label for the notes field for a specific pool",
                    },
                    {
                      poolName: getShortPoolTitleHtml(intl, application.pool),
                    },
                  )}
                />
              </div>
            </div>
          </Well>
          <p data-h2-margin="base(x1, 0)">
            <Submit
              color="primary"
              isSubmitting={isSubmitting}
              text={intl.formatMessage(formMessages.saveChanges)}
              isSubmittingText={intl.formatMessage(commonMessages.saving)}
            />
          </p>
        </form>
      </FormProvider>
    </div>
  );
};

const ApplicationStatusForm_Mutation = graphql(/* GraphQL */ `
  mutation ApplicationStatusForm_Mutation(
    $id: UUID!
    $input: UpdatePoolCandidateStatusInput!
    $notes: String
  ) {
    updatePoolCandidateStatus(id: $id, poolCandidate: $input) {
      id
      expiryDate
      status {
        value
      }
    }
    updatePoolCandidateNotes(id: $id, notes: $notes) {
      id
      notes
    }
  }
`);

const ApplicationStatusForm_PoolCandidateFragment = graphql(/* GraphQL */ `
  fragment ApplicationStatusForm_PoolCandidateFragment on PoolCandidate {
    id
    expiryDate
    status {
      value
    }
    notes
    pool {
      id
      name {
        en
        fr
      }
      stream {
        value
      }
      publishingGroup {
        value
      }
      classification {
        id
        group
        level
      }
    }
  }
`);

interface ApplicationStatusFormApiProps {
  candidateQuery: FragmentType<
    typeof ApplicationStatusForm_PoolCandidateFragment
  >;
}

const ApplicationStatusFormApi = ({
  candidateQuery,
}: ApplicationStatusFormApiProps) => {
  const intl = useIntl();

  const poolCandidate = getFragment(
    ApplicationStatusForm_PoolCandidateFragment,
    candidateQuery,
  );

  const [{ fetching: mutationFetching }, executeMutation] = useMutation(
    ApplicationStatusForm_Mutation,
  );

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

  const handleUpdate = (
    input: UpdatePoolCandidateStatusInput,
    notes: string,
  ) => {
    executeMutation({ id: poolCandidate.id, input, notes })
      .then((result) => {
        if (
          result.data?.updatePoolCandidateStatus &&
          result.data.updatePoolCandidateNotes
        ) {
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
    <ApplicationStatusForm
      isSubmitting={mutationFetching}
      application={poolCandidate}
      onSubmit={handleUpdate}
    />
  );
};

export default ApplicationStatusFormApi;
