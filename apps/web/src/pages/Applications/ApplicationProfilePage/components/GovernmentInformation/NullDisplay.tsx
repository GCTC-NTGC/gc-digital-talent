import React from "react";
import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

const NullDisplay = () => {
  const intl = useIntl();
  return (
    <div data-h2-text-align="base(center)">
      <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage:
            "This section asks whether you are currently a Government of Canada employee and other related questions.",
          id: "CRXFbo",
          description:
            "Descriptive text explaining the government information section of the application profile",
        })}
      </p>
      <p>
        <ToggleSection.Open>
          <Button mode="inline">
            {intl.formatMessage({
              defaultMessage:
                "Get started<hidden> on your government employee information</hidden>",
              id: "yXXj1D",
              description:
                "Call to action to begin editing government information",
            })}
          </Button>
        </ToggleSection.Open>
      </p>
    </div>
  );
};

export default NullDisplay;
