import { defineMessages, useIntl } from "react-intl";
import type { IntlShape } from "react-intl";
import { useLocation } from "react-router";

import type { LinkProps } from "@gc-digital-talent/ui";
import { Button, Link } from "@gc-digital-talent/ui";
import { useAuthentication } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import useApplyToPool from "~/hooks/useApplyToPool";
import SpinnerIcon from "~/components/SpinnerIcon/SpinnerIcon";

const messages = defineMessages({
  apply: {
    defaultMessage: "Apply now",
    id: "KghI8A",
    description: "Link text to apply for a pool advertisement",
  },
  view: {
    defaultMessage: "View my application",
    id: "btCYxZ",
    description: "Link text to view an existing, submitted application",
  },
  continue: {
    defaultMessage: "Continue my application",
    id: "g5JeNf",
    description: "Link text to continue an existing, draft application",
  },
});

const getLinkText = (
  intl: IntlShape,
  { applicationId, hasApplied, linkText }: ApplicationLinkProps,
): string => {
  if (linkText) return linkText;
  if (!applicationId) return intl.formatMessage(messages.apply);
  return intl.formatMessage(hasApplied ? messages.view : messages.continue);
};

export interface ApplicationLinkProps {
  poolId: string;
  applicationId?: string;
  hasApplied?: boolean;
  canApply?: boolean;
  linkProps?: Omit<LinkProps, "ref" | "href">;
  linkText?: string;
}

const ApplicationLink = (props: ApplicationLinkProps) => {
  const { poolId, applicationId, canApply, linkProps } = props;
  const intl = useIntl();
  const paths = useRoutes();
  const location = useLocation();
  const { loggedIn } = useAuthentication();
  const { apply, rememberIntent, applying } = useApplyToPool({
    poolId,
    applicationId,
    canApply,
  });

  // Application does not exist and user cannot apply, so show nothing.
  if (!canApply && !applicationId) {
    return null;
  }

  const label = getLinkText(intl, props);
  const {
    mode = "solid",
    color = "primary",
    ...restLinkProps
  } = linkProps ?? {};

  // Application already exists, link to it.
  if (applicationId) {
    return (
      <Link
        mode={mode}
        color={color}
        href={paths.application(applicationId)}
        {...restLinkProps}
      >
        {label}
      </Link>
    );
  }

  // Logged in, create the application from a form submission.
  if (loggedIn) {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void apply();
        }}
      >
        <Button
          type="submit"
          mode={mode}
          color={color}
          aria-busy={applying}
          icon={applying ? SpinnerIcon : undefined}
        >
          {label}
        </Button>
      </form>
    );
  }

  // Logged out, send to login and return here to apply.
  const loginSearchParams = new URLSearchParams({ from: location.pathname });
  return (
    <Link
      mode={mode}
      color={color}
      href={`${paths.login()}?${loginSearchParams.toString()}`}
      onClick={rememberIntent}
      {...restLinkProps}
    >
      {label}
    </Link>
  );
};

export default ApplicationLink;
