import React from "react";
import { useIntl } from "react-intl";
import { SingleSearchRequestApi } from "./SingleSearchRequest";

export const SingleSearchRequestPage: React.FunctionComponent<{
  searchRequestId: string;
}> = ({ searchRequestId }) => {
  const intl = useIntl();
  return (
    <div>
      <header data-h2-padding="b(x2, x3, 0, x3)">
        <h1
          data-h2-font-weight="b(800)"
          data-h2-margin="b(0)"
          style={{ letterSpacing: "-2px" }}
          data-h2-font-size="b(h2, 1.3)"
        >
          {intl.formatMessage({
            defaultMessage: "View Request",
            description:
              "Heading displayed above the single search request component.",
          })}
        </h1>
      </header>
      <div data-h2-padding="b(0, x3)">
        <SingleSearchRequestApi searchRequestId={searchRequestId} />
      </div>
    </div>
  );
};

export default SingleSearchRequestPage;
