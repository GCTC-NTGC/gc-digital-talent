import React from "react";
import { useIntl } from "react-intl";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";

import { Button, Dialog } from "@gc-digital-talent/ui";

const DialogFooter = () => {
  const intl = useIntl();
  return (
    <div data-h2-flex-grid="base(center, x1)">
      <div data-h2-flex-item="base(1/1) p-tablet(1/2)">
        <Dialog.Close>
          <Button type="button" mode="inline" color="secondary">
            {intl.formatMessage({
              defaultMessage: "Cancel",
              id: "LjE48l",
              description: "Button text to close employment equity form.",
            })}
          </Button>
        </Dialog.Close>
      </div>
      <div
        data-h2-flex-item="base(1/1) p-tablet(1/2)"
        data-h2-text-align="p-tablet(right)"
      >
        <Button type="submit" mode="solid" color="primary">
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
      </div>
    </div>
  );
};

export default DialogFooter;
