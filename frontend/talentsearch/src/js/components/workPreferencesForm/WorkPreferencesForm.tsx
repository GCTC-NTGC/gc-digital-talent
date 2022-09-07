import React from "react";
import { useIntl } from "react-intl";
import { commonMessages, errorMessages } from "@common/messages";
import { Checklist, RadioGroup } from "@common/components/form";
import {
  getOperationalRequirement,
  OperationalRequirementV2,
} from "@common/constants/localizedConstants";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { getLocale } from "@common/helpers/localize";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { navigate } from "@common/helpers/router";
import { toast } from "react-toastify";
import { BriefcaseIcon } from "@heroicons/react/24/solid";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import {
  PoolCandidate,
  UpdateUserAsUserInput,
  UpdateWorkPreferencesMutation,
  User,
} from "../../api/generated";
import applicantProfileRoutes from "../../applicantProfileRoutes";
import directIntakeRoutes from "../../directIntakeRoutes";
import profileMessages from "../profile/profileMessages";

export type FormValues = Pick<
  UpdateUserAsUserInput,
  "acceptedOperationalRequirements"
> & {
  wouldAcceptTemporary?: string;
};
export interface WorkPreferencesFormProps {
  initialData: User;
  application?: PoolCandidate;
  handleWorkPreferences: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<UpdateWorkPreferencesMutation["updateUserAsUser"]>;
}

export const WorkPreferencesForm: React.FC<WorkPreferencesFormProps> = ({
  initialData,
  application,
  handleWorkPreferences,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const profilePaths = applicantProfileRoutes(locale);
  const directIntakePaths = directIntakeRoutes(locale);
  const returnRoute =
    application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
      ? directIntakePaths.reviewApplication(application.id)
      : profilePaths.home(initialData.id);

  const dataToFormValues = (data: User): FormValues => {
    const boolToString = (boolVal: boolean | null | undefined): string => {
      return boolVal ? "true" : "false";
    };

    return {
      wouldAcceptTemporary: data.wouldAcceptTemporary
        ? boolToString(data.wouldAcceptTemporary)
        : undefined,
      acceptedOperationalRequirements: data.acceptedOperationalRequirements,
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
    await handleWorkPreferences(initialData.id, formValuesToSubmitData(data))
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
        {
          href: directIntakePaths.reviewApplication(application.id),
          title: intl.formatMessage(commonMessages.stepOne),
        },
      ]
    : [];

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
      cancelLink={{
        href: returnRoute,
      }}
      crumbs={[
        ...applicationBreadcrumbs,
        {
          title: intl.formatMessage({
            defaultMessage: "Work Preferences",
            description: "Display Text for Work Preferences Form Page Link",
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
                <ProfileFormFooter
                  mode="saveButton"
                  cancelLink={{ href: returnRoute }}
                />
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </ProfileFormWrapper>
  );
};

export default WorkPreferencesForm;
