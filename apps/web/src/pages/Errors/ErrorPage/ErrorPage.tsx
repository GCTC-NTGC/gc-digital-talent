import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import { useTheme } from "@gc-digital-talent/theme";
import { Heading } from "@gc-digital-talent/ui";
import { useLogger } from "@gc-digital-talent/logger";

import useRoutes from "~/hooks/useRoutes";
import useErrorMessages from "~/hooks/useErrorMessages";
import CallToAction from "~/components/CallToAction/CallToAction";

import darkPug from "~/assets/img/404_pug_dark.svg";
import lightPug from "~/assets/img/404_pug_light.svg";

const ErrorPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { mode } = useTheme();
  const location = useLocation();
  const error = useErrorMessages();
  const logger = useLogger();

  logger.notice(
    JSON.stringify({
      message: "ErrorPage triggered",
      pathname: location.pathname,
      error,
    }),
  );

  const imgPath = mode === "dark" ? darkPug : lightPug;

  return (
    <>
      <div
        data-h2-background="base(main-linear)"
        data-h2-display="base(block)"
        data-h2-height="base(x1)"
      />
      <div
        data-h2-background-color="base(white) base:dark(black.light)"
        data-h2-color="base(black) base:dark(white)"
        data-h2-padding="base(x3, 0)"
      >
        <div
          data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
          data-h2-text-align="base(center)"
        >
          <Heading
            level="h1"
            size="h2"
            data-h2-font-size="base(h4, 1.4)"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(0)"
          >
            {error.messages.title}
          </Heading>
          <img
            src={imgPath}
            alt=""
            data-h2-display="base(inline-block)"
            data-h2-height="base(auto)"
            data-h2-margin="base(x2, 0)"
            data-h2-width="base(70%)"
          />
          <p data-h2-margin="base(x1, 0) p-tablet(0, 0, x3, 0)">
            {error.messages.body}
          </p>
          {error.response && error.response.statusText && (
            <p
              data-h2-margin="base(x1, 0) p-tablet(0, 0, x3, 0)"
              data-h2-font-size="base(caption)"
              data-h2-font-style="base(italic)"
            >
              {error.response.statusText}
            </p>
          )}

          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x1)"
            data-h2-justify-content="base(center)"
            data-h2-flex-wrap="base(wrap) p-tablet(initial)"
          >
            <CallToAction
              type="link"
              context="home"
              content={{
                path: paths.home(),
                label: intl.formatMessage({
                  defaultMessage: "Go to the homepage",
                  id: "i9E0ka",
                  description: "Link text to go to the homepage from a 404",
                }),
              }}
            />
            <CallToAction
              type="link"
              context="support"
              content={{
                path: paths.support(),
                label: intl.formatMessage({
                  defaultMessage: "Report a missing page",
                  id: "kfzKrV",
                  description:
                    "Link text to go report a missing page on the 404",
                }),
              }}
            />
          </div>
        </div>
      </div>
      <div
        data-h2-background="base(main-linear)"
        data-h2-display="base(block)"
        data-h2-height="base(x1)"
      />
    </>
  );
};

export default ErrorPage;
