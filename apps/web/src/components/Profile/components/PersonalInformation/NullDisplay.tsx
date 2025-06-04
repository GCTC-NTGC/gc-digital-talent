import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

const NullDisplay = () => {
  const intl = useIntl();
  return (
    <div data-h2-text-align="base(center)">
      <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage:
            "This section covers basic information about you and your contact preferences.",
          id: "Kg8PlJ",
          description:
            "Descriptive text explaining the personal information section of the application profile",
        })}
      </p>
      <p>
        <ToggleSection.Open>
          <Button mode="inline" color="primary">
            {intl.formatMessage({
              defaultMessage:
                "Get started<hidden> on your personal and contact information</hidden>",
              id: "LqCaFZ",
              description:
                "Call to action to begin editing personal and contact information",
            })}
          </Button>
        </ToggleSection.Open>
      </p>
    </div>
  );
};

export default NullDisplay;
