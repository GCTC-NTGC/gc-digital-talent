import React from "react";
import { DialogContent } from "@reach/dialog";
import type { DialogContentProps } from "@reach/dialog";

const Content: React.FC<DialogContentProps> = (props) => (
  <DialogContent
    data-h2-bg-color="b(white)"
    data-h2-margin="b(top-bottom, xxl)"
    data-h2-radius="b(s)"
    data-h2-shadow="b(s)"
    {...props}
  />
);

export default Content;
