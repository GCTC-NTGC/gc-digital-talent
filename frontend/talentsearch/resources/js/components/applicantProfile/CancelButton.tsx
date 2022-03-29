import { Button, Link } from "@common/components";
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
      title={intl.formatMessage({
        defaultMessage: "Cancel and go back",
        description: "Title for cancel link in applicant profile forms.",
      })}
    >
      <Button
        type="submit"
        color="secondary"
        mode="outline"
        data-h2-display="b(flex)"
        data-h2-align-items="b(center)"
      >
        <ArrowCircleLeftIcon style={{ width: "1rem" }} />
        <span data-h2-margin="b(left, xxs)">
          {intl.formatMessage({
            defaultMessage: "Cancel and go back",
            description: "Label for cancel button on profile form.",
          })}
        </span>
      </Button>
    </Link>
  );
};

export default CancelButton;
