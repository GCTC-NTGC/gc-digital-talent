import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

const NullDisplay = () => {
  const intl = useIntl();
  return (
    <div data-h2-text-align="base(center)">
      <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage:
            "This section asks about your first and second language proficiencies.",
          id: "N6kGOU",
          description:
            "Descriptive text explaining the language profile section of the application profile",
        })}
      </p>
      <p>
        <ToggleSection.Open>
          <Button mode="inline" color="primary">
            {intl.formatMessage({
              defaultMessage:
                "Get started<hidden> on your language profile</hidden>",
              id: "hBDz/h",
              description: "Call to action to begin editing language profile",
            })}
          </Button>
        </ToggleSection.Open>
      </p>
    </div>
  );
};

export default NullDisplay;
