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
            "This optional section asks you whether you would like to identify as a part of an equity group.",
          id: "/3sMii",
          description:
            "Descriptive text explaining the diversity, equity, and inclusion section of the application profile",
        })}
      </p>
      <p>
        <ToggleSection.Open>
          <Button mode="inline">
            {intl.formatMessage({
              defaultMessage:
                "Get started<hidden> on diversity, equity, and inclusion</hidden>",
              id: "o5SbFT",
              description: "Call to action to begin editing work preferences",
            })}
          </Button>
        </ToggleSection.Open>
      </p>
    </div>
  );
};

export default NullDisplay;
