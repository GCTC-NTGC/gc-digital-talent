import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import { ReactNode } from "react";

import { useTheme } from "@gc-digital-talent/theme";
import { Button, Container, Flourish, Heading } from "@gc-digital-talent/ui";
import { useLogger } from "@gc-digital-talent/logger";

import useErrorMessages from "~/hooks/useErrorMessages";
import darkPug from "~/assets/img/404_pug_dark.webp";
import lightPug from "~/assets/img/404_pug_light.webp";

const reloadLink = (chunks: ReactNode) => (
  <Button mode="text" onClick={() => window.location.reload()}>
    {chunks}
  </Button>
);

export const RouteErrorBoundary = () => {
  const intl = useIntl();
  const { mode } = useTheme();
  const location = useLocation();
  const error = useErrorMessages();
  const logger = useLogger();

  logger.notice(
    JSON.stringify({
      message: "ErrorBoundary triggered",
      pathname: location.pathname,
      error,
    }),
  );

  const imgPath = mode === "dark" ? darkPug : lightPug;

  return (
    <div className="flex h-screen flex-col justify-between">
      <Flourish className="hidden sm:block" />
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
                  "We’ve made some updates to the platform. Please <link>refresh the page</link> to continue.",
                id: "towd7B",
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

export default RouteErrorBoundary;
