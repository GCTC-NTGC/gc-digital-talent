import { useIntl } from "react-intl";
import type { ReactNode } from "react";

import type { ButtonProps } from "@gc-digital-talent/ui";
import { Button, ToggleSection } from "@gc-digital-talent/ui";

const { useContext } = ToggleSection;

interface TriggerProps extends ButtonProps {
  children: ReactNode;
  className?: string;
}

const Trigger = ({ children, ...rest }: TriggerProps) => {
  const intl = useIntl();
  const ctx = useContext();

  return (
    <ToggleSection.Trigger>
      <Button mode="inline" color="primary" {...rest}>
        {ctx?.open
          ? intl.formatMessage({
              defaultMessage: "Cancel editing",
              id: "vEniKQ",
              description: "Button text to cancel editing a profile section",
            })
          : children}
      </Button>
    </ToggleSection.Trigger>
  );
};

export default Trigger;
