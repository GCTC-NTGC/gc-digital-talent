import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";

import { useTheme } from "@gc-digital-talent/theme";
import { Flourish, Heading, Link } from "@gc-digital-talent/ui";
import { useLogger } from "@gc-digital-talent/logger";

import useRoutes from "~/hooks/useRoutes";
import useErrorMessages from "~/hooks/useErrorMessages";
import darkPug from "~/assets/img/404_pug_dark.webp";
import lightPug from "~/assets/img/404_pug_light.webp";

export const ErrorBoundary = () => {
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
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        className="my-20 text-center"
      >
        <Heading
          level="h1"
          size="h2"
          data-h2-font-size="base(h4, 1.1)"
          className="my-0 font-bold"
        >
          {error.messages.title}
        </Heading>
        <img
          src={imgPath}
          alt=""
          className="my-12 inline-block h-auto max-w-[70%]"
        />
        <p className="my-6 sm:mb-20 sm:mt-0">{error.messages.body}</p>
        {error.response && error.response.statusText && (
          <p
            className="my-6 italic sm:mb-20 sm:mt-0"
            data-h2-font-size="base(caption)"
          >
            {error.response.statusText}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-6 sm:flex-nowrap">
          <Link icon={HomeIcon} color="quinary" mode="cta" href={paths.home()}>
            {intl.formatMessage({
              defaultMessage: "Go to the homepage",
              id: "i9E0ka",
              description: "Link text to go to the homepage from a 404",
            })}
          </Link>
          <Link
            icon={WrenchScrewdriverIcon}
            color="primary"
            mode="cta"
            href={paths.support()}
            state={{ referrer: window.location.href }}
          >
            {intl.formatMessage({
              defaultMessage: "Report a missing page",
              id: "kfzKrV",
              description: "Link text to go report a missing page on the 404",
            })}
          </Link>
        </div>
      </div>
      <Flourish />
    </>
  );
};

export default ErrorBoundary;
