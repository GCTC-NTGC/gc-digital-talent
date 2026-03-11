import { useIntl } from "react-intl";

import { Submit } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Button, ButtonProps, Dialog } from "@gc-digital-talent/ui";

export interface FooterProps {
  submitProps?: {
    color?: ButtonProps["color"];
    label?: string;
  };
}

const Footer = ({ submitProps }: FooterProps) => {
  const intl = useIntl();

  return (
    <Dialog.Footer>
      <Submit
        text={
          submitProps?.label ??
          intl.formatMessage(commonMessages.saveAndContinue)
        }
        color={submitProps?.color}
      />
      <Dialog.Close>
        <Button color="warning" mode="inline">
          {intl.formatMessage(formMessages.cancelGoBack)}
        </Button>
      </Dialog.Close>
    </Dialog.Footer>
  );
};

export default Footer;
