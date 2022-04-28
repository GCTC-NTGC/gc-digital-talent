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
  useUpdateMystatusMutation,
  UpdateMystatusMutation,
  JobLookingStatus,
  User,
  useGetMeQuery,
  GetMeQuery,
} from "../../api/generated";

export type FormValues = Pick<UpdateUserAsUserInput, "jobLookingStatus">;

export interface MyStatusFormProps {
  initialData: User;
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
  const {
    firstName,
    lastName,
    email,
    telephone,
    preferredLang,
    currentProvince,
    currentCity,
    lookingForEnglish,
    lookingForFrench,
    lookingForBilingual,
    isGovEmployee,
    locationPreferences,
    wouldAcceptTemporary,
    expectedSalary,
  } = initialData;

  const JobLookingStatusSortOrder = [
    JobLookingStatus.ActivelyLooking,
    JobLookingStatus.OpenToOpportunities,
    JobLookingStatus.Inactive,
  ];
  const dataToFormValues = (data?: User): FormValues => {
    return {
      jobLookingStatus: data?.jobLookingStatus,
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
    if (initialData) {
      await handleMyStatus(initialData.id, formValuesToSubmitData(data));
    }
  };

  let isFormActive = true;
  // Checking About Me Form
  if (
    preferredLang?.length === 0 ||
    currentProvince?.length === 0 ||
    currentCity?.length === 0 ||
    telephone?.length === 0 ||
    firstName?.length === 0 ||
    lastName?.length === 0 ||
    email?.length === 0
  ) {
    isFormActive = false;
  }
  // Checking Language Information Form
  if (
    lookingForBilingual !== true &&
    lookingForFrench !== true &&
    lookingForEnglish !== true
  ) {
    isFormActive = false;
  }
  // Checking government Information Form
  if (isGovEmployee == null) {
    isFormActive = false;
  }
  // Checking Work Location Form
  if (locationPreferences?.length === 0) {
    isFormActive = false;
  }
  // Checking Work Preferences Form
  if (wouldAcceptTemporary === null) {
    isFormActive = false;
  }
  // Checking Remaining Required Fields
  if (expectedSalary?.length === 0) {
    isFormActive = false;
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form>
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
              data-bg-color="b([light]lightpurple[.1])"
              data-h2-font-color="b(lightpurple)"
              data-h2-padding="b(all, m)"
              data-h2-radius="b(s)"
            >
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "<bold>Why can’t I change my status?</bold>",
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
          <div data-h2-padding="b(top, s)">
            {!isFormActive && '<p data-h2-font-color="b([dark]gray)">'}
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
              }}
              onChange={handleSubmit(onSubmit)}
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
            {!isFormActive && "</p>"}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export const MyStatusApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const paths = useApplicantProfileRoutes();

  const [{ data, fetching, error }] = useGetMeQuery();

  // type magic on data variable to make it end up as a valid User type
  const dataToUser = (input: GetMeQuery): User | undefined => {
    if (input) {
      if (input.me) {
        return input.me;
      }
    }
    return undefined;
  };
  const userData = data ? dataToUser(data) : undefined;

  const [, executeMutation] = useUpdateMystatusMutation();
  const handleMyStatus = (id: string, handledata: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: handledata,
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
  if (userData)
    return (
      <MyStatusForm initialData={userData} handleMyStatus={handleMyStatus} />
    );
  return (
    <p>
      {intl.formatMessage({
        defaultMessage: "No user data",
        description: "Message when user data was not found",
      })}
    </p>
  );
};
export default MyStatusApi;
