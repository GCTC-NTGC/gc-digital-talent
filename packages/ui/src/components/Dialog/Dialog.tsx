/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/dialog
 */
import * as DialogPrimitive from "@radix-ui/react-dialog";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { useIntl } from "react-intl";
import {
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  ReactNode,
  HTMLProps,
} from "react";

import { uiMessages } from "@gc-digital-talent/i18n";

import Separator from "../Separator";

const StyledOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>((props, forwardedRef) => (
  <DialogPrimitive.Overlay
    data-h2-display="base(grid)"
    data-h2-position="base(fixed)"
    data-h2-background-color="base(black.light.9) base:dark(black.light.9)"
    data-h2-location="base(0)"
    data-h2-overflow="base(auto)"
    style={{ placeItems: "center", zIndex: 9998 }}
    ref={forwardedRef}
    {...props}
  />
));

const StyledContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>((props, forwardedRef) => (
  <DialogPrimitive.Content
    ref={forwardedRef}
    data-h2-font-family="base(sans)"
    data-h2-margin="base(x3, auto)"
    data-h2-position="base(relative)"
    data-h2-width="base(90vw)"
    style={{
      zIndex: 9999,
    }}
    {...props}
    onPointerDownOutside={(event) => {
      const target = event.target as HTMLElement;

      /**
       * Roughly determine if the user is attempting to interact
       * with a hidden scrollbar.
       *
       * Note: 16 is a rough estimate of the width of these scrollbars
       * it is not entirely accurate since they change based on your operating system.
       * This may create a small dead zone of 1-3px where clicking the overlay will not
       * close the dialog. This is a trade off to allow users to scroll without a wheel.
       *
       * `targetIsScrollbar`: Checks to see if the click ocurred within 16px
       * edge of the screen
       *
       * `targetIsScrollable`: Checks to see if the visible height of the container
       * exceeds the total scroll height
       *
       */
      const targetIsScrollbar =
        target.offsetWidth - event.detail.originalEvent.clientX < 16;
      const targetIsScrollable = target.clientHeight - target.scrollHeight < 0;

      if (targetIsScrollbar && targetIsScrollable) {
        event.preventDefault();
        return;
      }

      props.onPointerDownOutside?.(event);
    }}
  />
));

const StyledClose = forwardRef<
  ElementRef<typeof DialogPrimitive.Close>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>((props, forwardedRef) => (
  <DialogPrimitive.Close ref={forwardedRef} asChild {...props} />
));

interface DialogProps extends DialogPrimitiveContentProps {
  container?: HTMLElement;
  wide?: boolean;
  closeLabel?: string;
  hasSubtitle?: boolean;
}

type DialogPrimitiveContentProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
>;

const Content = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogProps
>(
  (
    {
      container,
      closeLabel,
      children,
      wide = false,
      hasSubtitle = false,
      ...props
    },
    forwardedRef,
  ) => {
    const intl = useIntl();

    return (
      <DialogPrimitive.Portal container={container}>
        <StyledOverlay>
          <StyledContent
            ref={forwardedRef}
            {...(wide
              ? {
                  "data-h2-max-width": "base(x42)",
                }
              : {
                  "data-h2-max-width": "base(x32)",
                })}
            {...(!hasSubtitle && {
              "aria-describedby": undefined,
            })}
            {...props}
          >
            <StyledClose>
              <button
                type="button"
                data-h2-background-color="base(transparent) base:all:hover(white.15) base:all:focus-visible(focus)"
                data-h2-outline="base:focus-visible(1px solid focus)"
                data-h2-outline-offset="base(4px)"
                data-h2-border="base(none)"
                data-h2-color="base:all(white) base:all:focus-visible(black)"
                data-h2-cursor="base(pointer)"
                data-h2-line-height="base(0)"
                data-h2-location="base(x.5, x.5, auto, auto)"
                data-h2-padding="base(x.5)"
                data-h2-position="base(absolute)"
                data-h2-radius="base(circle)"
                data-h2-z-index="base(9)"
                aria-label={
                  closeLabel ?? intl.formatMessage(uiMessages.closeDialog)
                }
              >
                <XMarkIcon data-h2-height="base(x1)" data-h2-width="base(x1)" />
              </button>
            </StyledClose>
            <div
              data-h2-shadow="base(0 0.55rem 1rem -0.2rem rgba(0, 0, 0, .5))"
              data-h2-radius="base(rounded)"
            >
              {children}
            </div>
          </StyledContent>
        </StyledOverlay>
      </DialogPrimitive.Portal>
    );
  },
);

const Trigger = forwardRef<
  ElementRef<typeof DialogPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ asChild = true, ...rest }, forwardedRef) => (
  <DialogPrimitive.Trigger ref={forwardedRef} asChild={asChild} {...rest} />
));

const StyledTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
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

const StyledDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>((props, forwardedRef) => (
  <DialogPrimitive.Description
    data-h2-margin="base(x.5, 0, 0, 0)"
    ref={forwardedRef}
    {...props}
  />
));

interface DialogHeaderProps {
  subtitle?: ReactNode;
  children: ReactNode;
}

const Header = ({ subtitle, children }: DialogHeaderProps) => (
  <div>
    <div
      data-h2-padding="base(x1)"
      data-h2-position="base(relative)"
      data-h2-overflow="base(hidden)"
      data-h2-background="base:all(black)"
      data-h2-color="base:all(white)"
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

interface DialogFooterProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
}

const Footer = ({ children, ...rest }: DialogFooterProps) => (
  <div data-h2-margin="base(x1 0 0 0)">
    <Separator space="none" data-h2-margin-bottom="base(x1)" />
    <div
      data-h2-align-items="base(center)"
      data-h2-display="base(flex)"
      data-h2-gap="base(0 x.5)"
      {...rest}
    >
      {children}
    </div>
  </div>
);

interface DialogBodyProps {
  children: ReactNode;
}

const Body = ({ children }: DialogBodyProps) => (
  <div
    data-h2-background="base(foreground)"
    data-h2-padding="base(x1)"
    data-h2-radius="base(0 0 rounded rounded)"
    data-h2-border="base(1px solid black.2)"
    data-h2-color="base(black)"
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
  BaseContent: StyledContent,
  Portal: DialogPrimitive.Portal,
};

export default Dialog;
