import { navigate } from "@common/helpers/router";
import { commonMessages, errorMessages } from "@common/messages";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { enumToOptions } from "@common/helpers/formUtils";
import { getJobLookingStatusDescription } from "@common/constants/localizedConstants";
import { RadioGroup } from "@common/components/form";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import {
  UpdateUserAsUserInput,
  useGetMystatusQuery,
  useUpdateMystatusMutation,
  GetMystatusQuery,
  UpdateMystatusMutation,
  JobLookingStatus,
} from "../../api/generated";

export type FormValues = Pick<UpdateUserAsUserInput, "jobLookingStatus">;

export interface MyStatusFormProps {
  initialData: GetMystatusQuery | undefined;
  handleMyStatus: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<UpdateMystatusMutation["updateUserAsUser"]>;
}

export const MyStatusForm: React.FC<MyStatusFormProps> = ({
  initialData,
  handleMyStatus,
}) => {
  const intl = useIntl();
  function bold(msg: string) {
    return <span data-h2-font-weight="b(700)">{msg}</span>;
  }
  const JobLookingStatusSortOrder = [
    JobLookingStatus.ActivelyLooking,
    JobLookingStatus.OpenToOpportunities,
    JobLookingStatus.Inactive,
  ];
  const dataToFormValues = (
    data?: GetMystatusQuery | undefined,
  ): FormValues => {
    return {
      jobLookingStatus: data?.me?.jobLookingStatus,
    };
  };
  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateUserAsUserInput => {
    return {
      jobLookingStatus: values.jobLookingStatus,
    };
  };

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(initialData),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    if (initialData?.me) {
      await handleMyStatus(initialData.me?.id, formValuesToSubmitData(data));
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Let us know if you want to be contacted for new jobs. Please update this status if your situation changes.",
                description: "Description for My Status Form",
              })}
            </p>
          </div>
          <div
            data-bg-color="b([light]lightpurple[.1])"
            data-h2-font-color="b(lightpurple)"
            data-h2-padding="b(all, m)"
            data-h2-radius="b(s)"
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "<bold>Why can’t I change my status?</bold>",
                  description: "Message in My Status Form.",
                },
                {
                  bold,
                },
              )}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Please complete all required fields on your profile before setting your status as active.",
                description: "Message in My Status Form.",
              })}
            </p>
          </div>
          <div data-h2-padding="b(top, s)">
            <RadioGroup
              idPrefix="myStatus"
              legend={intl.formatMessage({
                defaultMessage: "My status",
                description: "Legend for my status option in my status form",
              })}
              name="jobLookingStatus"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={enumToOptions(
                JobLookingStatus,
                JobLookingStatusSortOrder,
              ).map(({ value }) => ({
                value,
                label: intl.formatMessage(
                  getJobLookingStatusDescription(value),
                  { bold },
                ),
              }))}
            />
          </div>
          <div data-h2-padding="b(top, s)">
            <button type="submit">Submit</button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export const MyStatusApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const paths = useApplicantProfileRoutes();

  const [{ data: initialData, fetching, error }] = useGetMystatusQuery();

  const [, executeMutation] = useUpdateMystatusMutation();
  const handleMyStatus = (id: string, data: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: data,
    }).then((result) => {
      navigate(paths.home());
      toast.success(
        intl.formatMessage({
          defaultMessage: "My Status updated successfully!",
          description:
            "Message displayed to user after user is updated successfully.",
        }),
      );
      if (result.data?.updateUserAsUser) {
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error) {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: updating user failed",
        description:
          "Message displayed to user after user fails to get updated.",
      }),
    );
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error.message}
      </p>
    );
  }
  return initialData?.me ? (
    <MyStatusForm initialData={initialData} handleMyStatus={handleMyStatus} />
  ) : (
    <p>
      {intl.formatMessage({
        defaultMessage: "User not found.",
        description: "Message displayed for user not found.",
      })}
    </p>
  );
};

export default MyStatusApi;
