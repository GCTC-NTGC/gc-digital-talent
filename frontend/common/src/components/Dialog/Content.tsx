import React from "react";
import { DialogContent } from "@reach/dialog";
import type { DialogContentProps } from "@reach/dialog";

const Content: React.FC<
  DialogContentProps & { className: string | undefined }
> = (props) => (
  <DialogContent
    data-h2-background-color="base(dt-white)"
    data-h2-margin="base(x4, auto)"
    data-h2-position="base(relative)"
    data-h2-radius="base(s)"
    data-h2-shadow="base(s)"
    {...props}
  />
);

export default Content;
