import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { kebabCase } from "lodash";

import { Input, MultiSelectField } from "@gc-digital-talent/forms";
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Maybe } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import { Department } from "~/api/generated";

interface CreateTeamFormFieldsProps {
  departments?: Maybe<Array<Maybe<Omit<Department, "teams">>>>;
}

const CreateTeamFormFields = ({ departments }: CreateTeamFormFieldsProps) => {
  const intl = useIntl();
  const { setValue, getValues } = useFormContext();

  const departmentOptions = departments?.filter(notEmpty).map((department) => ({
    value: department.id,
    label: getLocalizedName(department.name, intl),
  }));

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
        <MultiSelectField
          id="departments"
          name="departments"
          label={intl.formatMessage({
            defaultMessage: "Departments",
            id: "ytHvhD",
            description: "Label for the team departments input",
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "Select on or more departments...",
            id: "jzax3k",
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
          placeholder={intl.formatMessage({
            defaultMessage: "contact@email.com",
            id: "hTzoAW",
            description:
              "Placeholder email format example for team contact email input",
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
