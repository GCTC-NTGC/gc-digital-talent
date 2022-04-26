import React from "react";
import { DialogOverlay } from "@reach/dialog";
import type { DialogOverlayProps } from "@reach/dialog";

const Overlay: React.FC<DialogOverlayProps> = (props) => (
  <DialogOverlay data-h2-bg-color="b(black[.85])" {...props} />
);

export default Overlay;
