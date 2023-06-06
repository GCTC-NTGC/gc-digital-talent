import React from "react";
import { SubmitHandler } from "react-hook-form";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import { errorMessages, getJobLookingStatus } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { enumToOptions, BasicForm, RadioGroup } from "@gc-digital-talent/forms";
import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import {
  UpdateUserAsUserInput,
  useGetMyStatusQuery,
  useUpdateMyStatusMutation,
  GetMyStatusQuery,
  UpdateMyStatusMutation,
  JobLookingStatus,
} from "~/api/generated";
import profileMessages from "~/messages/profileMessages";

export type FormValues = Pick<UpdateUserAsUserInput, "jobLookingStatus">;

export interface MyStatusFormProps {
  initialData: GetMyStatusQuery | undefined;
  handleMyStatus: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<UpdateMyStatusMutation["updateUserAsUser"]>;
}

const MyStatusForm = ({ initialData, handleMyStatus }: MyStatusFormProps) => {
  const intl = useIntl();

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

  const disabledColor: Record<string, unknown> = !isFormActive
    ? { "data-h2-color": "base(gray.dark)" }
    : {};

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
              id: "PIgh3U",
              description: "Description for My Status Form",
            })}
          </p>
        </div>
        {!isFormActive && (
          <div
            data-h2-color="base(primary.darker)"
            data-h2-border="base(1px solid primary.darker)"
            data-h2-margin="base(x1, 0)"
            data-h2-padding="base(x1)"
            data-h2-radius="base(input)"
            data-h2-background-color="base(primary.lightest)"
          >
            <p
              data-h2-font-weight="base(700)"
              data-h2-margin="base(0, 0, x.5, 0)"
            >
              {intl.formatMessage({
                defaultMessage:
                  "<strong>Why can’t I change my status?</strong>",
                id: "3quMA8",
                description: "Message in My Status Form.",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Please complete all required fields on your profile before setting your status as active.",
                id: "+wdTbk",
                description: "Message in My Status Form.",
              })}
            </p>
          </div>
        )}

        <div data-h2-padding="base(x.5, 0, 0, 0)" {...disabledColor}>
          <RadioGroup
            idPrefix="myStatus"
            legend={intl.formatMessage({
              defaultMessage: "My status",
              id: "XBfLOu",
              description: "Legend for my status option in my status form",
            })}
            name="jobLookingStatus"
            id="jobLookingStatus"
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
              label: intl.formatMessage(getJobLookingStatus(value)),
            }))}
          />
        </div>
      </BasicForm>
    </div>
  );
};

const MyStatusApi = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();

  const [{ data: initialData, fetching, error }] = useGetMyStatusQuery();

  const [, executeMutation] = useUpdateMyStatusMutation();
  const handleMyStatus = (id: string, data: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: data,
    }).then((result) => {
      navigate(paths.profile(id));
      toast.success(
        intl.formatMessage({
          defaultMessage: "My status updated successfully!",
          id: "cyAydm",
          description:
            "Message displayed to user after user is updated successfully.",
        }),
      );
      if (result.data?.updateUserAsUser) {
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  if (error) {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: updating user failed",
        id: "5FFRV2",
        description:
          "Message displayed to user after user fails to get updated.",
      }),
    );
  }

  return (
    <Pending fetching={fetching} error={error}>
      {initialData?.me ? (
        <MyStatusForm
          initialData={initialData}
          handleMyStatus={handleMyStatus}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const MyStatusFormComponent = MyStatusForm;
export default MyStatusApi;
