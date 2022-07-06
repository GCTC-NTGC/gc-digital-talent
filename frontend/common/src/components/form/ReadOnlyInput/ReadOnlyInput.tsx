import React from "react";

export type ReadOnlyInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const ReadOnlyInput = ({
  type = "text",
  ...rest
}: ReadOnlyInputProps): JSX.Element => (
  <input
    data-h2-bg-color="b(lightgray)"
    data-h2-padding="b(all, xxs)"
    data-h2-radius="b(s)"
    data-h2-border="b(gray, all, solid, s)"
    style={{ width: "100%" }}
    data-h2-font-size="b(normal)"
    data-h2-font-family="b(sans)"
    readOnly
    type={type}
    {...rest}
  />
);

export default ReadOnlyInput;
