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
  width?: string;
}

const Header: React.FunctionComponent<HeaderProps> = ({ baseUrl, width }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const location = useLocation();
  const changeToLang = oppositeLocale(locale);
  const languageTogglePath = localizePath(location, changeToLang);
  let headerWidth = {
    "data-h2-container": "base(center, large, x1) p-tablet(center, large, x2)",
  };
  if (width === "full") {
    headerWidth = {
      "data-h2-container": "base(center, full, x1) p-tablet(center, full, x2)",
    };
  }
  return (
    <header
      data-h2-padding="base(x1, 0)"
      data-h2-border="base(bottom, 1px, solid, dt-gray)"
    >
      <div {...headerWidth}>
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
                  id: "gpcHeU",
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
                id: "GowrkB",
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
