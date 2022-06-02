import React from "react";
import { useIntl } from "react-intl";
import {
  getLocale,
  localizePath,
  oppositeLocale,
} from "../../helpers/localize";
import { imageUrl, Link, useLocation } from "../../helpers/router";

export interface HeaderProps {
  baseUrl: string;
}

const Header: React.FunctionComponent<HeaderProps> = ({ baseUrl }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const location = useLocation();
  const languageTogglePath = localizePath(location, oppositeLocale(locale));
  return (
    <header data-h2-border="b(gray, bottom, solid, s)">
      <div data-h2-flex-grid="b(middle, contained, flush, xl)">
        <div
          data-h2-flex-item="b(1of1) m(1of2)"
          data-h2-text-align="b(center) m(left)"
        >
          <a
            href={`https://www.canada.ca/${locale}.html`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              style={{ width: "20rem" }}
              src={imageUrl(baseUrl, "logo_goc_colour.svg")}
              alt={intl.formatMessage({
                defaultMessage: "Canada.ca",
                description: "Alt text for the Canada logo link in the Header.",
              })}
            />
          </a>
        </div>
        <div
          data-h2-flex-item="b(1of1) m(1of2)"
          data-h2-text-align="b(center) m(right)"
        >
          <Link
            href={languageTogglePath}
            title={intl.formatMessage({
              defaultMessage: "Change language",
              description: "Title for the language toggle link.",
            })}
          >
            {oppositeLocale(locale) === "en" ? "English" : "Français"}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
