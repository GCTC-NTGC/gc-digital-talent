import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { kebabCase } from "lodash";

import Input from "@common/components/form/Input";
import { errorMessages } from "@common/messages";

const NameField = () => {
  const intl = useIntl();
  const { setValue, getValues } = useFormContext();

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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
          onBlur={handleBlur}
          label={intl.formatMessage({
            defaultMessage: "Organization's name (English)",
            id: "1cPlHY",
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
          onBlur={handleBlur}
          label={intl.formatMessage({
            defaultMessage: "Organization's name (French)",
            id: "OOnxtm",
            description: "Label for the French team display name input",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
      <div data-h2-flex-item="base(1/2)">
        <Input
          type="text"
          id="name"
          name="name"
          label={intl.formatMessage({
            defaultMessage: "Key",
            id: "3sw5qd",
            description: "Label for the team's key input",
          })}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
      <div data-h2-flex-item="base(1/2)" />
    </>
  );
};

export default NameField;
