import React from "react";
import { useIntl } from "react-intl";
import { SearchRequestTableApi } from "./SearchRequestTable";

export const SearchRequestPage: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <div>
      <header
        data-h2-background-color="b(dt-linear)"
        data-h2-padding="b(x2, 0)"
      >
        <div data-h2-container="b(center, large, x2)">
          <div data-h2-flex-grid="b(center, 0, x2)">
            <div data-h2-flex-item="b(1of1) m(3of5)">
              <h1
                data-h2-color="b(dt-white)"
                data-h2-font-weight="b(700)"
                data-h2-margin="b(0)"
                style={{ letterSpacing: "-2px" }}
              >
                {intl.formatMessage({
                  defaultMessage: "All Requests",
                  description:
                    "Heading displayed above the search request component.",
                })}
              </h1>
            </div>
            {/* <div
              data-h2-flex-item="b(1of1) m(2of5)"
              data-h2-text-align="m(right)"
            >

            </div> */}
          </div>
        </div>
      </header>

      <SearchRequestTableApi />
    </div>
  );
};

export default SearchRequestPage;
