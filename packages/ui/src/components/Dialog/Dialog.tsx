/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/dialog
 */
import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

const StyledOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>((props, forwardedRef) => (
  <DialogPrimitive.Overlay
    data-h2-display="base(grid)"
    data-h2-position="base(fixed)"
    data-h2-background-color="base(black.light.9)"
    data-h2-location="base(0)"
    data-h2-overflow="base(visible auto)"
    style={{ placeItems: "center", zIndex: 9998 }}
    ref={forwardedRef}
    {...props}
  />
));

const StyledContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>((props, forwardedRef) => (
  <DialogPrimitive.Content
    data-h2-font-family="base(sans)"
    data-h2-max-width="base(48rem)"
    data-h2-margin="base(x3, auto)"
    data-h2-position="base(relative)"
    data-h2-width="base(90vw)"
    style={{
      zIndex: 9999,
    }}
    ref={forwardedRef}
    {...props}
  />
));

const StyledClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>((props, forwardedRef) => (
  <DialogPrimitive.Close ref={forwardedRef} asChild {...props} />
));

interface DialogProps extends DialogPrimitiveContentProps {
  container?: HTMLElement;
}

type DialogPrimitiveContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
>;

const Content = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogProps
>(({ container, children, ...props }, forwardedRef) => {
  const intl = useIntl();

  return (
    <DialogPrimitive.Portal container={container}>
      <StyledOverlay>
        <StyledContent ref={forwardedRef} {...props}>
          <StyledClose>
            <button
              type="button"
              data-h2-background-color="base(transparent) base:hover(white.15) base:focus-visible(focus)"
              data-h2-outline="base:focus-visible(1px solid focus)"
              data-h2-outline-offset="base(4px)"
              data-h2-border="base(none)"
              data-h2-color="base(white) base:focus-visible(black)"
              data-h2-cursor="base(pointer)"
              data-h2-line-height="base(0)"
              data-h2-location="base(x.5, x.5, auto, auto)"
              data-h2-padding="base(x.5)"
              data-h2-position="base(absolute)"
              data-h2-radius="base(circle)"
              data-h2-z-index="base(9)"
              aria-label={intl.formatMessage(uiMessages.closeDialog)}
            >
              <XMarkIcon data-h2-height="base(x1)" data-h2-width="base(x1)" />
            </button>
          </StyledClose>
          <div data-h2-shadow="base(0 0.55rem 1rem -0.2rem rgba(0, 0, 0, .5))">
            {children}
          </div>
        </StyledContent>
      </StyledOverlay>
    </DialogPrimitive.Portal>
  );
});

const Trigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ asChild = true, ...rest }, forwardedRef) => (
  <DialogPrimitive.Trigger ref={forwardedRef} asChild={asChild} {...rest} />
));

const StyledTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>((props, forwardedRef) => (
  <DialogPrimitive.Title
    data-h2-font-weight="base(700)"
    data-h2-font-size="base(h4, 1.1)"
    data-h2-margin="base(0)"
    data-h2-padding="base(0 x3 0 0)"
    ref={forwardedRef}
    {...props}
  />
));

const StyledDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>((props, forwardedRef) => (
  <DialogPrimitive.Description
    data-h2-margin="base(x.5, 0, 0, 0)"
    ref={forwardedRef}
    {...props}
  />
));

export interface DialogHeaderProps {
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

const Header = ({ subtitle, children }: DialogHeaderProps) => (
  <div>
    <div
      data-h2-padding="base(x1)"
      data-h2-position="base(relative)"
      data-h2-overflow="base(hidden)"
      data-h2-background="base(black)"
      data-h2-color="base(white)"
      data-h2-radius="base(rounded rounded 0 0)"
    >
      <div data-h2-position="base(relative)">
        <StyledTitle>{children}</StyledTitle>
        {subtitle ? <StyledDescription>{subtitle}</StyledDescription> : ""}
      </div>
    </div>
    <div data-h2-background="base(main-linear)" data-h2-height="base(x1)" />
  </div>
);

interface DialogFooterProps {
  children: React.ReactNode;
}

const Footer = ({ children, ...rest }: DialogFooterProps) => (
  <div data-h2-padding="base(x1 0 0 0)">
    <hr
      data-h2-border="base(none)"
      data-h2-height="base(1px)"
      data-h2-background="base(gray.lighter)"
      data-h2-margin="base(0 0 x1 0)"
    />
    <div
      data-h2-align-items="base(center)"
      data-h2-display="base(flex)"
      data-h2-justify-content="base(flex-end)"
      data-h2-gap="base(0 x.5)"
      {...rest}
    >
      {children}
    </div>
  </div>
);

interface DialogBodyProps {
  children: React.ReactNode;
}

const Body = ({ children }: DialogBodyProps) => (
  <div
    data-h2-background="base(foreground)"
    data-h2-padding="base(x1)"
    data-h2-radius="base(0 0 rounded rounded)"
  >
    {children}
  </div>
);

const { Root } = DialogPrimitive;
const Close = StyledClose;

/**
 * @name Dialog
 * @desc A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dialog)
 */
const Dialog = {
  /**
   * @name Root
   * @desc Contains all the parts of a dialog.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dialog#root)
   */
  Root,
  /**
   * @name Close
   * @desc The button that closes the dialog.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dialog#close)
   */
  Close,
  /**
   * @name Content
   * @desc Contains content to be rendered in the open dialog.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dialog#content)
   */
  Content,
  /**
   * @name Trigger
   * @desc The button that opens the dialog.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/dialog#trigger)
   */
  Trigger,
  Header,
  Body,
  Footer,
};

export default Dialog;
