import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import Heading, { HeadingProps } from "../Heading";
import useControllableState from "../../hooks/useControllableState";
import {
  ToggleSectionProvider,
  useToggleSectionContext,
} from "./ToggleSectionProvider";

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

interface RootProps extends React.HTMLProps<HTMLDivElement> {
  /** Sets the section to be 'open' by default */
  defaultOpen?: boolean;
  /** Controllable open state */
  open?: boolean;
  /** Callback when the section has been 'opened */
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

/**
 * The root component that contains all other components
 * and provides context to those components
 */
const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (
    { defaultOpen, open: openProp, onOpenChange, children, ...rest },
    forwardedRef,
  ) => {
    const [open = false, setOpen] = useControllableState<boolean>({
      controlledProp: openProp,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const handleOpenToggle = React.useCallback(() => {
      setOpen((prevOpen) => {
        const newOpen = !prevOpen;
        return newOpen;
      });
    }, [setOpen]);

    return (
      <ToggleSectionProvider
        contentId={React.useId()}
        open={open}
        onOpenToggle={handleOpenToggle}
        onOpenChange={setOpen}
      >
        <div
          ref={forwardedRef}
          {...rest}
          data-state={open ? "open" : "closed"}
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1, 0)"
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
const Content = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, ...props }, forwardedRef) => {
  const context = useToggleSectionContext();

  return (
    <div
      id={context?.contentId}
      ref={forwardedRef}
      data-h2-background="base(foreground)"
      data-h2-color="base(black)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(rounded)"
      data-h2-shadow="base(m)"
      {...props}
    >
      {children}
    </div>
  );
});

/**
 * The content that is displayed when
 * the section is 'closed'
 */
const InitialContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, ...props }, forwardedRef) => {
  const context = useToggleSectionContext();
  const id = composeId(NAME.INITIAL_CONTENT, context?.contentId);

  return (
    <div id={id} ref={forwardedRef} {...props}>
      {context?.open ? null : children}
    </div>
  );
});

/**
 * The content that is displayed when
 * the section is 'open'
 */
const OpenContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, ...props }, forwardedRef) => {
  const context = useToggleSectionContext();
  const id = composeId(NAME.OPEN_CONTENT, context?.contentId);

  return (
    <div id={id} ref={forwardedRef} {...props}>
      {context?.open ? children : null}
    </div>
  );
});

/**
 * A toggle that opens and closes
 * the section
 *
 * SEE: https://www.radix-ui.com/docs/primitives/components/toggle
 */
const Trigger = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>, "asChild">
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
      pressed={context?.open || false}
      onPressedChange={handleOnPressedChange}
      {...toggleProps}
    >
      {children}
    </TogglePrimitive.Root>
  );
});

interface ToggleProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** Determine if this toggle opens or closes the section */
  open: boolean;
}

const Toggle = React.forwardRef<HTMLElement, ToggleProps>(
  ({ onClick, open, ...props }, forwardedRef) => {
    const context = useToggleSectionContext();
    const controls = composeControls(context?.contentId);

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
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
const Open = React.forwardRef<HTMLElement, Omit<ToggleProps, "open">>(
  (props, forwardedRef) => {
    return <Toggle open ref={forwardedRef} {...props} />;
  },
);

/**
 * Generic wrapper that attaches a click
 * handler to a button that 'closes' the section
 */
const Close = React.forwardRef<HTMLElement, Omit<ToggleProps, "open">>(
  (props, forwardedRef) => {
    return <Toggle open={false} ref={forwardedRef} {...props} />;
  },
);

interface HeaderProps extends HeadingProps {
  /** The toggle for the component (appears on right side of header) */
  toggle?: React.ReactElement<typeof Toggle>;
}

/**
 * A styled header for the section
 */
const Header = React.forwardRef<HTMLHeadingElement, HeaderProps>(
  ({ toggle, ...headingProps }, forwardedRef) => {
    return (
      <div data-h2-flex-grid="base(center, x2)">
        <Heading
          ref={forwardedRef}
          data-h2-flex-item="base(fill)"
          {...headingProps}
        />
        <div data-h2-flex-item="base(content)">{toggle}</div>
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
