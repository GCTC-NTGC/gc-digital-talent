import React from "react";
import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

const { useContext } = ToggleSection;

interface SectionTriggerProps {
  children: React.ReactNode;
}

const SectionTrigger = ({ children }: SectionTriggerProps) => {
  const intl = useIntl();
  const ctx = useContext();

  return (
    <ToggleSection.Trigger>
      <Button mode="inline">
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

export default SectionTrigger;
