import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { PoolCandidateSearchRequest } from "@common/api/generated";
import { Button } from "@common/components";
import { Submit, TextArea } from "@common/components/form";
import { toast } from "@common/components/Toast";
import Heading from "@common/components/Heading/Heading";

import { commonMessages } from "@common/messages";
import { useAdminRoutes } from "../../adminRoutes";
import {
  PoolCandidateSearchStatus,
  UpdatePoolCandidateSearchRequestInput,
  useUpdatePoolCandidateSearchRequestMutation,
} from "../../api/generated";

type FormValues = UpdatePoolCandidateSearchRequestInput;

interface UpdateSearchRequestFormProps {
  initialSearchRequest: PoolCandidateSearchRequest;
  handleUpdateSearchRequest: (
    id: string,
    data: FormValues,
  ) => Promise<FormValues>;
}

export const UpdateSearchRequestForm: React.FunctionComponent<
  UpdateSearchRequestFormProps
> = ({ initialSearchRequest, handleUpdateSearchRequest }) => {
  const intl = useIntl();
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const paths = useAdminRoutes();
  const methods = useForm<FormValues>({
    defaultValues: initialSearchRequest,
  });
  const { handleSubmit, getValues } = methods;

  const handleSaveNotes: SubmitHandler<FormValues> = async (
    data: FormValues,
  ) => {
    setIsSaving(true);
    return handleUpdateSearchRequest(initialSearchRequest.id, {
      adminNotes: data.adminNotes,
    })
      .then(() => {
        // HACK: This marks the field as clean after
        // submitting the data since the form is never
        // submitted in the traditional sense
        methods.resetField("adminNotes", {
          keepDirty: false,
          defaultValue: data.adminNotes,
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

  const handleStatusChangeToDone: SubmitHandler<FormValues> = async (
    data: FormValues,
  ) => {
    return handleUpdateSearchRequest(initialSearchRequest.id, {
      adminNotes: data.adminNotes,
      status: PoolCandidateSearchStatus.Done,
    })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Request status successfully set to done!",
            id: "xjOcT7",
            description:
              "Message displayed to user after the request has been successfully set to done on the single search request page.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: saving notes failed",
            id: "RIYFZu",
            description:
              "Message displayed to user after the request has failed to change the status tp done on the single search request page.",
          }),
        );
      });
  };

  return (
    <section>
      <Heading level="h2" size="h4">
        {intl.formatMessage({
          defaultMessage: "Personal Notes",
          id: "l05aVF",
          description:
            "Heading for the personal notes section of the single search request view.",
        })}
      </Heading>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleStatusChangeToDone)}>
            <div
              data-h2-border-bottom="base(1px solid dt-gray)"
              data-h2-margin="base(0, 0, x1, 0)"
              data-h2-padding="base(0, 0, x1, 0)"
            >
              <TextArea
                id="adminNotes"
                name="adminNotes"
                label={intl.formatMessage({
                  defaultMessage: "Personal Notes",
                  id: "p7D5i5",
                  description:
                    "Label displayed on the search request form personal notes field.",
                })}
                rows={8}
              />
              <div data-h2-text-align="base(right)">
                <Button
                  color="primary"
                  mode="outline"
                  disabled={isSaving}
                  onClick={() => {
                    handleSaveNotes(getValues());
                  }}
                >
                  {isSaving
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage({
                        defaultMessage: "Save Notes",
                        id: "DRsBYY",
                        description:
                          "Button label displayed on the search request form which saves the users personal notes.",
                      })}
                </Button>
              </div>
            </div>
            <div data-h2-margin="base(0, 0, x1, 0)">
              <Button
                color="primary"
                mode="outline"
                onClick={() => {
                  navigate(paths.searchRequestTable());
                }}
                data-h2-margin="base(x1, x1, 0, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Back to All Requests",
                  id: "s6HoFU",
                  description:
                    "Button label displayed on the search request form which returns the user back to all requests.",
                })}
              </Button>
              <Submit
                text={intl.formatMessage({
                  defaultMessage: "Mark this request as done",
                  id: "UNScjB",
                  description:
                    "Button label displayed on the search request form which changes request status to done.",
                })}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export const UpdateSearchRequest: React.FunctionComponent<{
  initialSearchRequest: PoolCandidateSearchRequest;
}> = ({ initialSearchRequest }) => {
  const [, executeMutation] = useUpdatePoolCandidateSearchRequestMutation();
  const handleUpdateSearchRequest = (
    id: string,
    data: UpdatePoolCandidateSearchRequestInput,
  ) =>
    executeMutation({
      id,
      poolCandidateSearchRequest: data,
    }).then((result) => {
      if (result.data?.updatePoolCandidateSearchRequest) {
        return result.data.updatePoolCandidateSearchRequest;
      }
      return Promise.reject(result.error);
    });

  return (
    <UpdateSearchRequestForm
      initialSearchRequest={initialSearchRequest}
      handleUpdateSearchRequest={handleUpdateSearchRequest}
    />
  );
};
