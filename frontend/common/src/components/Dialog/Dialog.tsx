import React from "react";

import Content from "./Content";
import Overlay from "./Overlay";
import type { OverlayProps } from "./Overlay";

import "./dialog.css";

const Dialog: React.FC<OverlayProps> = React.forwardRef<
  HTMLDivElement,
  OverlayProps
>(({ initialFocusRef, isOpen, onDismiss, ...rest }, ref) => (
  <Overlay
    initialFocusRef={initialFocusRef}
    isOpen={isOpen}
    onDismiss={onDismiss}
  >
    <Content ref={ref} {...rest} />
  </Overlay>
));

export default Dialog;
