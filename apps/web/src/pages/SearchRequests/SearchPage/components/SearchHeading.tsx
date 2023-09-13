import * as React from "react";
import { useIntl } from "react-intl";

import Hero from "~/components/Hero/Hero";

const SearchHeading = () => {
  const intl = useIntl();
  return (
    <Hero
      centered
      title={intl.formatMessage({
        defaultMessage: "Find digital talent",
        id: "9Jkoms",
        description: "Title displayed on hero for Search and Request pages.",
      })}
    >
      <div
        data-h2-background-color="base(white)"
        data-h2-radius="base(rounded)"
        data-h2-padding="base(x1) p-tablet(x2)"
        data-h2-shadow="base(large)"
        data-h2-text-align="base(center)"
      >
        <h2 data-h2-color="base(black)" data-h2-margin="base(0, 0, x1, 0)">
          {intl.formatMessage({
            defaultMessage: "Are you looking to hire digital talent?",
            id: "zMuDSL",
            description:
              "Heading on find talent page posing question to users.",
          })}
        </h2>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "If you are looking for talent, you have found the right place. Our talent database is open to most departments and agencies. Complete a request to find qualified candidates. Candidates are assessed for their skills and grouped into pools to meet your staffing needs.",
            id: "F+LDbs",
            description:
              "Content displayed in the find talent page explaining the page and what it offers to users.",
          })}
        </p>
      </div>
    </Hero>
  );
};

export default SearchHeading;
