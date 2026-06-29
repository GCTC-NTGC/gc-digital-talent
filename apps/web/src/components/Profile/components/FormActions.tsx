import { useIntl } from "react-intl";

import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Button, ToggleSection } from "@gc-digital-talent/ui";

interface FormActionsProps {
  isUpdating?: boolean;
}

const FormActions = ({ isUpdating }: FormActionsProps) => {
  const intl = useIntl();

  return (
    <div className="mt-6 flex flex-col flex-wrap items-center gap-6 sm:flex-row sm:gap-3">
      <Button type="submit" color="primary" mode="solid" disabled={isUpdating}>
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
