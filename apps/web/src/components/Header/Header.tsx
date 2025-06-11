/* eslint-disable react/forbid-elements */
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import { tv } from "tailwind-variants";

import {
  localizePath,
  oppositeLocale,
  useLocale,
} from "@gc-digital-talent/i18n";
import { useIsSmallScreen } from "@gc-digital-talent/helpers";
import { Container } from "@gc-digital-talent/ui";

import { GocLogoEn, GocLogoFr, GocLogoWhiteEn, GocLogoWhiteFr } from "../Svg";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

const logo = tv({
  base: "h-auto w-72",
  variants: {
    isDark: {
      true: "hidden dark:block",
      false: "block dark:hidden",
    },
  },
});

const Header = () => {
  const intl = useIntl();
  // eslint-disable-next-line no-restricted-syntax
  const { locale } = useLocale();

  const location = useLocation();
  const changeToLang = oppositeLocale(locale);
  const languageTogglePath = localizePath(location, changeToLang);
  const isSmallScreen = useIsSmallScreen(1080);

  return (
    <header className="border-b border-black/20 bg-white py-6 xs:py-4.5 dark:border-white/20 dark:bg-gray-700">
      <Container size="lg">
        <div className="grid items-center gap-3 xs:grid-cols-2 xs:gap-12">
          <div className="text-center xs:text-left">
            <a
              href={`https://www.canada.ca/${locale}.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {locale === "en" ? (
                <>
                  <GocLogoEn className={logo({ isDark: false })} />
                  <GocLogoWhiteEn className={logo({ isDark: true })} />
                </>
              ) : (
                <>
                  <GocLogoFr className={logo({ isDark: false })} />
                  <GocLogoWhiteFr className={logo({ isDark: true })} />
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
          {!isSmallScreen && (
            <div className="flex flex-col items-center justify-center gap-3 text-center xs:flex-row xs:justify-end xs:gap-6 xs:text-left">
              <div>
                <ThemeSwitcher />
              </div>
              <div>
                <a
                  className="underline outline-none hover:text-primary-600 focus-visible:bg-focus focus-visible:text-black dark:hover:text-primary-200"
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
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
