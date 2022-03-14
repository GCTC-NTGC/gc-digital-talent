import { Button } from "@common/components";
import { SaveIcon } from "@heroicons/react/solid";
import * as React from "react";
import { useIntl } from "react-intl";

interface SaveButtonProps {
  handleSave: () => void;
}

const SaveButton: React.FunctionComponent<SaveButtonProps> = ({
  handleSave,
}) => {
  const intl = useIntl();
  return (
    <Button
      color="cta"
      mode="solid"
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
      onClick={handleSave}
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
