/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/**
 * We have non-interactive elements with event listeners attached them here
 * out of necessity to allow for clicking of the overlay to dismiss a
 * dialog.
 *
 * TODO: Need to research a bit more to figure out away to make this
 * more accessible without removing any functionality.
 */
import React from "react";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";

import Portal from "../Portal/Portal";

interface OverlayInnerProps {
  onDismiss: (event: React.MouseEvent | React.KeyboardEvent) => void;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

const OverlayInner = React.forwardRef<HTMLDivElement, OverlayInnerProps>(
  ({ initialFocusRef, onDismiss, ...rest }, ref) => {
    const mouseDownTarget = React.useRef<EventTarget | null>(null);

    // Function to focus the element passed to initialFocusRef prop
    const activateFocusLock = React.useCallback(() => {
      if (initialFocusRef && initialFocusRef.current) {
        initialFocusRef.current.focus();
      }
    }, [initialFocusRef]);

    const handleMouseDown = (event: React.MouseEvent) => {
      mouseDownTarget.current = event.target;
    };

    const handleClick = (event: React.MouseEvent) => {
      if (mouseDownTarget.current === event.target) {
        event.stopPropagation();
        onDismiss(event);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onDismiss(event);
      }
    };

    return (
      <FocusLock autoFocus returnFocus onActivation={activateFocusLock}>
        <RemoveScroll>
          <div
            className="dt-dialog-overlay"
            ref={ref}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            data-h2-position="b(fixed)"
            {...rest}
          />
        </RemoveScroll>
      </FocusLock>
    );
  },
);

export type OverlayProps = { isOpen: boolean } & OverlayInnerProps;

const Overlay: React.FC<OverlayProps> = React.forwardRef<
  HTMLDivElement,
  OverlayProps
>(({ isOpen, ...rest }, ref) => {
  return isOpen ? (
    <Portal>
      <OverlayInner ref={ref} {...rest} />
    </Portal>
  ) : null;
});

export default Overlay;
