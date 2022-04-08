import { Button } from "@common/components";
import { Submit } from "@common/components/form";
import { SaveIcon } from "@heroicons/react/solid";
import * as React from "react";
import { useFormState } from "react-hook-form";
import { useIntl } from "react-intl";

const SaveButton: React.FunctionComponent = () => {
  const intl = useIntl();
  const { isSubmitting } = useFormState();
  return (
    <Submit
      color="cta"
      mode="solid"
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
      disabled={isSubmitting}
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
