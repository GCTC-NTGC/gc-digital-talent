import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import kebabCase from "lodash/kebabCase";

import { Input, Combobox } from "@gc-digital-talent/forms";
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Maybe, Department } from "@gc-digital-talent/graphql";

import adminMessages from "~/messages/adminMessages";

interface CreateTeamFormFieldsProps {
  departments?: Maybe<Array<Maybe<Omit<Department, "teams">>>>;
}

const CreateTeamFormFields = ({ departments }: CreateTeamFormFieldsProps) => {
  const intl = useIntl();
  const { setValue, getValues } = useFormContext();

  const departmentOptions =
    departments?.filter(notEmpty).map((department) => ({
      value: department.id,
      label: getLocalizedName(department.name, intl),
    })) ?? [];

  const handleDisplayBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value: newValue } = e.target;
    const value = getValues("name");
    if (!value) {
      setValue("name", kebabCase(newValue));
    }
  };

  return (
    <>
      <div data-h2-flex-item="base(1/2)">
        <Input
          type="text"
          id="displayName_en"
          name="displayName.en"
          onBlur={handleDisplayBlur}
          label={intl.formatMessage({
            defaultMessage: "Team's name (English)",
            id: "n4pt+y",
            description: "Label for the English team display name input",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
      <div data-h2-flex-item="base(1/2)">
        <Input
          type="text"
          id="displayName_fr"
          name="displayName.fr"
          onBlur={handleDisplayBlur}
          label={intl.formatMessage({
            defaultMessage: "Team's name (French)",
            id: "Vf+lsG",
            description: "Label for the French team display name input",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
      <div data-h2-flex-item="base(1/2)">
        <Combobox
          id="departments"
          name="departments"
          isMulti
          label={intl.formatMessage(adminMessages.departments)}
          placeholder={intl.formatMessage({
            defaultMessage: "Select one or more departments",
            id: "F7nP5o",
            description: "Placeholder text for the team departments input",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          options={departmentOptions}
        />
      </div>
      <div data-h2-flex-item="base(1/2)">
        <Input
          type="email"
          id="contactEmail"
          name="contactEmail"
          label={intl.formatMessage({
            defaultMessage: "Contact email",
            id: "PhrOLp",
            description: "Label for the French team display name input",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
    </>
  );
};

export default CreateTeamFormFields;
