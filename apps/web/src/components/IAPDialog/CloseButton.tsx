import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";

const CloseButton = forwardRef<
  ElementRef<typeof Button>,
  ComponentPropsWithoutRef<typeof Button>
>((props, forwardedRef) => {
  const intl = useIntl();
  return (
    <div data-h2-display="base(flex)" data-h2-justify-content="base(flex-end)">
      <Dialog.Close>
        <Button ref={forwardedRef} {...props} color="primary">
          {intl.formatMessage({
            defaultMessage: "Close",
            id: "4p0QdF",
            description: "Button text used to close an open modal",
          })}
        </Button>
      </Dialog.Close>
    </div>
  );
});

export default CloseButton;
