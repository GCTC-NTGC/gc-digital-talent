import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

const StyledDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>((props, forwardedRef) => (
  <DialogPrimitive.Overlay
    data-h2-position="base(fixed)"
    style={{ backgroundColor: `rgba(1,1,1,0.85)`, inset: 0 }}
    ref={forwardedRef}
    {...props}
  />
));

const StyledDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>((props, forwardedRef) => (
  <DialogPrimitive.Content
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

const StyledDialogClose = React.forwardRef<
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
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogProps
>(({ container, children, ...props }, forwardedRef) => {
  const intl = useIntl();

  return (
    <DialogPrimitive.Portal container={container}>
      <StyledDialogOverlay />
      <StyledDialogContent ref={forwardedRef} {...props}>
        {children}
        <StyledDialogClose>
          <button
            type="button"
            data-h2-border="base(none)"
            data-h2-radius="base(circle)"
            data-h2-color="base(dt-white)"
            data-h2-cursor="base(pointer)"
            data-h2-opacity="base(0) base:hover(.6)"
            data-h2-padding="base(x.5)"
            data-h2-position="base(absolute)"
            data-h2-line-height="base(0)"
            data-h2-offset="base(x.5, x.5, auto, auto)"
            style={{ background: "none", lineHeight: 0 }}
            aria-label={intl.formatMessage({
              defaultMessage: "Close dialog",
              id: "g2X8Fx",
              description: "Text for the button to close a modal dialog.",
            })}
          >
            <XMarkIcon data-h2-height="base(x1)" data-h2-width="base(x1)" />
          </button>
        </StyledDialogClose>
      </StyledDialogContent>
    </DialogPrimitive.Portal>
  );
});

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ asChild = true, ...rest }, forwardedRef) => (
  <DialogPrimitive.Trigger ref={forwardedRef} asChild={asChild} {...rest} />
));

const StyledDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>((props, forwardedRef) => (
  <DialogPrimitive.Title
    data-h2-font-weight="base(700)"
    data-h2-font-size="base(h3, 1.1)"
    data-h2-margin="base(0)"
    ref={forwardedRef}
    {...props}
  />
));

const StyledDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>((props, forwardedRef) => (
  <DialogPrimitive.Description
    data-h2-margin="base(x.25, 0, 0, 0)"
    ref={forwardedRef}
    {...props}
  />
));

type Color = "ts-primary" | "ts-secondary" | "ia-primary" | "ia-secondary";

export const colorMap: Record<Color, Record<string, string>> = {
  "ts-primary": {
    "data-h2-background-color": "base(dt-linear)",
    "data-h2-color": "base(dt-white)",
  },
  "ts-secondary": {
    "data-h2-background-color": "base(dt-secondary.light)",
    "data-h2-color": "base(dt-white)",
  },
  "ia-primary": {
    "data-h2-background-color": "base(ia-linear-secondary)",
    "data-h2-color": "base(ia-white)",
  },
  "ia-secondary": {
    "data-h2-background-color": "base(ia-secondary)",
    "data-h2-color": "base(ia-white)",
  },
};

export interface DialogHeaderProps {
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  color: Color;
}

const DialogHeader = ({
  subtitle,
  children,
  color = "ia-primary",
}: DialogHeaderProps) => (
  <div
    data-h2-radius="base(s, s, none, none)"
    data-h2-padding="base(x1)"
    data-h2-position="base(relative)"
    data-h2-margin="base(-x1)"
    data-h2-overflow="base(hidden)"
    style={{ marginBottom: "1rem" }}
    {...colorMap[color]}
  >
    <div data-h2-position="base(relative)">
      <StyledDialogTitle>{children}</StyledDialogTitle>
      <StyledDialogDescription>{subtitle}</StyledDialogDescription>
    </div>
  </div>
);

interface DialogFooterProps {
  children: React.ReactNode;
}

const DialogFooter = ({ children }: DialogFooterProps) => (
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

const { Root } = DialogPrimitive;
const Close = StyledDialogClose;
const Content = DialogContent;
const Trigger = DialogTrigger;
const Header = DialogHeader;
const Footer = DialogFooter;

export { Root, Close, Content, Trigger, Header, Footer };
