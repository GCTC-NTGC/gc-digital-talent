import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";
import { BriefcaseIcon } from "@heroicons/react/24/solid";

import { errorMessages, navigationMessages } from "@common/messages";
import { BasicForm, Checklist, RadioGroup } from "@common/components/form";
import {
  getOperationalRequirement,
  OperationalRequirementV2,
} from "@common/constants/localizedConstants";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { toast } from "@common/components/Toast";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";

import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import {
  PoolCandidate,
  PositionDuration,
  UpdateUserAsUserInput,
  UpdateWorkPreferencesMutation,
  User,
} from "../../api/generated";
import useRoutes from "../../hooks/useRoutes";
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

interface WithEllipsisPrefixProps {
  children: React.ReactNode;
}
/**
 * Helps p repend ellipses to other strings.
 * (Whitespace conventions for using the ellipsis varies between languages.)
 *
 * @see https://www.btb.termiumplus.gc.ca/tcdnstyl-chap?lang=eng&lettr=chapsect17&info0=17.07
 */
const WithEllipsisPrefix = ({ children }: WithEllipsisPrefixProps) => {
  const { formatMessage } = useIntl();
  const ellipsisPrefix = formatMessage({
    defaultMessage: "...",
    id: ".ellipsis",
  });

  return (
    <>
      {ellipsisPrefix}
      {children}
    </>
  );
};

export const WorkPreferencesForm: React.FC<WorkPreferencesFormProps> = ({
  initialData,
  application,
  handleWorkPreferences,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const returnRoute =
    application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
      ? paths.reviewApplication(application.id)
      : paths.profile(initialData.id);

  const labels = {
    wouldAcceptTemporary: intl.formatMessage({
      defaultMessage: "I would consider accepting a job that lasts for:",
      id: "GNtu/7",
      description:
        "Legend Text for required work preferences options in work preferences form",
    }),
    acceptedOperationalRequirements: intl.formatMessage({
      defaultMessage: "I would consider accepting a job that:",
      id: "Vvb8tu",
      description:
        "Legend for optional work preferences check list in work preferences form",
    }),
  };

  const dataToFormValues = (data: User): FormValues => {
    const boolToString = (boolVal: boolean | null | undefined): string => {
      return boolVal ? "true" : "false";
    };

    return {
      wouldAcceptTemporary: data.positionDuration
        ? boolToString(
            data.positionDuration.includes(PositionDuration.Temporary),
          )
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
      positionDuration: stringToBool(values.wouldAcceptTemporary)
        ? [PositionDuration.Permanent, PositionDuration.Temporary]
        : [PositionDuration.Permanent], // always accepting permanent, accepting temporary is what is variable
      acceptedOperationalRequirements: values.acceptedOperationalRequirements,
    };
  };

  const handleSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
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
            id: "mq4G8h",
            description:
              "'My Applications' breadcrumb from applicant profile wrapper.",
          }),
          href: paths.applications(application.user.id),
          icon: <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />,
        },
        {
          title: getFullPoolAdvertisementTitle(
            intl,
            application.poolAdvertisement,
          ),
          href: paths.pool(application.pool.id),
        },
        {
          href: paths.reviewApplication(application.id),
          title: intl.formatMessage(navigationMessages.stepOne),
        },
      ]
    : [];

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "Certain jobs require you to work odd hours or perform tasks that are a little outside of the normal. Please indicate which special requirements you are comfortable with.",
        id: "jp6hlj",
        description:
          "Description text for Profile Form wrapper in Work Preferences Form",
      })}
      title={intl.formatMessage({
        defaultMessage: "Work preferences",
        id: "64Pv6e",
        description: "Title for Profile Form wrapper in Work Preferences Form",
      })}
      cancelLink={{
        href: returnRoute,
      }}
      crumbs={[
        ...applicationBreadcrumbs,
        {
          title: intl.formatMessage({
            defaultMessage: "Work Preferences",
            id: "7OWQgZ",
            description: "Display Text for Work Preferences Form Page Link",
          }),
        },
      ]}
      prefixBreadcrumbs={!application}
    >
      <BasicForm
        cacheKey="work-preferences-form"
        onSubmit={handleSubmit}
        labels={labels}
        options={{
          defaultValues: dataToFormValues(initialData),
        }}
      >
        <div>
          <div
            data-h2-flex-item="base(1of1)"
            data-h2-padding="base(x1, 0, 0, 0)"
          >
            <div data-h2-padding="base(0, x2, 0, 0)">
              <RadioGroup
                idPrefix="required-work-preferences"
                legend={labels.wouldAcceptTemporary}
                name="wouldAcceptTemporary"
                id="wouldAcceptTemporary"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                items={[
                  {
                    value: "true",
                    label: (
                      <WithEllipsisPrefix>
                        {intl.formatMessage({
                          defaultMessage:
                            "any duration. (short term, long term, or indeterminate duration)",
                          id: "uHx3G7",
                          description:
                            "Label displayed on Work Preferences form for any duration option",
                        })}
                      </WithEllipsisPrefix>
                    ),
                  },
                  {
                    value: "false",
                    label: intl.formatMessage({
                      defaultMessage:
                        "...indeterminate duration only. (permanent only)",
                      id: "sYqIp5",
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
                legend={labels.acceptedOperationalRequirements}
                name="acceptedOperationalRequirements"
                id="acceptedOperationalRequirements"
                items={OperationalRequirementV2.map((value) => ({
                  value,
                  label: (
                    <WithEllipsisPrefix>
                      {intl.formatMessage(
                        getOperationalRequirement(value, "firstPerson"),
                      )}
                    </WithEllipsisPrefix>
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
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export default WorkPreferencesForm;
