import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { Scalars } from "../../api/generated";
import { SingleSearchRequestApi } from "./SingleSearchRequest";

type RouteParams = {
  searchRequestId: Scalars["ID"];
};

export const SingleSearchRequestPage = () => {
  const intl = useIntl();
  const { searchRequestId } = useParams<RouteParams>();
  return (
    <div>
      <div data-h2-padding="base(0, 0, x3, 0)">
        <div data-h2-container="base(center, large, x2)">
          <header>
            <h1
              data-h2-font-weight="base(400)"
              data-h2-margin="base(x2, 0, x1, 0)"
              style={{ letterSpacing: "-2px" }}
            >
              {intl.formatMessage({
                defaultMessage: "View Request",
                id: "HkC8XB",
                description:
                  "Heading displayed above the single search request component.",
              })}
            </h1>
          </header>
          <SingleSearchRequestApi searchRequestId={searchRequestId || ""} />
        </div>
      </div>
    </div>
  );
};

export default SingleSearchRequestPage;
