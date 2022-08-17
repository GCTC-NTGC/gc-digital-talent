import React from "react";
import { useIntl } from "react-intl";
import Link from "../Link";
import {
  getLocale,
  localizePath,
  oppositeLocale,
} from "../../helpers/localize";
import { imageUrl, useLocation } from "../../helpers/router";

export interface HeaderProps {
  baseUrl: string;
}

const Header: React.FunctionComponent<HeaderProps> = ({ baseUrl }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const location = useLocation();
  const changeToLang = oppositeLocale(locale);
  const languageTogglePath = localizePath(location, changeToLang);
  return (
    <header
      data-h2-padding="base(x1, 0)"
      data-h2-border="base(bottom, 1px, solid, dt-gray)"
    >
      <div data-h2-container="base(center, large, x2)">
        <div data-h2-flex-grid="base(flex-start, 0, x1) p-tablet(center, 0, x3)">
          <div
            data-h2-flex-item="base(1of1) p-tablet(1of2)"
            data-h2-text-align="base(center) p-tablet(left)"
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
                  description:
                    "Alt text for the Canada logo link in the Header.",
                })}
              />
            </a>
          </div>
          <div
            data-h2-flex-item="base(1of1) p-tablet(1of2)"
            data-h2-text-align="base(center) p-tablet(right)"
          >
            <Link
              href={languageTogglePath}
              lang={changeToLang === "en" ? "en" : "fr"}
              title={intl.formatMessage({
                defaultMessage: "Change language",
                description: "Title for the language toggle link.",
              })}
            >
              {changeToLang === "en" ? "English" : "Français"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
