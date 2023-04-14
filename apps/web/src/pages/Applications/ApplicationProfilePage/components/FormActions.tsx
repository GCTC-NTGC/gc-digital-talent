import React from "react";
import { useIntl } from "react-intl";

import { formMessages } from "@gc-digital-talent/i18n";
import { Button, ToggleSection } from "@gc-digital-talent/ui";

const FormActions = () => {
  const intl = useIntl();

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-gap="base(x.25, x.5)"
      data-h2-flex-wrap="base(wrap)"
      data-h2-flex-direction="base(column) l-tablet(row)"
      data-h2-align-items="base(flex-start) l-tablet(center)"
    >
      <Button type="submit" color="secondary" mode="solid">
        {intl.formatMessage(formMessages.saveChanges)}
      </Button>
      <ToggleSection.Close>
        <Button mode="inline" color="warning">
          {intl.formatMessage({
            defaultMessage: "Cancel",
            id: "6JL/mL",
            description: "Button text to cancel editing a profile form",
          })}
        </Button>
      </ToggleSection.Close>
    </div>
  );
};

export default FormActions;
