import { useIntl } from "react-intl";

import {
  Input,
  RadioGroup,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  formMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
} from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { FormFieldProps } from "../../types";
import useDirtyFields from "../../hooks/useDirtyFields";
import { armedForcesStatusOrdered, citizenshipStatusesOrdered } from "./utils";

const PersonalInformationFormOptions_Fragment = graphql(/* GraphQL */ `
  fragment PersonalInformationFormOptions on Query {
    languages: localizedEnumStrings(enumName: "Language") {
      value
      label {
        en
        fr
      }
    }
  }
`);

const FormFields = ({
  labels,
  optionsQuery,
}: FormFieldProps<
  FragmentType<typeof PersonalInformationFormOptions_Fragment>
>) => {
  const intl = useIntl();
  const data = getFragment(
    PersonalInformationFormOptions_Fragment,
    optionsQuery,
  );
  useDirtyFields("personal");

  const languageOptions = localizedEnumToOptions(data?.languages, intl);

  return (
    <>
      <div className="mb-6 grid gap-6 sm:grid-cols-2">
        <Input
          id="firstName"
          name="firstName"
          type="text"
          label={labels.firstName}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <Input
          id="lastName"
          name="lastName"
          type="text"
          label={labels.lastName}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <Input
          id="email"
          name="email"
          type="email"
          label={labels.email}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <Input
          id="telephone"
          name="telephone"
          type="tel"
          label={labels.telephone}
          placeholder={intl.formatMessage(formMessages.phonePlaceholder)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
      <div className="mb-6 grid gap-6 sm:grid-cols-3">
        <RadioGroup
          id="preferredLang"
          legend={labels.preferredLang}
          idPrefix="preferredLang"
          name="preferredLang"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          items={languageOptions}
        />
        <RadioGroup
          id="preferredLanguageForInterview"
          legend={labels.preferredLanguageForInterview}
          idPrefix="preferredLanguageForInterview"
          name="preferredLanguageForInterview"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          items={languageOptions}
        />
        <RadioGroup
          id="preferredLanguageForExam"
          legend={labels.preferredLanguageForExam}
          idPrefix="preferredLanguageForExam"
          name="preferredLanguageForExam"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          items={languageOptions}
        />
      </div>
      <div className="mb-6">
        <RadioGroup
          idPrefix="armedForcesStatus"
          legend={labels.armedForcesStatus}
          name="armedForcesStatus"
          id="armedForcesStatus"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          items={armedForcesStatusOrdered.map((status) => ({
            value: status,
            label: intl.formatMessage(getArmedForcesStatusesProfile(status)),
          }))}
        />
      </div>
      <div className="mb-6">
        <RadioGroup
          idPrefix="citizenship"
          legend={labels.citizenship}
          name="citizenship"
          id="citizenship"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          items={citizenshipStatusesOrdered.map((status) => ({
            value: status,
            label: intl.formatMessage(getCitizenshipStatusesProfile(status)),
          }))}
        />
      </div>
    </>
  );
};

export default FormFields;
