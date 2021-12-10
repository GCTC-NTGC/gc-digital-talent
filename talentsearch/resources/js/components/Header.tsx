import * as React from "react";
import { imageUrl } from "@common/helpers/router";
import { useIntl } from "react-intl";
import { homePath } from "../talentSearchRoutes";

const Header: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <header data-h2-border="b(gray, bottom, solid, s)">
      <div data-h2-flex-grid="b(middle, contained, flush, xl)">
        <div
          data-h2-flex-item="b(1of1) m(1of2)"
          data-h2-text-align="b(center) m(left)"
        >
          <a
            href={`https://www.canada.ca/${intl.locale}.html`}
            title={intl.formatMessage({
              defaultMessage: "Visit Canada.ca.",
              description: "Title for the Canada logo in the Header.",
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              style={{ width: "20rem" }}
              src={imageUrl(homePath(), "logo_goc_colour.svg")}
              alt={intl.formatMessage({
                defaultMessage: "Canada's Logo.",
                description: "Alt text for the Canada logo in the Header.",
              })}
            />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
