/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/alert-dialog
 */
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import {
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";

import Separator from "../Separator";

const StyledOverlay = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>((props, forwardedRef) => (
  <AlertDialogPrimitive.Overlay
    data-h2-position="base(fixed)"
    data-h2-background-color="base(black.light.9) base:dark(black.light.9)"
    data-h2-location="base(0)"
    style={{ zIndex: 9998 }}
    ref={forwardedRef}
    {...props}
  />
));

const StyledContent = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>((props, forwardedRef) => (
  <AlertDialogPrimitive.Content
    data-h2-font-family="base(sans)"
    data-h2-background-color="base(foreground)"
    data-h2-border="base(1px solid black.2)"
    data-h2-color="base(black)"
    data-h2-margin="base(x3, auto)"
    data-h2-padding="base(x1)"
    data-h2-position="base(fixed)"
    data-h2-location="base(50%, auto, auto, 50%)"
    data-h2-radius="base(rounded)"
    data-h2-transform="base(translate(-50%, -50%))"
    data-h2-shadow="base(0 0.55rem 1rem -0.2rem rgba(0, 0, 0, .5))"
    data-h2-width="base(90vw)"
    style={{
      top: 0,
      left: "50%",
      maxWidth: 768,
      transform: "translateX(-50%)",
      width: "90vw",
      zIndex: 9999,
    }}
    ref={forwardedRef}
    {...props}
  />
));

const Trigger = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>
>(({ asChild = true, ...rest }, forwardedRef) => (
  <AlertDialogPrimitive.Trigger
    ref={forwardedRef}
    asChild={asChild}
    {...rest}
  />
));

type AlertDialogPrimitiveContentProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Content
>;

interface AlertDialogProps extends AlertDialogPrimitiveContentProps {
  container?: HTMLElement;
}

const Content = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogProps
>(({ container, ...props }, forwardedRef) => (
  <AlertDialogPrimitive.Portal container={container}>
    <StyledOverlay />
    <StyledContent ref={forwardedRef} {...props} />
  </AlertDialogPrimitive.Portal>
));

const Title = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>((props, forwardedRef) => (
  <AlertDialogPrimitive.Title
    data-h2-font-weight="base(700)"
    data-h2-font-size="base(h4)"
    data-h2-margin="base(0, 0, x1, 0)"
    ref={forwardedRef}
    {...props}
  />
));

const Description = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>((props, forwardedRef) => (
  <AlertDialogPrimitive.Description
    data-h2-font-size="base(copy)"
    ref={forwardedRef}
    {...props}
  />
));

const Cancel = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Cancel>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ asChild = true, ...rest }, forwardedRef) => (
  <AlertDialogPrimitive.Cancel ref={forwardedRef} asChild={asChild} {...rest} />
));

const Action = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Action>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ asChild = true, ...rest }, forwardedRef) => (
  <AlertDialogPrimitive.Action ref={forwardedRef} asChild={asChild} {...rest} />
));

interface AlertDialogFooterProps {
  children: ReactNode;
}

const Footer = ({ children }: AlertDialogFooterProps) => (
  <div data-h2-padding="base(x1 0 0 0)">
    <Separator space="none" data-h2-margin-bottom="base(x1)" />
    <div
      data-h2-align-items="base(center)"
      data-h2-display="base(flex)"
      data-h2-gap="base(0 x1)"
    >
      {children}
    </div>
  </div>
);

const { Root } = AlertDialogPrimitive;

/**
 * @name Alert Dialog
 * @desc A modal dialog that interrupts the user with important content and expects a response.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/alert-dialog)
 */
const AlertDialog = {
  /**
   * @name Root
   * @desc Contains all the parts of an alert dialog.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/alert-dialog#root)
   */
  Root,
  /**
   * @name Content
   * @desc Contains content to be rendered when the dialog is open.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/alert-dialog#content)
   */
  Content,
  /**
   * @name Trigger
   * @desc A button that opens the dialog.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/alert-dialog#trigger)
   */
  Trigger,
  /**
   * @name Title
   * @desc An accessible name to be announced when the dialog is opened.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/alert-dialog#title)
   */
  Title,
  /**
   * @name Description
   * @desc An accessible description to be announced when the dialog is opened.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/alert-dialog#description)
   */
  Description,
  Footer,
  /**
   * @name Cancel
   * @desc A button that closes the dialog.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/alert-dialog#cancel)
   */
  Cancel,
  /**
   * @name Action
   * @desc A button that closes the dialog.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/alert-dialog#action)
   */
  Action,
};

export default AlertDialog;
