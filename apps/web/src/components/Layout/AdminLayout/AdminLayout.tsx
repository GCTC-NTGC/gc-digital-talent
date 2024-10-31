import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";

import { useLogger } from "@gc-digital-talent/logger";

import useLayoutTheme from "~/hooks/useLayoutTheme";
import useErrorMessages from "~/hooks/useErrorMessages";

import Layout from "../Layout";

export const Component = () => {
  const intl = useIntl();
  useLayoutTheme("default");

  return (
    <Layout
      project="admin"
      title={intl.formatMessage({
        defaultMessage: "Admin",
        id: "wHX/8C",
        description: "Title tag for Admin site",
      })}
      description={intl.formatMessage({
        defaultMessage:
          "Recruit and manage IT employees in the Government of Canada.",
        id: "J8kIar",
        description: "Meta tag description for Admin site",
      })}
    />
  );
};

export const ErrorBoundary = () => {
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

  return (
    <div data-h2-margin="base(x3, 0)">
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-flex-grid="base(flex-start, x3)">
          <div data-h2-flex-item="base(1of1)" data-h2-text-align="base(center)">
            <h3
              data-h2-font-size="base(h4, 1.3)"
              data-h2-font-weight="base(700)"
              data-h2-margin="base(0, 0, x1, 0)"
            >
              {error.messages.title}
            </h3>
            {error.messages.body}
          </div>
        </div>
      </div>
    </div>
  );
};

Component.displayName = "AdminLayout";
ErrorBoundary.displayName = "AdminErrorBoundary";

export default Component;
