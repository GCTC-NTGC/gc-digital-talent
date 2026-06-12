import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { Button, Link } from "@gc-digital-talent/ui";
import { useAuthentication } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import useApplyToPool from "~/hooks/useApplyToPool";
import SpinnerIcon from "~/components/SpinnerIcon/SpinnerIcon";

interface ApplyLinkProps {
  id: string;
}

const ApplyLink = ({ id }: ApplyLinkProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const location = useLocation();
  const { loggedIn } = useAuthentication();
  const { apply, rememberIntent, applying } = useApplyToPool({
    poolId: id,
    canApply: true,
  });

  const label = intl.formatMessage({
    defaultMessage: "Apply Now",
    id: "DvmNR7",
    description: "Button text to apply for program",
  });

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
          color="primary"
          mode="solid"
          block
          aria-busy={applying}
          icon={applying ? SpinnerIcon : undefined}
        >
          {label}
        </Button>
      </form>
    );
  }

  // Logged out, send to login and return here to apply. personality=iap keeps
  // the login page themed for the apprenticeship program.
  const loginSearchParams = new URLSearchParams({
    from: location.pathname,
    personality: "iap",
  });
  return (
    <Link
      color="primary"
      mode="solid"
      block
      href={`${paths.login()}?${loginSearchParams.toString()}`}
      onClick={rememberIntent}
    >
      {label}
    </Link>
  );
};

export default ApplyLink;
