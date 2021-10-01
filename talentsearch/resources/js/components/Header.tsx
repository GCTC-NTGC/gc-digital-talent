import * as React from "react";
import { imageUrl } from "@common/helpers/router";
import { defineMessages, useIntl } from "react-intl";
import { BASE_URL } from "../talentSearchConstants";

const messages = defineMessages({
  canadaLogoTitle: {
    id: "header.canadaLogoTitle",
    defaultMessage: "Visit Canada.ca.",
    description: "Title for the Canada logo in the Header.",
  },
  canadaLogoLabel: {
    id: "header.canadaLogoLabel",
    defaultMessage: "Canada.ca",
    description: "Label for the Canada logo in the Header.",
  },
  canadaLogoAlt: {
    id: "header.canadaLogoLabel",
    defaultMessage: "Canada's Logo.",
    description: "Alt text for the Canada logo in the Header.",
  },
});

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
            title={intl.formatMessage(messages.canadaLogoTitle)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              style={{ width: "20rem" }}
              src={imageUrl(BASE_URL, "logo_goc_colour.svg")}
              alt={intl.formatMessage(messages.canadaLogoAlt)}
            />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
