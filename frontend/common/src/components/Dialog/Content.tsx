import React from "react";
import { DialogContent } from "@reach/dialog";
import type { DialogContentProps } from "@reach/dialog";

const Content: React.FC<
  DialogContentProps & { className: string | undefined }
> = (props) => (
  <DialogContent
    data-h2-background-color="b(dt-white)"
    data-h2-margin="b(x4, auto)"
    data-h2-position="b(relative)"
    data-h2-radius="b(s)"
    data-h2-shadow="b(s)"
    {...props}
  />
);

export default Content;
