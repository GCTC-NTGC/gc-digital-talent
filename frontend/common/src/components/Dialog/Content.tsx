/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";

const Content = React.forwardRef<HTMLDivElement>((props, ref) => (
  // NOTE: We do not care about keyboard events here since we are just trying to event bubbling
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  <div
    className="dt-dialog-content"
    aria-modal="true"
    role="dialog"
    tabIndex={-1}
    ref={ref}
    onClick={(event: React.MouseEvent) => {
      event.stopPropagation();
    }}
    data-h2-margin="b(top-bottom, l)"
    data-h2-bg-color="b(white)"
    data-h2-shadow="b(s)"
    {...props}
  />
));

export default Content;
