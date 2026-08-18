import { useIntl } from "react-intl";

import { Card } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import CreateRequest from "./components/RequestForm";

const RequestPage = () => {
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

// NOTE: Require authentication but allow any user role
export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <RequestPage />
  </RequireAuth>
);

Component.displayName = "RequestPage";

export default Component;
