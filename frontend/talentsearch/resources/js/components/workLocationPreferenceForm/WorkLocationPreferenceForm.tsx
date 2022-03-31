import { BasicForm, Checklist, TextArea } from "@common/components/form";
import { getworkRegionsDetailed } from "@common/constants/localizedConstants";
import { enumToOptions, unpackIds } from "@common/helpers/formUtils";
import { navigate } from "@common/helpers/router";
import { errorMessages } from "@common/messages";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import {
  CreateUserInput,
  CreateWorkLocationPreferenceMutation,
  useCreateWorkLocationPreferenceMutation,
  WorkRegion,
  User,
  UpdateUserAsUserInput,
} from "../../api/generated";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";

export type FormValues = Pick<
  CreateUserInput,
  "locationPreferences" | "locationExemptions"
>;
interface WorkLocationPreferenceFormProps {
  initialUser: User;
  handleWorkLocationPreference: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<CreateWorkLocationPreferenceMutation["updateUserAsUser"]>;
}

export const WorkLocationPreferenceForm: React.FC<
  WorkLocationPreferenceFormProps
> = ({ initialUser, handleWorkLocationPreference }) => {
  const intl = useIntl();
  const paths = useApplicantProfileRoutes();

  const dataToFormValues = (data: User): FormValues => ({
    ...data,
    locationPreferences: data.locationPreferences,
    locationExemptions: data.locationExemptions,
  });
  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateUserAsUserInput => ({
    locationPreferences: values.locationPreferences,
    locationExemptions: values.locationExemptions,
  });
  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(initialUser),
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleWorkLocationPreference(
      initialUser.id,
      formValuesToSubmitData(data),
    )
      .then(() => {
        navigate(paths.home());
        toast.success(
          intl.formatMessage({
            defaultMessage: "User updated successfully!",
            description:
              "Message displayed to user after user is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating user failed",
            description:
              "Message displayed to user after user fails to get updated.",
          }),
        );
      });
  };

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "Indicate all locations where you are willing to work, including your current location (if you are interested in working there).",
        description:
          "Description text for Profile Form wrapper  in Work Location Preferences Form",
      })}
      title={intl.formatMessage({
        defaultMessage: "Work location",
        description:
          "Title for Profile Form wrapper  in Work Location Preferences Form",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "Work Location Preference",
            description:
              "Display Text for the current page in Work Location Preference Form Page",
          }),
        },
      ]}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
              <div data-h2-padding="b(right, l)" data-testid="workLocation">
                <Checklist
                  idPrefix="work-location"
                  legend={intl.formatMessage({
                    defaultMessage: "Work location",
                    description:
                      "Legend for optional work preferences check list in work preferences form",
                  })}
                  name="workLocations"
                  items={enumToOptions(WorkRegion).map(({ value }) => ({
                    value,
                    label: intl.formatMessage(getworkRegionsDetailed(value)),
                  }))}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
            </div>
            <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
              <div data-h2-padding="b(right, l)">
                <p>
                  Indicate if there is a city that you would like to exclude
                  from a region.
                </p>
                <p data-h2-font-color="b([dark]gray)">
                  E.g.: You want to be considered for the Quebec region, but not
                  for Montréal.
                </p>
              </div>
            </div>
            <div data-h2-flex-item="b(1of2)" data-h2-padding="b(top, m)">
              <div data-h2-padding="b(right, l)">
                <TextArea
                  id="location-exemptions"
                  label="Location exemptions"
                  name="locationExemption"
                  placeholder="Optionally, add a city or village here..."
                />
              </div>
            </div>
          </div>
          <ProfileFormFooter mode="saveButton" />
        </form>
      </FormProvider>
    </ProfileFormWrapper>
  );
};
