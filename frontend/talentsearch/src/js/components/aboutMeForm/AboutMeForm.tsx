import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { OperationResult } from "urql";
import { BasicForm, Input, RadioGroup, Select } from "@common/components/form";
import {
  ProvinceOrTerritory,
  Language,
  CitizenshipStatus,
} from "@common/api/generated";
import { commonMessages, errorMessages } from "@common/messages";
import { enumToOptions } from "@common/helpers/formUtils";
import { getLocale } from "@common/helpers/localize";
import { navigate } from "@common/helpers/router";
import {
  getProvinceOrTerritory,
  getLanguage,
  getCitizenshipStatusesProfile,
} from "@common/constants/localizedConstants";
import { SubmitHandler } from "react-hook-form";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import {
  useUpdateUserAsUserMutation,
  useGetAboutMeQuery,
  UpdateUserAsUserMutation,
  Exact,
} from "../../api/generated";
import type { User, UpdateUserAsUserInput } from "../../api/generated";
import applicantProfileRoutes from "../../applicantProfileRoutes";
import profileMessages from "../profile/profileMessages";

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
> & { isVeteran: string };

export type AboutMeUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;

export interface AboutMeFormProps {
  initialUser: User;
  onUpdateAboutMe: AboutMeUpdateHandler;
}

export const AboutMeForm: React.FunctionComponent<AboutMeFormProps> = ({
  initialUser,
  onUpdateAboutMe,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = applicantProfileRoutes(locale);

  const initialDataToFormValues = (data?: User | null): FormValues => ({
    preferredLang: data?.preferredLang,
    currentProvince: data?.currentProvince,
    currentCity: data?.currentCity,
    telephone: data?.telephone,
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
    citizenship: data?.citizenship,
    isVeteran: data?.isVeteran === true ? "true" : "false",
  });

  const formValuesToSubmitData = (data: FormValues): UpdateUserAsUserInput => {
    return { ...data, isVeteran: data.isVeteran === "true" };
  };

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    await onUpdateAboutMe(initialUser.id, formValuesToSubmitData(formValues))
      .then(() => {
        navigate(paths.home(initialUser.id));
        toast.success(intl.formatMessage(profileMessages.userUpdated));
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  // citizenship statuses ordered to fit prototype
  const citizenshipStatusesOrdered = [
    CitizenshipStatus.Citizen,
    CitizenshipStatus.PermanentResident,
    CitizenshipStatus.Other,
  ];

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "This information is used for account management and communications purposes, it has no impact on the job matching or job recommendations.",
        description:
          "Description text for the Profile Form wrapper in the About Me form",
      })}
      title={intl.formatMessage({
        defaultMessage: "About me",
        description: "Title for Profile Form wrapper in About me form",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "About Me",
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
        <h2 data-h2-font-size="b(h3)" data-h2-font-weight="b(700)">
          {intl.formatMessage({
            defaultMessage: "Personal Information",
            description:
              "Title for Personal Information section of the About Me form",
          })}
        </h2>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "This additional personal information will be used only for communication purposes.",
            description:
              "Description for Personal Information section of the About Me form",
          })}
        </p>
        <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
          <div data-h2-padding="b(right, l)">
            <RadioGroup
              idPrefix="required-lang-preferences"
              legend={intl.formatMessage({
                defaultMessage: "Language preference for communication",
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
                description:
                  "Label for current province or territory field in About Me form",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a province or territory...",
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
                description: "Label for current city field in About Me form",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Start writing here...",
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
                description: "Label for telephone field in About Me form",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "+123243234",
                description:
                  "Placeholder displayed on the About Me form telephone field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <RadioGroup
              idPrefix="isVeteran"
              legend={intl.formatMessage({
                defaultMessage: "Member of the Canadian Armed Forces (CAF)",
                description:
                  "Legend text for required Canadian Armed Forces selection in About Me form",
              })}
              name="isVeteran"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
              items={[
                {
                  value: "false",
                  label: intl.formatMessage({
                    defaultMessage: "I am not a veteran of the CAF",
                    description:
                      "Label for the not a veteran selection in the About Me form",
                  }),
                },
                {
                  value: "true",
                  label: intl.formatMessage({
                    defaultMessage: "I am a member or veteran of the CAF",
                    description:
                      "Label for the currently a member or veteran selection in the About Me form",
                  }),
                },
              ]}
            />
            <RadioGroup
              idPrefix="citizenship"
              legend={intl.formatMessage({
                defaultMessage: "Citizenship Status",
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
                description:
                  "Context text for required citizenship status section in About Me form, explaining preference",
              })}
            />
          </div>
        </div>
        <h2 data-h2-font-size="b(h3)" data-h2-font-weight="b(700)">
          {intl.formatMessage({
            defaultMessage: "Account Details",
            description:
              "Title for Account Details section of the About Me form",
          })}
        </h2>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "This information is used to manage your account and to communicate.",
            description:
              "Description for Account Details section of the About Me form",
          })}
        </p>
        <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
          <div data-h2-padding="b(right, l)">
            <Input
              id="firstName"
              name="firstName"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "First Name and Middle Name",
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
                description: "Label for email field in About Me form",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </div>
        </div>
        <ProfileFormFooter mode="saveButton" />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

const AboutMeFormContainer: React.FunctionComponent = () => {
  const intl = useIntl();

  const [result] = useGetAboutMeQuery();
  const { data, fetching, error } = result;
  const preProfileStatus = data?.me?.isProfileComplete;

  const [, executeMutation] = useUpdateUserAsUserMutation();

  const handleUpdateUser = (id: string, values: UpdateUserAsUserInput) => {
    return executeMutation({ id, user: values }).then(
      (
        res: OperationResult<
          UpdateUserAsUserMutation,
          Exact<{ id: string; user: UpdateUserAsUserInput }>
        >,
      ) => {
        if (res.data?.updateUserAsUser) {
          const currentProfileStatus =
            res.data?.updateUserAsUser?.isProfileComplete;
          const message = intl.formatMessage(profileMessages.profileCompleted);
          if (!preProfileStatus && currentProfileStatus) {
            toast.success(message);
          }
          return res.data.updateUserAsUser;
        }

        return Promise.reject(res.error);
      },
    );
  };

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <AboutMeForm initialUser={data.me} onUpdateAboutMe={handleUpdateUser} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export default AboutMeFormContainer;
