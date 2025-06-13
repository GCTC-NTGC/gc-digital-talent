import { Slot } from "@radix-ui/react-slot";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import {
  HTMLProps,
  ReactNode,
  forwardRef,
  useCallback,
  useId,
  ElementRef,
  ComponentPropsWithoutRef,
  HTMLAttributes,
  MouseEventHandler,
  ReactElement,
} from "react";

import Heading, { HeadingProps } from "../Heading";
import useControllableState from "../../hooks/useControllableState";
import {
  ToggleSectionProvider,
  useToggleSectionContext,
} from "./ToggleSectionProvider";
import { tv } from "tailwind-variants";

// Names used for unique IDs
const NAME = {
  INITIAL_CONTENT: "InitialContent",
  OPEN_CONTENT: "OpenContent",
};

/**
 * Compose the value for `aria-controls`
 * attribute on toggles
 *
 * @param contentId string  The unique ID for this section
 * @returns string
 */
const composeControls = (contentId?: string) => {
  let controls;
  if (contentId) {
    controls = `${NAME.INITIAL_CONTENT}-${contentId} ${NAME.OPEN_CONTENT}-${contentId}`;
  }

  return controls;
};

/**
 * Creates a unique ID for content sections
 *
 * @param name string ID prefix (component name)
 * @param contentId string  The unique ID for this section
 * @returns string
 */
const composeId = (name: string, contentId?: string) => {
  let id;
  if (contentId) {
    id = `${name}-${contentId}`;
  }

  return id;
};

interface RootProps extends HTMLProps<HTMLDivElement> {
  /** Sets the section to be 'open' by default */
  defaultOpen?: boolean;
  /** Controllable open state */
  open?: boolean;
  /** Callback when the section has been 'opened */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/**
 * The root component that contains all other components
 * and provides context to those components
 */
const Root = forwardRef<HTMLDivElement, RootProps>(
  (
    { defaultOpen, open: openProp, onOpenChange, children, ...rest },
    forwardedRef,
  ) => {
    const [open = false, setOpen] = useControllableState<boolean>({
      controlledProp: openProp,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const handleOpenToggle = useCallback(() => {
      setOpen((prevOpen) => {
        const newOpen = !prevOpen;
        return newOpen;
      });
    }, [setOpen]);

    return (
      <ToggleSectionProvider
        contentId={useId()}
        open={open}
        onOpenToggle={handleOpenToggle}
        onOpenChange={setOpen}
      >
        <div
          ref={forwardedRef}
          data-state={open ? "open" : "closed"}
          className="flex flex-col gap-y-6"
          {...rest}
        >
          {children}
        </div>
      </ToggleSectionProvider>
    );
  },
);

/**
 * A wrapper used to style the content
 * portion of the section
 */
const Content = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ children, ...props }, forwardedRef) => {
    const context = useToggleSectionContext();

    return (
      <div
        id={context?.contentId}
        ref={forwardedRef}
        className="rounded-md bg-white p-6 text-black shadow-lg dark:bg-gray-600 dark:text-white"
        {...props}
      >
        {children}
      </div>
    );
  },
);

/**
 * The content that is displayed when
 * the section is 'closed'
 */
const InitialContent = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ children, ...props }, forwardedRef) => {
    const context = useToggleSectionContext();
    const id = composeId(NAME.INITIAL_CONTENT, context?.contentId);

    return (
      <div id={id} ref={forwardedRef} {...props}>
        {context?.open ? null : children}
      </div>
    );
  },
);

/**
 * The content that is displayed when
 * the section is 'open'
 */
const OpenContent = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ children, ...props }, forwardedRef) => {
    const context = useToggleSectionContext();
    const id = composeId(NAME.OPEN_CONTENT, context?.contentId);

    return (
      <div id={id} ref={forwardedRef} {...props}>
        {context?.open ? children : null}
      </div>
    );
  },
);

/**
 * A toggle that opens and closes
 * the section
 *
 * SEE: https://www.radix-ui.com/docs/primitives/components/toggle
 */
const Trigger = forwardRef<
  ElementRef<typeof TogglePrimitive.Root>,
  Omit<ComponentPropsWithoutRef<typeof TogglePrimitive.Root>, "asChild">
>(({ children, onPressedChange, ...toggleProps }, forwardedRef) => {
  const context = useToggleSectionContext();
  const controls = composeControls(context?.contentId);

  const handleOnPressedChange = (newPressed: boolean) => {
    context?.onOpenToggle?.();

    onPressedChange?.(newPressed);
  };

  return (
    <TogglePrimitive.Root
      ref={forwardedRef}
      asChild
      aria-controls={controls}
      pressed={context?.open ?? false}
      onPressedChange={handleOnPressedChange}
      {...toggleProps}
    >
      {children}
    </TogglePrimitive.Root>
  );
});

interface ToggleProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  /** Determine if this toggle opens or closes the section */
  open: boolean;
}

const Toggle = forwardRef<HTMLElement, ToggleProps>(
  ({ onClick, open, ...props }, forwardedRef) => {
    const context = useToggleSectionContext();
    const controls = composeControls(context?.contentId);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      if (onClick) {
        onClick(event);
      }

      context?.onOpenChange?.(open);
    };

    return (
      <Slot
        onClick={handleClick}
        ref={forwardedRef}
        aria-controls={controls}
        {...props}
      />
    );
  },
);

/**
 * Generic wrapper that attaches a click
 * handler to a button that 'opens' the section
 */
const Open = forwardRef<HTMLElement, Omit<ToggleProps, "open">>(
  (props, forwardedRef) => {
    return <Toggle open ref={forwardedRef} {...props} />;
  },
);

/**
 * Generic wrapper that attaches a click
 * handler to a button that 'closes' the section
 */
const Close = forwardRef<HTMLElement, Omit<ToggleProps, "open">>(
  (props, forwardedRef) => {
    return <Toggle open={false} ref={forwardedRef} {...props} />;
  },
);

const header = tv({
  base: "my-0 grow",
});

interface HeaderProps extends HeadingProps {
  /** The toggle for the component (appears on right side of header) */
  toggle?: ReactElement<typeof Toggle>;
}

/**
 * A styled header for the section
 */
const Header = forwardRef<HTMLHeadingElement, HeaderProps>(
  ({ toggle, className, ...headingProps }, forwardedRef) => {
    return (
      <div className="flex flex-col items-start justify-between gap-6 xs:flex-row xs:items-center">
        <Heading
          ref={forwardedRef}
          className={header({ class: className })}
          {...headingProps}
        />
        <div className="shrink">{toggle}</div>
      </div>
    );
  },
);

export default {
  Root,
  Trigger,
  InitialContent,
  OpenContent,
  Content,
  Open,
  Close,
  Header,
  useContext: useToggleSectionContext,
};
