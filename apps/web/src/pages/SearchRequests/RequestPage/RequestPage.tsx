import { useIntl } from "react-intl";

import { Card } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";

import CreateRequest from "./components/RequestForm";

export const Component = () => {
  const intl = useIntl();

  return (
    <Hero
      title={intl.formatMessage({
        defaultMessage: "Find talent ready to join your team",
        id: "OLoRqP",
        description: "Title displayed on hero for Search and Request pages.",
      })}
      subtitle={intl.formatMessage({
        defaultMessage: "Submit your filtered request for talent.",
        id: "TU9sk7",
        description: "Subtitle displayed on hero for Search and Request pages.",
      })}
      centered
      overlap
    >
      <Card className="mb-18" space="lg">
        <CreateRequest />
      </Card>
    </Hero>
  );
};

Component.displayName = "RequestPage";

export default Component;
