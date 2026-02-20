import { useIntl } from "react-intl";

import { Submit } from "@gc-digital-talent/forms";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

const ApplicationStatusDialogFooter = () => {
  const intl = useIntl();

  return (
    <Dialog.Footer>
      <Submit text={intl.formatMessage(commonMessages.saveAndContinue)} />
      <Dialog.Close>
        <Button color="warning" mode="inline">
          {intl.formatMessage(formMessages.cancelGoBack)}
        </Button>
      </Dialog.Close>
    </Dialog.Footer>
  );
};

export default ApplicationStatusDialogFooter;
