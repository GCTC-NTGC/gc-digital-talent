import React from "react";
import { useIntl } from "react-intl";

import SectionTrigger from "./Trigger";

interface LabelledTriggerProps {
  disabled?: boolean;
  sectionTitle: React.ReactNode;
}

const LabelledTrigger = ({ disabled, sectionTitle }: LabelledTriggerProps) => {
  const intl = useIntl();

  return !disabled ? (
    <SectionTrigger
      aria-label={intl.formatMessage(
        {
          defaultMessage: "Edit {sectionTitle}",
          id: "jDvQEV",
          description: "Button text to start editing a specific section",
        },
        {
          sectionTitle,
        },
      )}
    >
      {intl.formatMessage({
        defaultMessage: "Edit this section",
        id: "co9aIV",
        description:
          "Button text to start editing one of the profile sections.",
      })}
    </SectionTrigger>
  ) : undefined;
};

export default LabelledTrigger;
