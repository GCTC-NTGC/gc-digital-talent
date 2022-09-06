import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { BasicForm, Input, RadioGroup, Select } from "@common/components/form";
import { errorMessages } from "@common/messages";
import { enumToOptions } from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import { navigate } from "@common/helpers/router";
import {
  getProvinceOrTerritory,
  getLanguage,
  getCitizenshipStatusesProfile,
  getArmedForcesStatusesProfile,
} from "@common/constants/localizedConstants";
import { SubmitHandler } from "react-hook-form";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { BriefcaseIcon } from "@heroicons/react/solid";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import {
  ProvinceOrTerritory,
  Language,
  CitizenshipStatus,
  UpdateUserAsUserMutation,
  PoolCandidate,
  ArmedForcesStatus,
} from "../../api/generated";
import type { User, UpdateUserAsUserInput } from "../../api/generated";
import applicantProfileRoutes from "../../applicantProfileRoutes";
import profileMessages from "../profile/profileMessages";
import directIntakeRoutes from "../../directIntakeRoutes";

export type FormValues = Pick<
  User,
  | "preferredLang"
  | "currentProvince"
  | "currentCity"
  | "telephone"
  | "firstName"
  | "lastName"
  | "email"
  | "citizenship"
  | "armedForcesStatus"
>;

export type AboutMeUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;

export interface AboutMeFormProps {
  initialUser: User;
  application?: PoolCandidate;
  onUpdateAboutMe: AboutMeUpdateHandler;
}

export const AboutMeForm: React.FunctionComponent<AboutMeFormProps> = ({
  initialUser,
  application,
  onUpdateAboutMe,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const profilePaths = applicantProfileRoutes(locale);
  const directIntakePaths = directIntakeRoutes(locale);
  const returnRoute =
    application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
      ? directIntakePaths.poolApply(application.pool.id)
      : profilePaths.home(initialUser.id);

  const initialDataToFormValues = (data?: User | null): FormValues => ({
    preferredLang: data?.preferredLang,
    currentProvince: data?.currentProvince,
    currentCity: data?.currentCity,
    telephone: data?.telephone,
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
    citizenship: data?.citizenship,
    armedForcesStatus: data?.armedForcesStatus,
  });

  const formValuesToSubmitData = (data: FormValues): UpdateUserAsUserInput => {
    return data;
  };

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    await onUpdateAboutMe(initialUser.id, formValuesToSubmitData(formValues))
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
          href: directIntakePaths.applications(application.user.id),
          icon: <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />,
        },
        {
          title:
            application.poolAdvertisement?.name?.[locale] ||
            intl.formatMessage({
              defaultMessage: "Pool name not found",
              id: "FmD1sL",
              description:
                "Pools name breadcrumb from applicant profile wrapper if no name set.",
            }),
          href: directIntakePaths.poolApply(application.pool.id),
        },
      ]
    : [];

  // citizenship statuses ordered to fit prototype
  const citizenshipStatusesOrdered = [
    CitizenshipStatus.Citizen,
    CitizenshipStatus.PermanentResident,
    CitizenshipStatus.Other,
  ];

  const armedForcesStatusOrdered = [
    ArmedForcesStatus.NonCaf,
    ArmedForcesStatus.Member,
    ArmedForcesStatus.Veteran,
  ];

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "This information is used for account management and communications purposes, it has no impact on the job matching or job recommendations.",
        id: "B/LE8S",
        description:
          "Description text for the Profile Form wrapper in the About Me form",
      })}
      title={intl.formatMessage({
        defaultMessage: "About me",
        id: "XY19Sh",
        description: "Title for Profile Form wrapper in About me form",
      })}
      cancelLink={{
        href: returnRoute,
      }}
      prefixBreadcrumbs={!application}
      crumbs={[
        ...applicationBreadcrumbs,
        {
          title: intl.formatMessage({
            defaultMessage: "About Me",
            id: "uG2MuI",
            description: "Display text for About Me Form Page Link",
          }),
        },
      ]}
    >
      <BasicForm
        onSubmit={handleSubmit}
        options={{
          defaultValues: initialDataToFormValues(initialUser),
        }}
      >
        <h2
          data-h2-margin="base(x2, 0, x1, 0)"
          data-h2-font-size="base(h3, 1.3)"
          data-h2-font-weight="base(700)"
        >
          {intl.formatMessage({
            defaultMessage: "Personal Information",
            id: "7qR4UK",
            description:
              "Title for Personal Information section of the About Me form",
          })}
        </h2>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "This additional personal information will be used only for communication purposes.",
            id: "JjPpGt",
            description:
              "Description for Personal Information section of the About Me form",
          })}
        </p>
        <div data-h2-flex-item="base(1of1)" data-h2-padding="base(x1, 0, 0, 0)">
          <div>
            <RadioGroup
              idPrefix="required-lang-preferences"
              legend={intl.formatMessage({
                defaultMessage: "Language preference for communication",
                id: "D8IMp7",
                description:
                  "Legend text for required language preference in About Me form",
              })}
              name="preferredLang"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
              items={enumToOptions(Language).map(({ value }) => ({
                value,
                label: intl.formatMessage(getLanguage(value)),
              }))}
            />
            <Select
              id="currentProvince"
              name="currentProvince"
              label={intl.formatMessage({
                defaultMessage: "Current province or territory",
                id: "r4PFx0",
                description:
                  "Label for current province or territory field in About Me form",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a province or territory...",
                id: "M6PbPI",
                description:
                  "Placeholder displayed on the About Me form province or territory field.",
              })}
              options={enumToOptions(ProvinceOrTerritory).map(({ value }) => ({
                value,
                label: intl.formatMessage(getProvinceOrTerritory(value)),
              }))}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="currentCity"
              name="currentCity"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "Current city",
                id: "de/Vcy",
                description: "Label for current city field in About Me form",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Start writing here...",
                id: "xq6TbG",
                description:
                  "Placeholder displayed on the About Me form current city field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="telephone"
              name="telephone"
              type="tel"
              label={intl.formatMessage({
                defaultMessage: "Telephone",
                id: "gBWsuB",
                description: "Label for telephone field in About Me form",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "+123243234",
                id: "FmN1eN",
                description:
                  "Placeholder displayed on the About Me form telephone field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <RadioGroup
              idPrefix="armedForcesStatus"
              legend={intl.formatMessage({
                defaultMessage: "Member of the Canadian Armed Forces (CAF)",
                id: "DZwVvi",
                description:
                  "Legend text for required Canadian Armed Forces selection in About Me form",
              })}
              name="armedForcesStatus"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
              items={armedForcesStatusOrdered.map((status) => ({
                value: status,
                label: intl.formatMessage(
                  getArmedForcesStatusesProfile(status),
                ),
              }))}
            />
            <div data-h2-margin="base(x1, 0, 0, 0)">
              <RadioGroup
                idPrefix="citizenship"
                legend={intl.formatMessage({
                  defaultMessage: "Citizenship Status",
                  id: "o5pks7",
                  description:
                    "Legend text for required citizenship status in About Me form",
                })}
                name="citizenship"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                items={citizenshipStatusesOrdered.map((status) => ({
                  value: status,
                  label: intl.formatMessage(
                    getCitizenshipStatusesProfile(status),
                  ),
                }))}
                context={intl.formatMessage({
                  defaultMessage:
                    "Preference will be given to Canadian citizens and permanent residents of Canada",
                  id: "fI6Hjf",
                  description:
                    "Context text for required citizenship status section in About Me form, explaining preference",
                })}
              />
            </div>
          </div>
        </div>
        <h2
          data-h2-margin="base(x2, 0, x1, 0)"
          data-h2-font-size="base(h3, 1.3)"
          data-h2-font-weight="base(700)"
        >
          {intl.formatMessage({
            defaultMessage: "Account Details",
            id: "GqVBqi",
            description:
              "Title for Account Details section of the About Me form",
          })}
        </h2>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "This information is used to manage your account and to communicate.",
            id: "ghmTOo",
            description:
              "Description for Account Details section of the About Me form",
          })}
        </p>
        <div data-h2-flex-item="base(1of1)">
          <div>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "First Name and Middle Name",
                id: "g097KT",
                description:
                  "Label for first and middle name field in About Me form",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="lastName"
              name="lastName"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "Last Name(s)",
                id: "rGNWy6",
                description: "Label for last name field in About Me form",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="email"
              name="email"
              type="email"
              label={intl.formatMessage({
                defaultMessage: "Email",
                id: "i5xxbe",
                description: "Label for email field in About Me form",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </div>
        </div>
        <hr
          data-h2-height="base(1px)"
          data-h2-border="base(none)"
          data-h2-background-color="base(dt-gray)"
          data-h2-margin="base(x2, 0)"
        />
        <ProfileFormFooter mode="saveButton" />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export default AboutMeForm;
