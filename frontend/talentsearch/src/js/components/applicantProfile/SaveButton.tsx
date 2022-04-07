import { Button } from "@common/components";
import { SaveIcon } from "@heroicons/react/solid";
import * as React from "react";
import { useIntl } from "react-intl";

const SaveButton: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <Button
      type="submit"
      color="cta"
      mode="solid"
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
    >
      <SaveIcon style={{ width: "1rem" }} />
      <span data-h2-margin="b(left, xxs)">
        {intl.formatMessage({
          defaultMessage: "Save and go back",
          description: "Label for save button on profile form.",
        })}
      </span>
    </Button>
  );
};

export default SaveButton;
