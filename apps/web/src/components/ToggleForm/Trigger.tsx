import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

const { useContext } = ToggleSection;

interface TriggerProps {
  children: ReactNode;
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
