import React from "react";
import { useIntl } from "react-intl";
import { commonMessages, errorMessages } from "@common/messages";
import { Checklist, RadioGroup } from "@common/components/form";
import {
  getOperationalRequirement,
  getOperationalRequirementCandidateDescription,
} from "@common/constants/localizedConstants";
import { enumToOptions } from "@common/helpers/formUtils";
import { navigate } from "@common/helpers/router";
import { toast } from "react-toastify";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import {
  GetWorkPreferencesQuery,
  OperationalRequirement,
  UpdateUserAsUserInput,
  UpdateWorkPreferencesMutation,
  useGetWorkPreferencesQuery,
  useUpdateWorkPreferencesMutation,
} from "../../api/generated";

export type FormValues = Pick<
  UpdateUserAsUserInput,
  "wouldAcceptTemporary" | "acceptedOperationalRequirements"
>;
export interface WorkPreferencesFormProps {
  initialData: GetWorkPreferencesQuery | undefined;
  handleWorkPreferences: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<UpdateWorkPreferencesMutation["updateUserAsUser"]>;
}

export const WorkPreferencesForm: React.FC<WorkPreferencesFormProps> = ({
  initialData,
  handleWorkPreferences,
}) => {
  const intl = useIntl();
  function bold(msg: string) {
    return <span data-h2-font-weight="b(700)">{msg}</span>;
  }
  const OperationalRequirementsSortOrder = [
    OperationalRequirement.OvertimeShortNotice,
    OperationalRequirement.OvertimeScheduled,
    OperationalRequirement.ShiftWork,
    OperationalRequirement.OnCall,
    OperationalRequirement.Travel,
    OperationalRequirement.TransportEquipment,
    OperationalRequirement.DriversLicense,
  ];
  const dataToFormValues = (
    data?: GetWorkPreferencesQuery | undefined,
  ): FormValues => {
    if (data?.me?.wouldAcceptTemporary === !false) {
      // eslint-disable-next-line no-param-reassign
      data.me.wouldAcceptTemporary = false;
    }
    // eslint-disable-next-line no-param-reassign
    // data?.me?.wouldAcceptTemporary = false;

    return {
      wouldAcceptTemporary: data?.me?.wouldAcceptTemporary,
      acceptedOperationalRequirements:
        data?.me?.acceptedOperationalRequirements,
    };
  };

  // const dataToFormValues = (
  //   data?: GetWorkPreferencesQuery | undefined,
  // ): FormValues => ({
  //   ...data,
  //   wouldAcceptTemporary: data?.me?.wouldAcceptTemporary,
  //   acceptedOperationalRequirements: data?.me?.acceptedOperationalRequirements,
  // });
  // const formValuesToSubmitData = (
  //   values: FormValues,
  // ): UpdateUserAsUserInput=({values}) => ({
  //   values.wouldAcceptTemporary==="true"?(wouldAcceptTemporary: true) :(wouldAcceptTemporary: false);
  //   acceptedOperationalRequirements: values.acceptedOperationalRequirements,
  // });
  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateUserAsUserInput => {
    if (values.wouldAcceptTemporary === !"true") {
      // eslint-disable-next-line no-param-reassign
      values.wouldAcceptTemporary = false;
    } else {
      // eslint-disable-next-line no-param-reassign
      values.wouldAcceptTemporary = true;
    }
    return {
      wouldAcceptTemporary: values.wouldAcceptTemporary,
      acceptedOperationalRequirements: values.acceptedOperationalRequirements,
    };
  };
  // const formValuesToSubmitData = (
  //   values: FormValues,
  // ): UpdateUserAsUserInput => ({
  //   wouldAcceptTemporary: values.wouldAcceptTemporary,
  //   acceptedOperationalRequirements: values.acceptedOperationalRequirements,
  // });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(initialData),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    if (initialData?.me) {
      await handleWorkPreferences(
        initialData.me?.id,
        formValuesToSubmitData(data),
      );
    }
  };

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "Certain jobs require you to work odd hours or perform tasks that are a little outside of the normal. Please indicate which special requirements you are comfortable with.",
        description:
          "Description text for Profile Form wrapper  in Work Preferences Form",
      })}
      title={intl.formatMessage({
        defaultMessage: "Work preferences",
        description: "Title for Profile Form wrapper  in Work Preferences Form",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "Work Preferences",
            description: "Display Text for Work Preferences Form Page Link",
          }),
        },
      ]}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
              <div data-h2-padding="b(right, l)">
                <RadioGroup
                  idPrefix="required-work-preferences"
                  legend={intl.formatMessage({
                    defaultMessage:
                      "I would consider accepting a job that lasts for...",
                    description:
                      "Legend Text for required work preferences options in work preferences form",
                  })}
                  name="wouldAcceptTemporary"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  items={[
                    {
                      value: "true",
                      label: intl.formatMessage({
                        defaultMessage:
                          "...any duration (short term, long term, or indeterminate duration)",
                        description:
                          "Label displayed on Work Preferences form for any duration option",
                      }),
                    },
                    {
                      value: "false",
                      label: intl.formatMessage({
                        defaultMessage:
                          "...only those of an indeterminate duration. (permanent)",
                        description:
                          "Label displayed on Work Preferences form for indeterminate duration option.",
                      }),
                    },
                  ]}
                />
              </div>
            </div>
            <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
              <div data-h2-padding="b(right, l)">
                <Checklist
                  idPrefix="optional-work-preferences"
                  legend={intl.formatMessage({
                    defaultMessage:
                      "I would consider accepting a job that requires…",
                    description:
                      "Legend for optional work preferences check list in work preferences form",
                  })}
                  name="acceptedOperationalRequirements"
                  items={enumToOptions(
                    OperationalRequirement,
                    OperationalRequirementsSortOrder,
                  ).map(({ value }) => ({
                    value,
                    label: intl.formatMessage(
                      getOperationalRequirementCandidateDescription(value),
                      { bold },
                    ),
                  }))}
                />
              </div>
            </div>
            <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
              <div data-h2-padding="b(right, l)">
                <ProfileFormFooter mode="saveButton" />
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </ProfileFormWrapper>
  );
};

export const WorkPreferencesApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const paths = useApplicantProfileRoutes();

  const [{ data: initialData, fetching, error }] = useGetWorkPreferencesQuery();

  const [, executeMutation] = useUpdateWorkPreferencesMutation();
  const handleWorkPreferences = (id: string, data: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: data,
    }).then((result) => {
      navigate(paths.home());
      toast.success(
        intl.formatMessage({
          defaultMessage: "Work preferences updated successfully!",
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
    <WorkPreferencesForm
      initialData={initialData}
      handleWorkPreferences={handleWorkPreferences}
    />
  ) : (
    <p>
      {intl.formatMessage({
        defaultMessage: "User not found.",
        description: "Message displayed for user not found.",
      })}
    </p>
  );
};

export default WorkPreferencesApi;
