import * as React from "react";
import { useIntl } from "react-intl";

import Hero from "~/components/Hero/Hero";
import StrikeNotice from "~/components/StrikeNotice/StrikeNotice";

const SearchHeading = () => {
  const intl = useIntl();
  return (
    <Hero
      centered
      title={intl.formatMessage({
        defaultMessage: "Search the Digital Talent Pool",
        id: "SZTFJq",
        description: "Title displayed in the hero section of the Search page.",
      })}
    >
      <StrikeNotice />
      <div
        data-h2-background-color="base(white)"
        data-h2-radius="base(rounded)"
        data-h2-padding="base(x1) p-tablet(x2)"
        data-h2-shadow="base(large)"
        data-h2-text-align="base(center)"
      >
        <h2 data-h2-color="base(black)" data-h2-margin="base(0, 0, x1, 0)">
          {intl.formatMessage({
            defaultMessage: "About the GC Digital Talent database",
            id: "qnECBT",
            description:
              "Heading displayed in the About area of the hero section of the Search page.",
          })}
        </h2>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "This talent database is open to most departments and agencies. Candidates in the database vary from just starting their career to seasoned professionals with several years of work experience. There are several ongoing recruitment processes, which means new candidates are being added every week.",
            id: "BVwsnS",
            description:
              "Content displayed in the About area of the hero section of the Search page.",
          })}
        </p>
      </div>
    </Hero>
  );
};

export default SearchHeading;
