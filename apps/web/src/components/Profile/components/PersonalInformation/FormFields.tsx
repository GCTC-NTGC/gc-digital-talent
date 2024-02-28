import React from "react";
import { useIntl } from "react-intl";

import {
  Input,
  RadioGroup,
  Select,
  enumToOptions,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  formMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
  getLanguage,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";
import { Language, ProvinceOrTerritory } from "@gc-digital-talent/graphql";

import { FormFieldProps } from "../../types";
import useDirtyFields from "../../hooks/useDirtyFields";
import { armedForcesStatusOrdered, citizenshipStatusesOrdered } from "./utils";

const FormFields = ({ labels }: FormFieldProps) => {
  const intl = useIntl();
  useDirtyFields("personal");

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
          options={enumToOptions(ProvinceOrTerritory).map(({ value }) => ({
            value,
            label: intl.formatMessage(getProvinceOrTerritory(value)),
          }))}
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
          items={enumToOptions(Language).map(({ value }) => ({
            value,
            label: intl.formatMessage(getLanguage(value)),
          }))}
        />
        <RadioGroup
          id="preferredLanguageForInterview"
          legend={labels.preferredLanguageForInterview}
          idPrefix="preferredLanguageForInterview"
          name="preferredLanguageForInterview"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          items={enumToOptions(Language).map(({ value }) => ({
            value,
            label: intl.formatMessage(getLanguage(value)),
          }))}
        />
        <RadioGroup
          id="preferredLanguageForExam"
          legend={labels.preferredLanguageForExam}
          idPrefix="preferredLanguageForExam"
          name="preferredLanguageForExam"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          items={enumToOptions(Language).map(({ value }) => ({
            value,
            label: intl.formatMessage(getLanguage(value)),
          }))}
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
