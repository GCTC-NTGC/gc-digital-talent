import { Checklist, TextArea } from "@common/components/form";
import { getWorkRegionsDetailed } from "@common/constants/localizedConstants";
import { enumToOptions } from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import { navigate } from "@common/helpers/router";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { errorMessages } from "@common/messages";
import { BriefcaseIcon } from "@heroicons/react/solid";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  CreateUserInput,
  CreateWorkLocationPreferenceMutation,
  WorkRegion,
  UpdateUserAsUserInput,
  User,
  PoolCandidate,
} from "../../api/generated";
import applicantProfileRoutes from "../../applicantProfileRoutes";
import directIntakeRoutes from "../../directIntakeRoutes";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import profileMessages from "../profile/profileMessages";

export type FormValues = Pick<
  CreateUserInput,
  "locationPreferences" | "locationExemptions"
>;
export interface WorkLocationPreferenceFormProps {
  initialData: User;
  application?: PoolCandidate;
  handleWorkLocationPreference: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<CreateWorkLocationPreferenceMutation["updateUserAsUser"]>;
}

export const WorkLocationPreferenceForm: React.FC<
  WorkLocationPreferenceFormProps
> = ({ initialData, application, handleWorkLocationPreference }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const profilePaths = applicantProfileRoutes(locale);
  const directIntakePaths = directIntakeRoutes(locale);
  const returnRoute =
    application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
      ? directIntakePaths.poolApply(application.pool.id)
      : profilePaths.home(initialData.id);

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
    defaultValues: dataToFormValues(initialData),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleWorkLocationPreference(
      initialData.id,
      formValuesToSubmitData(data),
    )
      .then(() => {
        navigate(returnRoute);
        toast.success(intl.formatMessage(profileMessages.userUpdated));
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  const applicationBreadcrumbs = application
    ? [
        {
          title: intl.formatMessage({
            defaultMessage: "My Applications",
            description:
              "'My Applications' breadcrumb from applicant profile wrapper.",
          }),
          href: directIntakePaths.applications(application.user.id),
          icon: <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />,
        },
        {
          title:
            application.poolAdvertisement?.name?.[locale] ||
            intl.formatMessage({
              defaultMessage: "Pool name not found",
              description:
                "Pools name breadcrumb from applicant profile wrapper if no name set.",
            }),
          href: directIntakePaths.poolApply(application.pool.id),
        },
      ]
    : [];

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "Indicate all locations where you are willing to work, including your current location (if you are interested in working there).",
        description:
          "Description text for Profile Form wrapper in Work Location Preferences Form",
      })}
      title={intl.formatMessage({
        defaultMessage: "Work location",
        description:
          "Title for Profile Form wrapper  in Work Location Preferences Form",
      })}
      cancelLink={{
        href: returnRoute,
      }}
      crumbs={[
        ...applicationBreadcrumbs,
        {
          title: intl.formatMessage({
            defaultMessage: "Work Location Preference",
            description:
              "Display Text for the current page in Work Location Preference Form Page",
          }),
        },
      ]}
      prefixBreadcrumbs={!application}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div
              data-h2-flex-item="base(1of1)"
              data-h2-padding="base(x1, 0, 0, 0)"
            >
              <div
                data-h2-padding="base(0, x2, 0, 0)"
                data-testid="workLocation"
              >
                <Checklist
                  idPrefix="work-location"
                  legend={intl.formatMessage({
                    defaultMessage: "Work location",
                    description:
                      "Legend for optional work preferences check list in work preferences form",
                  })}
                  name="locationPreferences"
                  items={enumToOptions(WorkRegion).map(({ value }) => ({
                    value,
                    label: intl.formatMessage(getWorkRegionsDetailed(value)),
                  }))}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
            </div>
            <div
              data-h2-flex-item="base(1of1)"
              data-h2-padding="base(x1, 0, 0, 0)"
            >
              <div data-h2-padding="base(0, x2, 0, 0)">
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Indicate if there is a city that you would like to exclude from a region.",
                    description:
                      "Explanation text for Location exemptions field in work location preference form",
                  })}
                </p>
                <p data-h2-color="base(dark.dt-gray)">
                  {intl.formatMessage({
                    defaultMessage:
                      "E.g.: You want to be considered for the Quebec region, but not for Montréal.",
                    description:
                      "Example for Location exemptions field in work location preference form",
                  })}
                </p>
              </div>
            </div>
            <div
              data-h2-flex-item="base(1of2)"
              data-h2-padding="base(x1, 0, 0, 0)"
            >
              <div data-h2-padding="base(0, x2, 0, 0)">
                <TextArea
                  id="location-exemptions"
                  label="Location exemptions"
                  name="locationExemptions"
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

export default WorkLocationPreferenceForm;
