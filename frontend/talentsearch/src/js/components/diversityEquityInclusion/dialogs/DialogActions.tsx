import React from "react";
import { useIntl } from "react-intl";
import { SaveIcon } from "@heroicons/react/solid";
import { Button } from "@common/components";

interface DialogActionsProps {
  onDismiss: () => void;
}

const DialogActions: React.FC<DialogActionsProps> = ({ onDismiss }) => {
  const intl = useIntl();
  return (
    <div
      data-h2-display="b(flex)"
      data-h2-flex-direction="b(column) m(row)"
      data-h2-align-items="b(center)"
      data-h2-justify-content="b(space-between)"
    >
      <p>
        <Button type="submit" mode="solid" color="cta">
          <SaveIcon
            style={{ height: "1rem", width: "1rem" }}
            data-h2-margin="b(right, xxs)"
          />
          <span>
            {intl.formatMessage({
              defaultMessage: "Save and go back",
              description: "Button text to submit employment equity form.",
            })}
          </span>
        </Button>
      </p>
      <p>
        <Button
          type="button"
          mode="outline"
          color="primary"
          onClick={onDismiss}
        >
          {intl.formatMessage({
            defaultMessage: "Cancel",
            description: "Button text to close employment equity form.",
          })}
        </Button>
      </p>
    </div>
  );
};

export default DialogActions;
