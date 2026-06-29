import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

const NullDisplay = () => {
  const intl = useIntl();
  return (
    <div className="text-center">
      <p className="mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage:
            "This section asks about your citizenship, veteran status and priority entitlements.",
          id: "4Ncmb0",
          description:
            "Descriptive text explaining the priority entitlement section of the application profile",
        })}
      </p>
      <p>
        <ToggleSection.Open>
          <Button mode="inline" color="primary">
            {intl.formatMessage({
              defaultMessage:
                "Get started<hidden> with providing citizenship, veteran status and priority entitlement information</hidden>",
              id: "9g0IoZ",
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
