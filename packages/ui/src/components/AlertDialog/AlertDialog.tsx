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
    ref={forwardedRef}
    className="fixed inset-0 z-[9998] bg-gray-700/90"
    {...props}
  />
));

const StyledContent = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>((props, forwardedRef) => (
  <AlertDialogPrimitive.Content
    ref={forwardedRef}
    className="fixed inset-x-0 top-0 z-[9999] mx-auto my-18 w-[90vw] max-w-3xl rounded-md border border-black/20 bg-white p-6 font-sans text-black shadow-xl dark:border-white/20 dark:bg-gray-600 dark:text-white"
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
    ref={forwardedRef}
    className="mb-4 text-2xl font-bold"
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
  <>
    <Separator space="sm" decorative />
    <div className="flex items-center gap-6">{children}</div>
  </>
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
