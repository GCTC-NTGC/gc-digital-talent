import React from "react";
import { useIntl } from "react-intl";
import { SingleSearchRequestApi } from "./SingleSearchRequest";

export const SingleSearchRequestPage: React.FunctionComponent<{
  searchRequestId: string;
}> = ({ searchRequestId }) => {
  const intl = useIntl();
  return (
    <div>
      <div data-h2-padding="b(0, 0, x3, 0)">
        <div data-h2-container="b(center, large, x2)">
          <header>
            <h1
              data-h2-font-weight="b(400)"
              data-h2-margin="b(x2, 0, x1, 0)"
              style={{ letterSpacing: "-2px" }}
            >
              {intl.formatMessage({
                defaultMessage: "View Request",
                description:
                  "Heading displayed above the single search request component.",
              })}
            </h1>
          </header>
          <SingleSearchRequestApi searchRequestId={searchRequestId} />
        </div>
      </div>
    </div>
  );
};

export default SingleSearchRequestPage;
