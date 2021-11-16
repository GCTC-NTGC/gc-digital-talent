import React from "react";
import { useIntl } from "react-intl";
import { SingleSearchRequestApi } from "./SingleSearchRequest";

export const SingleSearchRequestPage: React.FunctionComponent<{
  searchRequestId: string;
}> = ({ searchRequestId }) => {
  const intl = useIntl();
  return (
    <div>
      <header data-h2-padding="b(top-bottom, l) b(right-left, xl)">
        <h1
          data-h2-font-weight="b(800)"
          data-h2-margin="b(all, none)"
          style={{ letterSpacing: "-2px" }}
          data-h2-font-size="b(h2)"
        >
          {intl.formatMessage({
            defaultMessage: "All Requests",
            description:
              "Heading displayed above the search request component.",
          })}
        </h1>
        <SingleSearchRequestApi searchRequestId={searchRequestId} />
      </header>
    </div>
  );
};

export default SingleSearchRequestPage;
