import React from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  homeHeading: {
    id: "homePage.homeHeading",
    defaultMessage: "Welcome Home",
    description: "Heading displayed on the Home page.",
  },
});

export const HomePage: React.FC = () => {
  const intl = useIntl();
  return (
    <div>
      <h1>{intl.formatMessage(messages.homeHeading)}</h1>
    </div>
  );
};

export default HomePage;
