import React from "react";
import { useIntl } from "react-intl";

import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Button, ToggleSection } from "@gc-digital-talent/ui";

interface FormActionsProps {
  isUpdating?: boolean;
}

const FormActions = ({ isUpdating }: FormActionsProps) => {
  const intl = useIntl();

  return (
    <div className="mt-6 flex flex-col flex-wrap items-start gap-x-1.5 gap-y-3 md:flex-row md:items-center">
      <Button
        type="submit"
        color="secondary"
        mode="solid"
        disabled={isUpdating}
      >
        {intl.formatMessage(formMessages.saveChanges)}
      </Button>
      <ToggleSection.Close>
        <Button mode="inline" color="warning">
          {intl.formatMessage(commonMessages.cancel)}
        </Button>
      </ToggleSection.Close>
    </div>
  );
};

export default FormActions;
