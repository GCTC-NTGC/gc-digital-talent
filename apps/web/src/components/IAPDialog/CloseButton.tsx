import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";

const CloseButton = forwardRef<
  ElementRef<typeof Button>,
  ComponentPropsWithoutRef<typeof Button>
>((props, forwardedRef) => {
  const intl = useIntl();
  return (
    <div className="flex justify-end">
      <Dialog.Close>
        <Button ref={forwardedRef} {...props} color="secondary">
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
