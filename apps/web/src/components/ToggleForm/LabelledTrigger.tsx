import * as React from "react";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

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
      {intl.formatMessage(commonMessages.edit)}
    </SectionTrigger>
  ) : undefined;
};

export default LabelledTrigger;
