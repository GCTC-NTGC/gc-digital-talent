import React from "react";
import { useIntl } from "react-intl";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

interface NoOptionsProps {
  fetching?: boolean;
}

const NoOptions = ({ fetching }: NoOptionsProps) => {
  const intl = useIntl();

  return (
    <p
      data-h2-cursor="base(pointer)"
      data-h2-radius="base(input)"
      data-h2-padding="base(x.25, x.5)"
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-gap="base(0, x.25)"
    >
      {fetching ? (
        <ArrowPathIcon
          data-h2-color="base(dt-gray)"
          data-h2-height="base(x1)"
          data-h2-width="base(x1)"
          className="animate-spin"
        />
      ) : (
        intl.formatMessage({
          defaultMessage: "No results found.",
          id: "IRCKBP",
          description:
            "Message displayed when combobox has no options available",
        })
      )}
    </p>
  );
};

export default NoOptions;
