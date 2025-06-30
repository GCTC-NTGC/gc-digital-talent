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
import { tv, VariantProps } from "tailwind-variants";

import { uiMessages } from "@gc-digital-talent/i18n";

import Separator from "../Separator";

const StyledOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>((props, forwardedRef) => (
  <DialogPrimitive.Overlay
    className="fixed inset-0 z-[9998] grid place-items-center overflow-auto bg-gray-700/90"
    ref={forwardedRef}
    {...props}
  />
));

const content = tv({
  base: "relative z-[9999] mx-auto my-18 w-[90vw] font-sans",
  variants: {
    wide: {
      true: "max-w-5xl",
      false: "max-w-3xl",
    },
  },
});

type ContentVariants = VariantProps<typeof content>;

interface StyledContentProps
  extends ContentVariants,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {}

const StyledContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  StyledContentProps
>(({ wide, ...rest }, forwardedRef) => (
  <DialogPrimitive.Content
    ref={forwardedRef}
    className={content({ wide })}
    {...rest}
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

      rest.onPointerDownOutside?.(event);
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
  wide?: StyledContentProps["wide"];
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
            wide={wide}
            {...(!hasSubtitle && {
              "aria-describedby": undefined,
            })}
            {...props}
          >
            <StyledClose>
              <button
                type="button"
                className="line-height-0 absolute top-3 right-3 z-10 cursor-pointer rounded-full border-none bg-transparent p-3 text-white ring-focus ring-offset-4 ring-offset-black outline-none hover:bg-white/15 focus-visible:bg-focus focus-visible:text-black focus-visible:ring"
                aria-label={
                  closeLabel ?? intl.formatMessage(uiMessages.closeDialog)
                }
              >
                <XMarkIcon className="size-6" />
              </button>
            </StyledClose>
            <div className="rounded-md shadow-xl">{children}</div>
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
    className="mb-3 text-2xl font-bold lg:text-3xl"
    ref={forwardedRef}
    {...props}
  />
));

const StyledDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>((props, forwardedRef) => (
  <DialogPrimitive.Description ref={forwardedRef} {...props} />
));

interface DialogHeaderProps {
  subtitle?: ReactNode;
  children: ReactNode;
}

const Header = ({ subtitle, children }: DialogHeaderProps) => (
  <>
    <div className="relative overflow-hidden rounded-t-md bg-black p-6 text-white">
      <div className="relative">
        <StyledTitle>{children}</StyledTitle>
        {subtitle ? <StyledDescription>{subtitle}</StyledDescription> : ""}
      </div>
    </div>
    <div className="h-6 bg-linear-(--gradient-main-linear)" />
  </>
);

const footer = tv({
  base: "flex flex-col items-center gap-3 xs:flex-row",
});

interface DialogFooterProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Footer = ({ children, className, ...rest }: DialogFooterProps) => (
  <>
    <Separator space="sm" />
    <div className={footer({ class: className })} {...rest}>
      {children}
    </div>
  </>
);

interface DialogBodyProps {
  children: ReactNode;
}

const Body = ({ children }: DialogBodyProps) => (
  <div className="rounded-b-md border border-black/20 bg-white p-6 text-black dark:border-white/20 dark:bg-gray-600 dark:text-white">
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
