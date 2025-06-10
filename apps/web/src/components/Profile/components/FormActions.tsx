import { useIntl } from "react-intl";

import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Button, ToggleSection } from "@gc-digital-talent/ui";

interface FormActionsProps {
  isUpdating?: boolean;
}

const FormActions = ({ isUpdating }: FormActionsProps) => {
  const intl = useIntl();

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-gap="base(x.25, x.5)"
      data-h2-flex-wrap="base(wrap)"
      data-h2-flex-direction="base(column) l-tablet(row)"
      data-h2-align-items="base(flex-start) l-tablet(center)"
      data-h2-margin-top="base(x1)"
    >
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
