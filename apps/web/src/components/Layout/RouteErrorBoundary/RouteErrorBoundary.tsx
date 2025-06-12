import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";

import { useTheme } from "@gc-digital-talent/theme";
import { Container, CTALink, Flourish, Heading } from "@gc-digital-talent/ui";
import { useLogger } from "@gc-digital-talent/logger";

import useRoutes from "~/hooks/useRoutes";
import useErrorMessages from "~/hooks/useErrorMessages";
import darkPug from "~/assets/img/404_pug_dark.webp";
import lightPug from "~/assets/img/404_pug_light.webp";

export const RouteErrorBoundary = () => {
  const intl = useIntl();
  const paths = useRoutes();
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
    <>
      <Flourish />
      <div className="bg-gray-100 py-18 text-black dark:bg-gray-700 dark:text-white">
        <Container size="lg" center className="text-center">
          <Heading level="h1" size="h4" className="my-0 font-bold">
            {error.messages.title}
          </Heading>
          <img
            src={imgPath}
            alt=""
            className="my-12 inline-block h-auto w-[70%]"
          />
          <p className="my-6 xs:mt-0 xs:mb-18">{error.messages.body}</p>
          {error?.error?.message && (
            <p className="my-6 text-sm italic xs:mt-0 xs:mb-18">
              {error.error.message}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-6 xs:flex-nowrap">
            <CTALink icon={HomeIcon} color="success" href={paths.home()}>
              {intl.formatMessage({
                defaultMessage: "Go to the homepage",
                id: "i9E0ka",
                description: "Link text to go to the homepage from a 404",
              })}
            </CTALink>
            <CTALink
              icon={WrenchScrewdriverIcon}
              color="secondary"
              href={paths.support()}
              state={{ referrer: window.location.href }}
            >
              {intl.formatMessage({
                defaultMessage: "Report a missing page",
                id: "kfzKrV",
                description: "Link text to go report a missing page on the 404",
              })}
            </CTALink>
          </div>
        </Container>
      </div>
      <Flourish />
    </>
  );
};

export default RouteErrorBoundary;
