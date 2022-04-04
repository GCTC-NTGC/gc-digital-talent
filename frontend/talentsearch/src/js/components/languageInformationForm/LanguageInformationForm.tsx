import React from "react";
import { useIntl } from "react-intl";
import { errorMessages } from "@common/messages";
import { Checklist } from "@common/components/form";
import { getLocale } from "@common/helpers/localize";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { fakeUsers } from "@common/fakeData";
import { User } from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

type FormValues = Pick<
  User,
  | "lookingForEnglish"
  | "lookingForFrench"
  | "lookingForBilingual"
  | "bilingualEvaluation"
  | "comprehensionLevel"
  | "writtenLevel"
  | "verbalLevel"
  | "estimatedLanguageAbility"
>;

export const LanguageInformationForm: React.FunctionComponent<{
  self: User;
}> = ({ self }) => {
  const intl = useIntl();

  // TODO: Should probably move this into a constants file
  const ConsideredLangItems: { value: string; label: string }[] = [
    {
      value: "english-positions",
      label: intl.formatMessage({
        defaultMessage: "English positions",
        description: "Message for the english positions option",
      }),
    },
    {
      value: "french-positions",
      label: intl.formatMessage({
        defaultMessage: "French positions",
        description: "Message for the french positions option",
      }),
    },
    {
      value: "bilingual-positions",
      label: intl.formatMessage({
        defaultMessage: "Bilingual positions (English and French)",
        description: "Message for the bilingual positions option",
      }),
    },
  ];

  return (
    <Checklist
      idPrefix="considered-position-languages"
      legend={intl.formatMessage({
        defaultMessage:
          "Select the positions you would like to be considered for",
        description:
          "Legend for considered position languages check list in language information form",
      })}
      name="consideredPositionLanguages"
      rules={{
        required: intl.formatMessage(errorMessages.required),
      }}
      items={ConsideredLangItems}
    />
  );
};

export const LanguageInformationFormContainer: React.FunctionComponent = () => {
  const intl = useIntl();

  // TODO: Update this with an api call
  const self = fakeUsers()[0];

  const methods = useForm<FormValues>({
    // TODO: Update default values here
    defaultValues: {},
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {};

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "Use the form below to help us better understand your language preferences and capabilities",
        description:
          "Description text for Profile Form wrapper in Language Information Form",
      })}
      title={intl.formatMessage({
        defaultMessage: "Language Information",
        description:
          "Title for Profile Form wrapper in Language Information Form",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "Language Information",
            description: "Display Text for Language Information Form Page Link",
          }),
        },
      ]}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <LanguageInformationForm self={self} />
          <ProfileFormFooter mode="saveButton" />
        </form>
      </FormProvider>
    </ProfileFormWrapper>
  );
};

export default LanguageInformationFormContainer;
