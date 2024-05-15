import * as React from "react";
import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

const { useContext } = ToggleSection;

interface TriggerProps {
  children: React.ReactNode;
}

const Trigger = ({ children, ...rest }: TriggerProps) => {
  const intl = useIntl();
  const ctx = useContext();

  return (
    <ToggleSection.Trigger>
      <Button mode="inline" color="secondary" {...rest}>
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
