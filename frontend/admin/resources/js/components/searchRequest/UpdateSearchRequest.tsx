import { PoolCandidateSearchRequest } from "@common/api/generated";
import { Button } from "@common/components";
import { Submit, TextArea } from "@common/components/form";
import { navigate } from "@common/helpers/router";
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
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
  const paths = useAdminRoutes();
  const methods = useForm<FormValues>({
    defaultValues: initialSearchRequest,
  });
  const { handleSubmit, getValues } = methods;

  const handleSaveNotes: SubmitHandler<FormValues> = async (
    data: FormValues,
  ) => {
    return handleUpdateSearchRequest(initialSearchRequest.id, {
      adminNotes: data.adminNotes,
      status: data.status,
    })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Notes saved successfully!",
            description:
              "Message displayed to user after the personal notes have been saved successfully on the single search request page.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: saving notes failed",
            description:
              "Message displayed to user after the personal notes fail to save on the single search request page.",
          }),
        );
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
            description:
              "Message displayed to user after the request has been successfully set to done on the single search request page.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: saving notes failed",
            description:
              "Message displayed to user after the request has failed to change the status tp done on the single search request page.",
          }),
        );
      });
  };

  return (
    <section>
      <h2 data-h2-font-size="b(h4)">
        {intl.formatMessage({
          defaultMessage: "Personal Notes",
          description:
            "Heading for the personal notes section of the single search request view.",
        })}
      </h2>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleStatusChangeToDone)}>
            <div
              data-h2-border="s(lightgray, bottom, solid, s)"
              data-h2-margin="b(bottom, m)"
              data-h2-padding="b(bottom, m)"
            >
              <TextArea
                id="adminNotes"
                name="adminNotes"
                label={intl.formatMessage({
                  defaultMessage: "Personal Notes",
                  description:
                    "Label displayed on the search request form personal notes field.",
                })}
                rows={8}
              />
              <div data-h2-text-align="b(right)">
                <Button
                  color="primary"
                  mode="solid"
                  onClick={() => {
                    handleSaveNotes(getValues());
                  }}
                >
                  {intl.formatMessage({
                    defaultMessage: "Save Notes",
                    description:
                      "Button label displayed on the search request form which saves the users personal notes.",
                  })}
                </Button>
              </div>
            </div>
            <div data-h2-margin="b(bottom, m)">
              <Button
                color="primary"
                mode="outline"
                onClick={() => {
                  navigate(paths.searchRequestTable());
                }}
                data-h2-margin="b(top, m) b(right, m)"
              >
                {intl.formatMessage({
                  defaultMessage: "Back to All Requests",
                  description:
                    "Button label displayed on the search request form which returns the user back to all requests.",
                })}
              </Button>
              <Submit
                text={intl.formatMessage({
                  defaultMessage: "Mark this request as done",
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
