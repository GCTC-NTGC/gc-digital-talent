import React from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  pageTitle: {
    id: "homePage.title",
    defaultMessage: "Welcome to GC Talent Home page",
    description: "Title displayed in the hero section of the Home page.",
  },
});

export const HomePage: React.FC = () => {
  const intl = useIntl();
  return (
    <>
      <div
        data-h2-position="b(relative)"
        data-h2-padding="b(bottom, l) l(bottom, none)"
      >
        <h1
          data-h2-margin="b(all, none)"
          data-h2-padding="b(top, l) b(right-left, s)"
          data-h2-font-weight="b(800)"
          style={{ letterSpacing: "-2px" }}
        >
          {intl.formatMessage(messages.pageTitle)}
        </h1>
      </div>
    </>
  );
};

export default HomePage;
