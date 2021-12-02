import React from "react";
import { useIntl } from "react-intl";
import { SingleSearchRequestApi } from "./SingleSearchRequest";

export const SingleSearchRequestPage: React.FunctionComponent<{
  searchRequestId: string;
}> = ({ searchRequestId }) => {
  const intl = useIntl();
  return (
    <div>
      <header data-h2-padding="b(top, l) b(right-left, xl)">
        <h1
          data-h2-font-weight="b(800)"
          data-h2-margin="b(all, none)"
          style={{ letterSpacing: "-2px" }}
          data-h2-font-size="b(h2)"
        >
          {intl.formatMessage({
            defaultMessage: "View Request",
            description:
              "Heading displayed above the single search request component.",
          })}
        </h1>
      </header>
      <div data-h2-padding="b(right-left, xl)">
        <SingleSearchRequestApi searchRequestId={searchRequestId} />
      </div>
    </div>
  );
};

export default SingleSearchRequestPage;
