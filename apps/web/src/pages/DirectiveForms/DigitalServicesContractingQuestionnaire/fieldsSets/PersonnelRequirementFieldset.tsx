import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Input, Select } from "@gc-digital-talent/forms";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  PersonnelLanguage,
  PersonnelScreeningLevel,
  PersonnelTeleworkOption,
} from "@gc-digital-talent/graphql";

import {
  getPersonnelLanguage,
  getPersonnelScreeningLevel,
  getPersonnelTeleworkOption,
} from "../../localizedConstants";
import { enumToOptions } from "../../util";

type PersonnelRequirementFieldsetProps = {
  fieldsetName: string;
};

const PersonnelRequirementFieldset = ({
  fieldsetName,
}: PersonnelRequirementFieldsetProps) => {
  const intl = useIntl();
  const { watch, resetField } = useFormContext();

  // hooks to watch, needed for conditional rendering
  const [selectedLanguage, selectedSecurity] = watch([
    `${fieldsetName}.language`,
    `${fieldsetName}.security`,
  ]);

  const isLanguageOther = selectedLanguage === PersonnelLanguage.Other;
  const isSecurityOther = selectedSecurity === PersonnelScreeningLevel.Other;
  /**
   * Reset un-rendered fields
   */
  React.useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false });
    };

    // Reset all optional fields
    if (!isLanguageOther) {
      resetDirtyField(`${fieldsetName}.languageOther`);
    }
    if (!isSecurityOther) {
      resetDirtyField(`${fieldsetName}.securityOther`);
    }
  }, [resetField, isLanguageOther, fieldsetName, isSecurityOther]);

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.5)"
    >
      <Input
        id={`${fieldsetName}.resourceType`}
        name={`${fieldsetName}.resourceType`}
        type="text"
        label={intl.formatMessage({
          defaultMessage: "Type of resource",
          id: "UW3Z2a",
          description:
            "Label for _type of resource_ fieldset in the _digital services contracting questionnaire_",
        })}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Select
        id={`${fieldsetName}.language`}
        name={`${fieldsetName}.language`}
        label={intl.formatMessage({
          defaultMessage: "Official language requirement",
          id: "gZKJeF",
          description:
            "Label for _official language requirement_ fieldset in the _digital services contracting questionnaire_",
        })}
        nullSelection={intl.formatMessage(formMessages.defaultPlaceholder)}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        doNotSort
        options={enumToOptions(PersonnelLanguage, [
          PersonnelLanguage.EnglishOnly,
          PersonnelLanguage.FrenchOnly,
          PersonnelLanguage.BilingualIntermediate,
          PersonnelLanguage.BilingualAdvanced,
          PersonnelLanguage.Other,
        ]).map((option) => {
          return {
            value: option.value as string,
            label: intl.formatMessage(getPersonnelLanguage(option.value)),
          };
        })}
      />
      {isLanguageOther ? (
        <Input
          id={`${fieldsetName}.languageOther`}
          name={`${fieldsetName}.languageOther`}
          type="text"
          label={intl.formatMessage(formMessages.specifyOther)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      ) : null}
      <Select
        id={`${fieldsetName}.security`}
        name={`${fieldsetName}.security`}
        label={intl.formatMessage({
          defaultMessage: "Security level",
          id: "zemp3H",
          description:
            "Label for _security level_ fieldset in the _digital services contracting questionnaire_",
        })}
        nullSelection={intl.formatMessage(formMessages.defaultPlaceholder)}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        doNotSort
        options={enumToOptions(PersonnelScreeningLevel, [
          PersonnelScreeningLevel.Reliability,
          PersonnelScreeningLevel.EnhancedReliability,
          PersonnelScreeningLevel.Secret,
          PersonnelScreeningLevel.TopSecret,
          PersonnelScreeningLevel.Other,
        ]).map((option) => {
          return {
            value: option.value as string,
            label: intl.formatMessage(getPersonnelScreeningLevel(option.value)),
          };
        })}
      />
      {isSecurityOther ? (
        <Input
          id={`${fieldsetName}.securityOther`}
          name={`${fieldsetName}.securityOther`}
          type="text"
          label={intl.formatMessage(formMessages.specifyOther)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      ) : null}
      <Select
        id={`${fieldsetName}.telework`}
        name={`${fieldsetName}.telework`}
        label={intl.formatMessage({
          defaultMessage: "Telework allowed",
          id: "DeQTkE",
          description:
            "Label for _telework option_ fieldset in the _digital services contracting questionnaire_",
        })}
        nullSelection={intl.formatMessage(formMessages.defaultPlaceholder)}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        doNotSort
        options={enumToOptions(PersonnelTeleworkOption, [
          PersonnelTeleworkOption.FullTime,
          PersonnelTeleworkOption.PartTime,
          PersonnelTeleworkOption.No,
        ]).map((option) => {
          return {
            value: option.value as string,
            label: intl.formatMessage(getPersonnelTeleworkOption(option.value)),
          };
        })}
      />
      <Input
        id={`${fieldsetName}.quantity`}
        name={`${fieldsetName}.quantity`}
        type="number"
        label={intl.formatMessage({
          defaultMessage: "Quantity",
          id: "5yv4Ko",
          description:
            "Label for _quantity of personnel_ field in the _digital services contracting questionnaire_",
        })}
        rules={{
          required: intl.formatMessage(errorMessages.required),
          min: {
            value: 1,
            message: intl.formatMessage(errorMessages.mustBeGreater, {
              value: 0,
            }),
          },
        }}
      />
    </div>
  );
};

export default PersonnelRequirementFieldset;
