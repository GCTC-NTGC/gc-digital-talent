import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import {
  Input,
  RadioGroup,
  Select,
  enumToOptions,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
  getLanguage,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";

import { Language, ProvinceOrTerritory } from "~/api/generated";

import { FormFieldProps } from "../../types";
import { armedForcesStatusOrdered, citizenshipStatusesOrdered } from "./utils";
import useDirtyFields from "../../hooks/useDirtyFields";

const FormFields = ({ labels }: FormFieldProps) => {
  const intl = useIntl();
  useDirtyFields("personal");

  return (
    <>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="base(1fr 1fr)"
        data-h2-gap="base(0 x1)"
        data-h2-margin-top="base(-x1)"
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
        <Select
          id="currentProvince"
          name="currentProvince"
          label={labels.currentProvince}
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
          label={labels.currentCity}
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
      </div>
      <div
        data-h2-display="base(grid)"
        data-h2-gap="l-tablet(0 x1)"
        data-h2-grid-template-columns="l-tablet(1fr 1fr 1fr)"
      >
        <Select
          id="preferredLang"
          label={labels.preferredLang}
          name="preferredLang"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          nullSelection={intl.formatMessage({
            defaultMessage: "Select a language...",
            id: "wRxZQV",
            description:
              "Placeholder displayed on the About Me form preferred communication language",
          })}
          options={enumToOptions(Language).map(({ value }) => ({
            value,
            label: intl.formatMessage(getLanguage(value)),
          }))}
        />
        <Select
          id="preferredLanguageForInterview"
          label={labels.preferredLanguageForInterview}
          name="preferredLanguageForInterview"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          nullSelection={intl.formatMessage({
            defaultMessage: "Select a language...",
            id: "JCyvcW",
            description:
              "Placeholder displayed on the About Me form preferred interview language",
          })}
          options={enumToOptions(Language).map(({ value }) => ({
            value,
            label: intl.formatMessage(getLanguage(value)),
          }))}
        />
        <Select
          id="preferredLanguageForExam"
          label={labels.preferredLanguageForExam}
          name="preferredLanguageForExam"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          nullSelection={intl.formatMessage({
            defaultMessage: "Select a language...",
            id: "PBl2Rj",
            description:
              "Placeholder displayed on the About Me form preferred exam language",
          })}
          options={enumToOptions(Language).map(({ value }) => ({
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
          context={intl.formatMessage({
            defaultMessage:
              "Preference will be given to Canadian citizens and permanent residents of Canada",
            id: "fI6Hjf",
            description:
              "Context text for required citizenship status section in About Me form, explaining preference",
          })}
        />
      </div>
    </>
  );
};

export default FormFields;
