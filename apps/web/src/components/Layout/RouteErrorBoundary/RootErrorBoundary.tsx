/* eslint-disable react/forbid-elements */
// NOTE: `a` needed here to avoid styling, etc
import { IntlProvider, useIntl } from "react-intl";
import { useLocation } from "react-router";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";

import { ThemeProvider, useTheme } from "@gc-digital-talent/theme";
import { Button, Container, Flourish, Heading } from "@gc-digital-talent/ui";
import { getLogger } from "@gc-digital-talent/logger";
import {
  combineMessages,
  commonMessages,
  useLocale,
} from "@gc-digital-talent/i18n";

import messages from "~/lang/frCompiled.json";
import useErrorMessages from "~/hooks/useErrorMessages";
import darkPug from "~/assets/img/404_pug_dark.webp";
import lightPug from "~/assets/img/404_pug_light.webp";
import {
  GocLogoEn,
  GocLogoFr,
  GocLogoWhiteEn,
  GocLogoWhiteFr,
} from "~/components/Svg";

const logo = tv({
  base: "h-auto w-72",
  variants: {
    isDark: {
      true: "hidden dark:block",
      false: "block dark:hidden",
    },
  },
});

const reloadLink = (chunks: ReactNode) => (
  <Button
    mode="text"
    className="font-bold"
    onClick={() => window.location.reload()}
  >
    {chunks}
  </Button>
);

const RouteErrorBoundary = () => {
  const intl = useIntl();
  // eslint-disable-next-line no-restricted-syntax
  const { locale } = useLocale();
  const { mode } = useTheme();
  const location = useLocation();
  const error = useErrorMessages();
  const logger = getLogger();

  logger.error(
    JSON.stringify({
      message: "RootErrorBoundary triggered",
      pathname: location.pathname,
      error,
    }),
  );

  const imgPath = mode === "dark" ? darkPug : lightPug;

  return (
    <div className="flex h-screen flex-col justify-between">
      <div>
        <Flourish className="hidden sm:block" />
        <Container size="lg">
          <div className="mt-6 flex flex-col items-center justify-between gap-3 xs:flex-row xs:items-start">
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
            <p className="text-lg xs:text-2xl">
              {intl.formatMessage(commonMessages.projectTitle)}
            </p>
          </div>
        </Container>
      </div>
      <div className="bg-gray-100 py-18 text-black dark:bg-gray-700 dark:text-white">
        <Container size="lg" center className="text-center">
          <Heading level="h1" size="h4" className="mt-0 font-bold">
            {error.messages.title}
          </Heading>
          <img
            src={imgPath}
            alt=""
            className="my-12 inline-block h-auto w-[70%]"
          />
          <p className="my-6 xs:mt-0 xs:mb-6">{error.messages.body}</p>
          {error?.error?.message && (
            <p className="my-6 text-sm italic xs:mt-0 xs:mb-6">
              {error.error.message}
            </p>
          )}
          <p className="my-6 xs:mt-0 xs:mb-18">
            {intl.formatMessage(
              {
                defaultMessage:
                  "Please <link>refresh the page</link> to continue.",
                id: "+Gkfmv",
                description: "Error message on the root of the app",
              },
              {
                link: (chunks) => reloadLink(chunks),
              },
            )}
          </p>
        </Container>
      </div>
      <Flourish />
    </div>
  );
};

export default function RootErrorBoundary() {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const locale = pathname.startsWith("/fr") ? "fr" : "en";

  return (
    <IntlProvider locale={locale} messages={combineMessages(locale, messages)}>
      <ThemeProvider>
        <RouteErrorBoundary />
      </ThemeProvider>
    </IntlProvider>
  );
}
