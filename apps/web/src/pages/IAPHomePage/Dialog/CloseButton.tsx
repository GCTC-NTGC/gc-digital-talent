import React from "react";
import { useIntl } from "react-intl";
import { Button } from "@common/components";
import Dialog from "@common/components/Dialog";

const CloseButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, forwardedRef) => {
  const intl = useIntl();
  return (
    <div data-h2-display="base(flex)" data-h2-justify-content="base(flex-end)">
      <Dialog.Close>
        <Button
          ref={forwardedRef}
          {...props}
          mode="outline"
          color="ia-secondary"
        >
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
