import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

const NullDisplay = () => {
  const intl = useIntl();
  return (
    <div data-h2-text-align="base(center)">
      <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage:
            "This section asks about your preferences when it comes to job opportunities and work locations.",
          id: "ngYP95",
          description:
            "Descriptive text explaining the work preferences section of the application profile",
        })}
      </p>
      <p>
        <ToggleSection.Open>
          <Button mode="inline" color="primary">
            {intl.formatMessage({
              defaultMessage:
                "Get started<hidden> on your Work preferences</hidden>",
              id: "2W6Q3k",
              description: "Call to action to begin editing work preferences",
            })}
          </Button>
        </ToggleSection.Open>
      </p>
    </div>
  );
};

export default NullDisplay;
