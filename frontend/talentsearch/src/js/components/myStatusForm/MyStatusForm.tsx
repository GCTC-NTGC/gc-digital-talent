import { navigate } from "@common/helpers/router";
import { commonMessages, errorMessages } from "@common/messages";
import React from "react";
import { SubmitHandler } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { enumToOptions } from "@common/helpers/formUtils";
import { getJobLookingStatusDescription } from "@common/constants/localizedConstants";
import { BasicForm, RadioGroup } from "@common/components/form";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import {
  UpdateUserAsUserInput,
  useGetMyStatusQuery,
  useUpdateMyStatusMutation,
  GetMyStatusQuery,
  UpdateMyStatusMutation,
  JobLookingStatus,
} from "../../api/generated";

export type FormValues = Pick<UpdateUserAsUserInput, "jobLookingStatus">;

export interface MyStatusFormProps {
  initialData: GetMyStatusQuery | undefined;
  handleMyStatus: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<UpdateMyStatusMutation["updateUserAsUser"]>;
}

export const MyStatusForm: React.FC<MyStatusFormProps> = ({
  initialData,
  handleMyStatus,
}) => {
  const intl = useIntl();

  function bold(msg: string) {
    return <span data-h2-font-weight="b(700)">{msg}</span>;
  }

  const isFormActive = initialData?.me?.isProfileComplete;

  const JobLookingStatusSortOrder = [
    JobLookingStatus.ActivelyLooking,
    JobLookingStatus.OpenToOpportunities,
    JobLookingStatus.Inactive,
  ];
  const dataToFormValues = (
    data?: GetMyStatusQuery | undefined,
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

  const handleSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    if (initialData?.me) {
      await handleMyStatus(initialData.me?.id, formValuesToSubmitData(data));
    }
  };

  let disabledColor = "";
  if (!isFormActive) {
    disabledColor = "b([dark]gray)";
  }

  return (
    <div>
      <BasicForm
        onSubmit={handleSubmit}
        options={{
          defaultValues: dataToFormValues(initialData),
        }}
      >
        <div>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Let us know if you want to be contacted for new jobs. Please update this status if your situation changes.",
              description: "Description for My Status Form",
            })}
          </p>
        </div>
        {!isFormActive && (
          <div
            data-h2-font-color="b(lightpurple)"
            data-h2-padding="b(all, m)"
            data-h2-radius="b(s)"
            data-h2-bg-color="b([light]lightpurple[.1])"
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
        )}

        <div data-h2-padding="b(top, s)" data-h2-font-color={disabledColor}>
          <RadioGroup
            idPrefix="myStatus"
            legend={intl.formatMessage({
              defaultMessage: "My status",
              description: "Legend for my status option in my status form",
            })}
            name="jobLookingStatus"
            disabled={!isFormActive}
            rules={{
              required: intl.formatMessage(errorMessages.required),
              onChange: (e) =>
                handleSubmit({ jobLookingStatus: e.target.value }),
            }}
            items={enumToOptions(
              JobLookingStatus,
              JobLookingStatusSortOrder,
            ).map(({ value }) => ({
              value,
              label: intl.formatMessage(getJobLookingStatusDescription(value), {
                bold,
              }),
            }))}
          />
        </div>
      </BasicForm>
    </div>
  );
};

const MyStatusApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const paths = useApplicantProfileRoutes();

  const [{ data: initialData, fetching, error }] = useGetMyStatusQuery();

  const [, executeMutation] = useUpdateMyStatusMutation();
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
