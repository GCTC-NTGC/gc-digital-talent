import React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

const StyledAlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>((props, forwardedRef) => (
  <AlertDialogPrimitive.Overlay
    data-h2-position="base(fixed)"
    style={{ backgroundColor: `rgba(1,1,1,0.85)`, inset: 0 }}
    ref={forwardedRef}
    {...props}
  />
));

const StyledAlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>((props, forwardedRef) => (
  <AlertDialogPrimitive.Content
    data-h2-font-family="base(sans)"
    data-h2-background-color="base(dt-white)"
    data-h2-margin="base(x3, auto)"
    data-h2-padding="base(x1)"
    data-h2-position="base(fixed)"
    data-h2-location="base(50%, auto, auto, 50%)"
    data-h2-radius="base(s)"
    data-h2-transform="base(translate(-50%, -50%))"
    data-h2-shadow="base(s)"
    data-h2-width="base(90vw)"
    style={{
      top: 0,
      left: "50%",
      maxWidth: 768,
      transform: "translateX(-50%)",
      width: "90vw",
    }}
    ref={forwardedRef}
    {...props}
  />
));

const AlertDialogTrigger = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>
>(({ asChild = true, ...rest }, forwardedRef) => (
  <AlertDialogPrimitive.Trigger
    ref={forwardedRef}
    asChild={asChild}
    {...rest}
  />
));

type AlertDialogPrimitiveContentProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Content
>;

interface AlertDialogProps extends AlertDialogPrimitiveContentProps {
  container?: HTMLElement;
}

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogProps
>(({ container, ...props }, forwardedRef) => (
  <AlertDialogPrimitive.Portal container={container}>
    <StyledAlertDialogOverlay />
    <StyledAlertDialogContent ref={forwardedRef} {...props} />
  </AlertDialogPrimitive.Portal>
));

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>((props, forwardedRef) => (
  <AlertDialogPrimitive.Title
    data-h2-font-weight="base(700)"
    data-h2-font-size="base(h3)"
    data-h2-margin="base(0, 0, x.5, 0)"
    ref={forwardedRef}
    {...props}
  />
));

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>((props, forwardedRef) => (
  <AlertDialogPrimitive.Description
    data-h2-font-size="base(copy)"
    ref={forwardedRef}
    {...props}
  />
));

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ asChild = true, ...rest }, forwardedRef) => (
  <AlertDialogPrimitive.Cancel ref={forwardedRef} asChild={asChild} {...rest} />
));

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ asChild = true, ...rest }, forwardedRef) => (
  <AlertDialogPrimitive.Action ref={forwardedRef} asChild={asChild} {...rest} />
));

interface AlertDialogFooterProps {
  children: React.ReactNode;
}

const AlertDialogFooter = ({ children }: AlertDialogFooterProps) => (
  <div
    data-h2-align-items="base(center)"
    data-h2-border="base(top, 1px, solid, dt-gray.dark)"
    data-h2-display="base(flex)"
    data-h2-justify-content="base(flex-end)"
    data-h2-margin="base(x1, 0, 0, 0)"
    data-h2-padding="base(x1, 0, 0, 0)"
    style={{ gap: "0 0.5rem" }}
  >
    {children}
  </div>
);

const { Root } = AlertDialogPrimitive;
const Content = AlertDialogContent;
const Trigger = AlertDialogTrigger;
const Title = AlertDialogTitle;
const Description = AlertDialogDescription;
const Footer = AlertDialogFooter;
const Cancel = AlertDialogCancel;
const Action = AlertDialogAction;

export { Root, Content, Trigger, Title, Description, Footer, Cancel, Action };
