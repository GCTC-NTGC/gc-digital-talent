import { Link } from "@common/components";
import { ArrowCircleLeftIcon } from "@heroicons/react/outline";
import * as React from "react";
import { useIntl } from "react-intl";

const CancelButton: React.FunctionComponent<{ link?: string }> = ({
  link = "/profile",
}) => {
  const intl = useIntl();
  return (
    <Link
      href={link} // TODO: Replace with profile link when ready.
      color="secondary"
      mode="outline"
      // NOTE: This does not currently seem to work with hydrogen
      // data-h2-display="s(inline-flex)"
      data-h2-width="b(auto)"
      data-h2-align-items="b(center)"
      type="button"
      style={{
        display: "inline-flex",
      }}
      title={intl.formatMessage({
        defaultMessage: "Cancel and go back",
        description: "Title for cancel link in applicant profile forms.",
      })}
    >
      <ArrowCircleLeftIcon style={{ width: "1rem" }} />
      <span data-h2-margin="b(left, xxs)">
        {intl.formatMessage({
          defaultMessage: "Cancel and go back",
          description: "Label for cancel button on profile form.",
        })}
      </span>
    </Link>
  );
};

export default CancelButton;
