import { Link } from "@common/components";
import { ArrowCircleLeftIcon } from "@heroicons/react/outline";
import * as React from "react";
import { useIntl } from "react-intl";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";

const CancelButton: React.FunctionComponent<{ link?: string }> = ({ link }) => {
  const intl = useIntl();
  const profilePaths = useApplicantProfileRoutes();
  return (
    <Link
      href={link || profilePaths.home()}
      color="secondary"
      mode="outline"
      data-h2-display="s(inline-flex)"
      data-h2-width="b(auto)"
      data-h2-align-items="b(center)"
      type="button"
    >
      <ArrowCircleLeftIcon style={{ width: "1rem" }} />
      <span data-h2-margin="b(auto, auto, auto, x.125)">
        {intl.formatMessage({
          defaultMessage: "Cancel and go back",
          description: "Label for cancel button on profile form.",
        })}
      </span>
    </Link>
  );
};

export default CancelButton;
