import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { Heading, Link, Loading, Separator } from "@gc-digital-talent/ui";
import {
  Select,
  Submit,
  TextArea,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  uiMessages,
  sortPoolCandidateSearchStatus,
} from "@gc-digital-talent/i18n";
import {
  LocalizedEnumString,
  PoolCandidateSearchRequest,
  UpdatePoolCandidateSearchRequestInput,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import useReturnPath from "~/hooks/useReturnPath";

type FormValues = UpdatePoolCandidateSearchRequestInput;

interface UpdateSearchRequestFormProps {
  initialSearchRequest: PoolCandidateSearchRequest;
  statuses: LocalizedEnumString[];
  handleUpdateSearchRequest: (
    id: string,
    data: FormValues,
  ) => Promise<FormValues>;
}

const UpdateSearchRequestForm = ({
  initialSearchRequest,
  statuses,
  handleUpdateSearchRequest,
}: UpdateSearchRequestFormProps) => {
  const intl = useIntl();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const paths = useRoutes();
  const methods = useForm<FormValues>({
    defaultValues: {
      ...initialSearchRequest,
      status: initialSearchRequest.status?.value,
    },
  });
  const { handleSubmit } = methods;

  const handleSaveNotes: SubmitHandler<FormValues> = async (
    values: FormValues,
  ) => {
    setIsSaving(true);
    return handleUpdateSearchRequest(initialSearchRequest.id, {
      adminNotes: values.adminNotes,
    })
      .then(() => {
        // HACK: This marks the field as clean after
        // submitting the data since the form is never
        // submitted in the traditional sense
        methods.resetField("adminNotes", {
          keepDirty: false,
          defaultValue: values.adminNotes,
        });
        toast.success(
          intl.formatMessage({
            defaultMessage: "Notes saved successfully!",
            id: "YNLJcX",
            description:
              "Message displayed to user after the personal notes have been saved successfully on the single search request page.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: saving notes failed",
            id: "fhL8jz",
            description:
              "Message displayed to user after the personal notes fail to save on the single search request page.",
          }),
        );
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleSaveStatus: SubmitHandler<FormValues> = async (
    values: FormValues,
  ) => {
    setIsSaving(true);
    return handleUpdateSearchRequest(initialSearchRequest.id, {
      status: values.status,
    })
      .then(() => {
        // HACK: This marks the field as clean after
        // submitting the data since the form is never
        // submitted in the traditional sense
        methods.resetField("status", {
          keepDirty: false,
          defaultValue: values.status,
        });
        toast.success(
          intl.formatMessage({
            defaultMessage: "Request status updated!",
            id: "+mCsoW",
            description:
              "Message displayed to user after the request status is successfully updated.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating status failed",
            id: "CaDy8n",
            description:
              "Message displayed to user after the request status fails to be updated.",
          }),
        );
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const navigateTo = useReturnPath(paths.searchRequestTable());

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSaveNotes)}>
          <Heading level="h2" size="h4" className="mt-0">
            {intl.formatMessage({
              defaultMessage: "Notes about this request",
              id: "peTSHR",
              description:
                "Heading for the notes about this request section of the single search request view.",
            })}
          </Heading>
          <p className="my-3">
            {intl.formatMessage({
              defaultMessage:
                "These notes are only available here and will not be shared with the candidates.",
              id: "t79/r1",
              description:
                "Description for the notes about this request section of the single search request view.",
            })}
          </p>
          <TextArea
            id="adminNotes"
            name="adminNotes"
            label={intl.formatMessage({
              defaultMessage: "Request notes",
              id: "Pe1kas",
              description:
                "Label displayed on the search request form request notes field.",
            })}
            rows={8}
          />
          <div className="text-right">
            <Submit
              disabled={isSaving}
              isSubmitting={isSaving}
              text={intl.formatMessage({
                defaultMessage: "Save notes",
                id: "fzuAHN",
                description:
                  "Button label displayed on the search request form which saves the users personal notes.",
              })}
              submittedText={intl.formatMessage({
                defaultMessage: "Save notes",
                id: "fzuAHN",
                description:
                  "Button label displayed on the search request form which saves the users personal notes.",
              })}
            />
          </div>
        </form>
      </FormProvider>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSaveStatus)}>
          <Heading level="h2" size="h4">
            {intl.formatMessage(commonMessages.status)}
          </Heading>
          <p className="my-3">
            {intl.formatMessage({
              defaultMessage:
                "Track the progress of this request by setting the right status.",
              id: "YIt7Su",
              description: "Text describing the input to change request status",
            })}
          </p>
          <div className="max-w-160">
            <Select
              id="status"
              name="status"
              nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
              label={intl.formatMessage(commonMessages.status)}
              options={localizedEnumToOptions(
                sortPoolCandidateSearchStatus(statuses),
                intl,
              )}
              doNotSort
            />
            <div className="mt-3 text-right">
              <Submit
                disabled={isSaving}
                isSubmitting={isSaving}
                text={intl.formatMessage({
                  defaultMessage: "Save status change",
                  id: "B6SqfX",
                  description:
                    "Button label displayed that saves the users status selection.",
                })}
                submittedText={intl.formatMessage({
                  defaultMessage: "Save status change",
                  id: "B6SqfX",
                  description:
                    "Button label displayed that saves the users status selection.",
                })}
              />
            </div>
          </div>
        </form>
      </FormProvider>
      <Separator />
      <Link href={navigateTo} mode="inline" color="warning">
        {intl.formatMessage({
          defaultMessage: "Back to requests",
          id: "O8nHiQ",
          description:
            "Button label displayed on the search request form which returns the user back to requests.",
        })}
      </Link>
    </>
  );
};

const UpdateSearchRequest_Mutation = graphql(/* GraphQL */ `
  mutation UpdateSearchRequest(
    $id: ID!
    $poolCandidateSearchRequest: UpdatePoolCandidateSearchRequestInput!
  ) {
    updatePoolCandidateSearchRequest(
      id: $id
      poolCandidateSearchRequest: $poolCandidateSearchRequest
    ) {
      id
      status {
        value
      }
      adminNotes
    }
  }
`);

const UpdateSearchRequestOptions_Query = graphql(/* GraphQL */ `
  query UpdateSearchRequestOptions {
    statuses: localizedEnumStrings(enumName: "PoolCandidateSearchStatus") {
      value
      label {
        en
        fr
      }
    }
  }
`);

const UpdateSearchRequest = ({
  initialSearchRequest,
}: {
  initialSearchRequest: PoolCandidateSearchRequest;
}) => {
  const [, executeMutation] = useMutation(UpdateSearchRequest_Mutation);
  const [{ data, fetching }] = useQuery({
    query: UpdateSearchRequestOptions_Query,
  });
  const handleUpdateSearchRequest = (
    id: string,
    values: UpdatePoolCandidateSearchRequestInput,
  ) =>
    executeMutation({
      id,
      poolCandidateSearchRequest: values,
    }).then((result) => {
      if (result.data?.updatePoolCandidateSearchRequest) {
        return {
          ...result.data.updatePoolCandidateSearchRequest,
          status: result.data.updatePoolCandidateSearchRequest.status?.value,
        };
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  if (fetching) return <Loading inline />;

  return (
    <UpdateSearchRequestForm
      initialSearchRequest={initialSearchRequest}
      statuses={unpackMaybes(data?.statuses)}
      handleUpdateSearchRequest={handleUpdateSearchRequest}
    />
  );
};

export default UpdateSearchRequest;
