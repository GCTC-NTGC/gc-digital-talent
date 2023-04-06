import React from "react";
import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";

const NullExperienceType = () => {
  const intl = useIntl();

  return (
    <Well>
      <p data-h2-text-align="base(center)">
        {intl.formatMessage({
          defaultMessage: "Please, select a type to continue.",
          id: "z+qxaE",
          description:
            "Test displayed on the experience form when a user has not selected an experience type.",
        })}
      </p>
    </Well>
  );
};

export default NullExperienceType;
