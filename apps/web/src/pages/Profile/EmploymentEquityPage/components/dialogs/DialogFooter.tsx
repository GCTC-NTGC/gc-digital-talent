import React from "react";
import { useIntl } from "react-intl";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";

import { Button, Dialog } from "@gc-digital-talent/ui";

const DialogFooter: React.FC = () => {
  const intl = useIntl();
  return (
    <>
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

      <Dialog.Close>
        <Button type="button" mode="outline" color="primary">
          {intl.formatMessage({
            defaultMessage: "Cancel",
            id: "LjE48l",
            description: "Button text to close employment equity form.",
          })}
        </Button>
      </Dialog.Close>
    </>
  );
};

export default DialogFooter;
