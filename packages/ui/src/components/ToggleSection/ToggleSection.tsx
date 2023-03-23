import React from "react";
import { Slot } from "@radix-ui/react-slot";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import Heading, { HeadingProps } from "../Heading";

import {
  ToggleSectionProvider,
  useToggleSectionContext,
} from "./ToggleSectionProvider";

interface RootProps {
  defaultOpen?: boolean;
  onOpenToggle?: (open: boolean) => void;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ defaultOpen, onOpenToggle, children }, forwardedRef) => {
    const [open, setOpen] = React.useState<boolean>(defaultOpen || false);

    const handleOpenToggle = React.useCallback(() => {
      setOpen((prevOpen) => {
        const newOpen = !prevOpen;
        if (onOpenToggle) {
          onOpenToggle(newOpen);
        }
        return newOpen;
      });
    }, [onOpenToggle]);

    return (
      <ToggleSectionProvider
        contentId={React.useId()}
        open={open}
        onOpenToggle={handleOpenToggle}
        onOpenChange={setOpen}
      >
        <div
          ref={forwardedRef}
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

type TriggerProps = {
  children: React.ReactNode;
  openText?: React.ReactNode;
};

const Content = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, ...props }, forwardedRef) => {
  const context = useToggleSectionContext();

  return (
    <div
      id={context?.contentId}
      ref={forwardedRef}
      data-h2-background="base(white) base:dark(black)"
      data-h2-color="base(black) base:dark(white)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(rounded)"
      data-h2-shadow="base(m)"
      {...props}
    >
      {children}
    </div>
  );
});

const INITIAL_CONTENT_NAME = "InitialContent";

const InitialContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, ...props }, forwardedRef) => {
  const context = useToggleSectionContext();
  let id;
  if (context?.contentId) {
    id = `${INITIAL_CONTENT_NAME}-${context.contentId}`;
  }

  return (
    <div
      id={id}
      ref={forwardedRef}
      aria-selected={!!context?.open || false}
      {...props}
    >
      {context?.open ? null : children}
    </div>
  );
});

const OPEN_CONTENT_NAME = "InitialContent";

const OpenContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, ...props }, forwardedRef) => {
  const context = useToggleSectionContext();
  let id;
  if (context?.contentId) {
    id = `${OPEN_CONTENT_NAME}-${context.contentId}`;
  }

  return (
    <div
      id={id}
      ref={forwardedRef}
      aria-selected={context?.open || false}
      {...props}
    >
      {context?.open ? children : null}
    </div>
  );
});

const composeControls = (contentId?: string) => {
  let controls;
  if (contentId) {
    controls = `${INITIAL_CONTENT_NAME}-${contentId} ${OPEN_CONTENT_NAME}-${contentId}`;
  }

  return controls;
};

const Trigger = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  TriggerProps
>(({ children, ...toggleProps }, forwardedRef) => {
  const context = useToggleSectionContext();
  const controls = composeControls(context?.contentId);

  return (
    <TogglePrimitive.Root
      ref={forwardedRef}
      asChild
      {...toggleProps}
      aria-controls={controls}
      pressed={context?.open || false}
      onPressedChange={context?.onOpenToggle}
    >
      {children}
    </TogglePrimitive.Root>
  );
});

interface ToggleProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
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

const Open = React.forwardRef<HTMLElement, Omit<ToggleProps, "open">>(
  (props, forwardedRef) => {
    return <Toggle open ref={forwardedRef} {...props} />;
  },
);

const Close = React.forwardRef<HTMLElement, Omit<ToggleProps, "open">>(
  (props, forwardedRef) => {
    return <Toggle open={false} ref={forwardedRef} {...props} />;
  },
);

interface HeaderProps extends HeadingProps {
  toggle: React.ReactElement<typeof Toggle>;
}

const Header = React.forwardRef<HTMLHeadingElement, HeaderProps>(
  ({ toggle, ...headingProps }, forwardedRef) => {
    return (
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-align-items="base(center) l-tablet(flex-end)"
        data-h2-justify-content="base(space-between)"
      >
        <Heading
          ref={forwardedRef}
          data-h2-margin="base(0)"
          {...headingProps}
        />
        <div data-h2-flex-shrink="base(0)">{toggle}</div>
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
