import React from "react";
import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

type NullDisplayProps = {
  title: React.ReactNode;
  content: React.ReactNode;
};

const NullDisplay = ({ title, content }: NullDisplayProps) => {
  const intl = useIntl();
  return (
    <div data-h2-text-align="base(center)">
      <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
        {content}
      </p>
      <p>
        <ToggleSection.Open>
          <Button mode="inline" color="secondary">
            {intl.formatMessage(
              {
                defaultMessage: "Get started<hidden> on {title}</hidden>",
                id: "h4npT9",
                description:
                  "Call to action to begin editing personal and contact information",
              },
              {
                title,
              },
            )}
          </Button>
        </ToggleSection.Open>
      </p>
    </div>
  );
};

export default NullDisplay;
