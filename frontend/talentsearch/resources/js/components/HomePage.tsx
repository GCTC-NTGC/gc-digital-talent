import React from "react";
import { useIntl } from "react-intl";

export const HomePage: React.FC = () => {
  const intl = useIntl();
  return (
    <div
      data-testid="homePage"
      data-h2-position="b(relative)"
      data-h2-padding="b(bottom, l) l(bottom, none)"
    >
      <h1
        data-h2-margin="b(all, none)"
        data-h2-padding="b(top, l) b(right-left, s)"
        data-h2-font-weight="b(800)"
        style={{ letterSpacing: "-2px" }}
      >
        {intl.formatMessage({
          defaultMessage: "Welcome to GC Talent Home page",
          description: "Title displayed in the hero section of the Home page.",
        })}
      </h1>
    </div>
  );
};

export default HomePage;
