import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

const NullDisplay = () => {
  const intl = useIntl();
  return (
    <div className="text-center">
      <p className="mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "This section asks about your priority entitlements.",
          id: "lSKm4M",
          description:
            "Descriptive text explaining the priority entitlement section of the application profile",
        })}
      </p>
      <p>
        <ToggleSection.Open>
          <Button mode="inline" color="primary">
            {intl.formatMessage({
              defaultMessage:
                "Get started<hidden> with providing priority entitlement information</hidden>",
              id: "rWs8MO",
              description:
                "Call to action to begin editing priority entitlement",
            })}
          </Button>
        </ToggleSection.Open>
      </p>
    </div>
  );
};

export default NullDisplay;
