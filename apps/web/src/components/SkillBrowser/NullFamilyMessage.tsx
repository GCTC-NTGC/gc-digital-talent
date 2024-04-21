import React from "react";
import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";

const NullFamilyMessage = () => {
  const intl = useIntl();

  return (
    <Well>
      <p className="text-center">
        {intl.formatMessage({
          id: "5CIYu4",
          defaultMessage: "Please select a skill family to continue.",
          description:
            "Help text to tell users to select a skill before submitting",
        })}
      </p>
    </Well>
  );
};

export default NullFamilyMessage;
