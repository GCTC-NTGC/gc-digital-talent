import React from "react";
import { useIntl } from "react-intl";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";
import { Button } from "@common/components";

interface DialogFooterProps {
  onDismiss: () => void;
}

const DialogFooter: React.FC<DialogFooterProps> = ({ onDismiss }) => {
  const intl = useIntl();
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(space-between)"
    >
      <p>
        <Button type="submit" mode="solid" color="cta">
          <ArrowDownOnSquareIcon
            style={{ height: "1rem", width: "1rem" }}
            data-h2-margin="base(0, x.125, 0, 0)"
          />
          <span>
            {intl.formatMessage({
              defaultMessage: "Save and go back",
              id: "t12bCU",
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
            id: "LjE48l",
            description: "Button text to close employment equity form.",
          })}
        </Button>
      </p>
    </div>
  );
};

export default DialogFooter;
