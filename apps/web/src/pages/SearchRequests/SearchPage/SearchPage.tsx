import * as React from "react";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";

import SearchFormApi from "./components/SearchForm";

const SearchPage = () => {
  const intl = useIntl();

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Find talent",
          id: "ccBhi2",
          description: "Page title for the search page",
        })}
      />
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
          <Heading
            level="h2"
            data-h2-margin="base(0, 0, x1, 0)"
            data-h2-font-weight="base(400)"
          >
            {intl.formatMessage({
              defaultMessage: "Are you looking to hire digital talent?",
              id: "zMuDSL",
              description:
                "Heading on find talent page posing question to users.",
            })}
          </Heading>
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
      <SearchFormApi />
    </>
  );
};

export default SearchPage;
