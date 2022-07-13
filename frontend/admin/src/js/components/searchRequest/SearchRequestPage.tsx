import React from "react";
import { useIntl } from "react-intl";
import { SearchRequestTableApi } from "./SearchRequestTable";

export const SearchRequestPage: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <div>
      <header
        data-h2-background-color="base(dt-linear)"
        data-h2-padding="base(x2, 0)"
      >
        <div data-h2-container="base(center, large, x2)">
          <div data-h2-flex-grid="base(center, 0, x2)">
            <div data-h2-flex-item="base(1of1) l-tablet(3of5)">
              <h1
                data-h2-color="base(dt-white)"
                data-h2-font-weight="base(700)"
                data-h2-margin="base(0)"
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
              data-h2-flex-item="base(1of1) l-tablet(2of5)"
              data-h2-text-align="l-tablet(right)"
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
