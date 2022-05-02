import { navigate } from "@common/helpers/router";
import { commonMessages, errorMessages } from "@common/messages";
import React, { useCallback } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { enumToOptions } from "@common/helpers/formUtils";
import { getJobLookingStatusDescription } from "@common/constants/localizedConstants";
import { RadioGroup } from "@common/components/form";
import useDeepCompareEffect from "@common/hooks/useDeepCompareEffect";
import { debounce } from "debounce";
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

  const firstName = initialData?.me?.firstName;
  const lastName = initialData?.me?.lastName;
  const email = initialData?.me?.email;
  const telephone = initialData?.me?.telephone;
  const preferredLang = initialData?.me?.preferredLang;
  const currentProvince = initialData?.me?.currentProvince;
  const currentCity = initialData?.me?.currentCity;
  const lookingForEnglish = initialData?.me?.lookingForEnglish;
  const lookingForFrench = initialData?.me?.lookingForEnglish;
  const lookingForBilingual = initialData?.me?.lookingForBilingual;
  const isGovEmployee = initialData?.me?.isGovEmployee;
  const locationPreferences = initialData?.me?.locationPreferences;
  const wouldAcceptTemporary = initialData?.me?.wouldAcceptTemporary;
  const expectedSalary = initialData?.me?.expectedSalary;

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
  const [prevFormValues, setPrevFormValues] = React.useState(
    dataToFormValues(initialData),
  );
  const { control } = methods;
  const formValues = useWatch({ control, name: "jobLookingStatus" });

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    if (initialData?.me) {
      await handleMyStatus(initialData.me?.id, formValuesToSubmitData(data));
    }
  };

  // Whenever form values change (with some debounce allowance), call updateCandidateFilter
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const submitDebounced = useCallback(
    debounce(() => {
      if (!(formValues === prevFormValues.jobLookingStatus))
        onSubmit({ jobLookingStatus: formValues });
      setPrevFormValues({ jobLookingStatus: formValues });
    }, 200),
    [formValues],
  );

  // Use deep comparison to prevent infinite re-rendering
  useDeepCompareEffect(() => {
    submitDebounced();
    return () => {
      // Clear debounce timer when component unmounts
      submitDebounced.clear();
    };
  }, [formValues, submitDebounced]);

  let isFormActive = true;
  // Checking About Me Form
  // alert(preferredLang);

  if (
    !preferredLang ||
    !currentProvince ||
    !currentCity ||
    !telephone ||
    !firstName ||
    !lastName ||
    !email
  ) {
    isFormActive = false;
  }
  // Checking Language Information Form
  if (!lookingForBilingual && !lookingForFrench && !lookingForEnglish) {
    isFormActive = false;
  }
  // Checking government Information Form
  if (isGovEmployee === (null || undefined)) {
    isFormActive = false;
  }
  // Checking Work Location Form
  if (locationPreferences === (null || undefined)) {
    isFormActive = false;
  }
  // Checking Work Preferences Form
  if (wouldAcceptTemporary === (null || undefined)) {
    isFormActive = false;
  }
  // Checking Remaining Required Fields
  if (expectedSalary === (null || undefined)) {
    isFormActive = false;
  }

  let disabledColor = "";
  if (!isFormActive) {
    disabledColor = "b([dark]gray)";
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
              data-h2-font-color="b(lightpurple)"
              data-h2-padding="b(all, m)"
              data-h2-radius="b(s)"
              data-h2-bg-color="b([light]lightpurple[.1])"
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
        </form>
      </FormProvider>
    </div>
  );
};

const MyStatusApi: React.FunctionComponent = () => {
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
