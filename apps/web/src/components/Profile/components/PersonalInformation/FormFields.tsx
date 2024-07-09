import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  Input,
  RadioGroup,
  Select,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  formMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
} from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";

import { FormFieldProps } from "../../types";
import useDirtyFields from "../../hooks/useDirtyFields";
import { armedForcesStatusOrdered, citizenshipStatusesOrdered } from "./utils";

const PersonalInformationFormOptions_Query = graphql(/* GraphQL */ `
  query PersonalInformationFormOptions {
    languages: localizedEnumStrings(enumName: "Language") {
      value
      label {
        en
        fr
      }
    }
    provinceOrTerritories: localizedEnumStrings(
      enumName: "ProvinceOrTerritory"
    ) {
      value
      label {
        en
        fr
      }
    }
  }
`);

const FormFields = ({ labels }: FormFieldProps) => {
  const intl = useIntl();
  const [{ data }] = useQuery({ query: PersonalInformationFormOptions_Query });
  useDirtyFields("personal");

  const languageOptions = localizedEnumToOptions(data?.languages, intl);

  return (
    <>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="l-tablet(1fr 1fr)"
        data-h2-gap="base(x1)"
        data-h2-margin-bottom="base(x1)"
      >
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
        <Input
          id="currentCity"
          name="currentCity"
          type="text"
          label={labels.currentCity}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <Select
          id="currentProvince"
          name="currentProvince"
          label={labels.currentProvince}
          nullSelection={intl.formatMessage({
            defaultMessage: "Select a province or territory",
            id: "H1wLfA",
            description:
              "Placeholder displayed on the About Me form province or territory field.",
          })}
          options={localizedEnumToOptions(data?.provinceOrTerritories, intl)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="l-tablet(1fr 1fr 1fr)"
        data-h2-margin-bottom="base(x1)"
      >
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
      <div data-h2-margin-bottom="base(x1)">
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
      <div data-h2-margin-bottom="base(x1)">
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
