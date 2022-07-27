import React from "react";
import { useIntl } from "react-intl";
import { commonMessages, errorMessages } from "@common/messages";
import { Checklist, RadioGroup } from "@common/components/form";
import {
  getOperationalRequirement,
  OperationalRequirementV2,
} from "@common/constants/localizedConstants";
import { navigate } from "@common/helpers/router";
import { toast } from "react-toastify";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import {
  GetWorkPreferencesQuery,
  UpdateUserAsUserInput,
  UpdateWorkPreferencesMutation,
  useGetWorkPreferencesQuery,
  useUpdateWorkPreferencesMutation,
} from "../../api/generated";
import profileMessages from "../profile/profileMessages";

export type FormValues = Pick<
  UpdateUserAsUserInput,
  "acceptedOperationalRequirements"
> & {
  wouldAcceptTemporary?: string;
};
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

  const dataToFormValues = (
    data?: GetWorkPreferencesQuery | undefined,
  ): FormValues => {
    const boolToString = (boolVal: boolean | null | undefined): string => {
      return boolVal ? "true" : "false";
    };

    return {
      wouldAcceptTemporary: data?.me?.wouldAcceptTemporary
        ? boolToString(data?.me?.wouldAcceptTemporary)
        : undefined,
      acceptedOperationalRequirements:
        data?.me?.acceptedOperationalRequirements,
    };
  };
  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateUserAsUserInput => {
    const stringToBool = (
      stringVal: string | undefined,
    ): boolean | null | undefined => {
      if (stringVal === "true") {
        return true;
      }
      return false;
    };
    return {
      wouldAcceptTemporary: stringToBool(values.wouldAcceptTemporary),
      acceptedOperationalRequirements: values.acceptedOperationalRequirements,
    };
  };

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
            <div
              data-h2-flex-item="base(1of1)"
              data-h2-padding="base(x1, 0, 0, 0)"
            >
              <div data-h2-padding="base(0, x2, 0, 0)">
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
            <div
              data-h2-flex-item="base(1of1)"
              data-h2-padding="base(x1, 0, 0, 0)"
            >
              <div data-h2-padding="base(0, x2, 0, 0)">
                <Checklist
                  idPrefix="optional-work-preferences"
                  legend={intl.formatMessage({
                    defaultMessage:
                      "I would consider accepting a job that requires…",
                    description:
                      "Legend for optional work preferences check list in work preferences form",
                  })}
                  name="acceptedOperationalRequirements"
                  items={OperationalRequirementV2.map((value) => ({
                    value,
                    label: intl.formatMessage(
                      getOperationalRequirement(value, "candidateDescription"),
                    ),
                  }))}
                />
              </div>
            </div>
            <div
              data-h2-flex-item="base(1of1)"
              data-h2-padding="base(x1, 0, 0, 0)"
            >
              <div data-h2-padding="base(0, x2, 0, 0)">
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
  const preProfileStatus = initialData?.me?.isProfileComplete;

  const [, executeMutation] = useUpdateWorkPreferencesMutation();
  const handleWorkPreferences = (id: string, data: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: data,
    }).then((result) => {
      if (result.data?.updateUserAsUser) {
        if (result.data?.updateUserAsUser?.isProfileComplete) {
          const currentProfileStatus =
            result.data?.updateUserAsUser?.isProfileComplete;
          const message = intl.formatMessage(profileMessages.profileCompleted);
          if (!preProfileStatus && currentProfileStatus) {
            toast.success(message);
          }
        }
      }
      navigate(paths.home());
      toast.success(intl.formatMessage(profileMessages.userUpdated));
      if (result.data?.updateUserAsUser) {
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  if (error) {
    toast.error(intl.formatMessage(profileMessages.updatingFailed));
  }

  return (
    <Pending fetching={fetching} error={error}>
      {initialData?.me ? (
        <WorkPreferencesForm
          initialData={initialData}
          handleWorkPreferences={handleWorkPreferences}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export default WorkPreferencesApi;
