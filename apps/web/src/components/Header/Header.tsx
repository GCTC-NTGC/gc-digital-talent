/* eslint-disable react/forbid-elements */
import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import {
  localizePath,
  oppositeLocale,
  useLocale,
} from "@gc-digital-talent/i18n";

import { GocLogoEn, GocLogoFr, GocLogoWhiteEn, GocLogoWhiteFr } from "../Svg";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

interface HeaderProps {
  width?: string;
}

const Header = ({ width }: HeaderProps) => {
  const intl = useIntl();
  const { locale } = useLocale();

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
      data-h2-background-color="base(foreground) base:dark(white)"
      data-h2-border-bottom="base(1px solid black.20)"
      className="py-6 sm:py-4.5"
    >
      <div {...headerWidth}>
        <div className="grid items-center gap-3 text-center sm:grid-cols-2 sm:gap-12">
          <div className="sm:text-left">
            <a
              href={`https://www.canada.ca/${locale}.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {locale === "en" ? (
                <>
                  <GocLogoEn
                    className="max-w-80"
                    data-h2-display="base(block) base:dark(none)"
                  />
                  <GocLogoWhiteEn
                    className="max-w-80"
                    data-h2-display="base(none) base:dark(block)"
                  />
                </>
              ) : (
                <>
                  <GocLogoFr
                    className="max-w-80"
                    data-h2-display="base(block) base:dark(none)"
                  />
                  <GocLogoWhiteFr
                    className="max-w-80"
                    data-h2-display="base(none) base:dark(block)"
                  />
                </>
              )}
              <span className="sr-only">
                {intl.formatMessage({
                  defaultMessage: "Canada.ca",
                  id: "gpcHeU",
                  description:
                    "Alt text for the Canada logo link in the Header.",
                })}
              </span>
            </a>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-end sm:gap-6 sm:text-left ">
            <div>
              <ThemeSwitcher />
            </div>
            <div>
              <a
                className="outline-none"
                data-h2-background-color="base:focus-visible(focus)"
                data-h2-color="base:hover(secondary.darker) base:focus-visible(black)"
                href={languageTogglePath}
                lang={changeToLang === "en" ? "en" : "fr"}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "<hidden>Changer la langue en </hidden>Français",
                  id: "Z3h103",
                  description: "Title for the language toggle link.",
                })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
