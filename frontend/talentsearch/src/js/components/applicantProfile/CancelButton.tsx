import { Link } from "@common/components";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import * as React from "react";
import { useIntl } from "react-intl";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";

export interface CancelButtonProps {
  href?: string;
  children?: React.ReactNode;
}

const CancelButton = ({ href, children }: CancelButtonProps) => {
  const intl = useIntl();
  const profilePaths = useApplicantProfileRoutes();
  return (
    <Link
      href={href || profilePaths.myProfile()}
      color="secondary"
      mode="inline"
      data-h2-display="p-tablet(inline-flex)"
      data-h2-width="base(auto)"
      data-h2-align-items="base(center)"
      data-h2-padding="base(0)"
      type="button"
    >
      <ArrowLeftCircleIcon style={{ width: "1rem" }} />
      <span data-h2-margin="base(auto, auto, auto, x.125)">
        {children ||
          intl.formatMessage({
            defaultMessage: "Cancel and go back",
            id: "rMYmPd",
            description: "Label for cancel button on profile form.",
          })}
      </span>
    </Link>
  );
};

export default CancelButton;
