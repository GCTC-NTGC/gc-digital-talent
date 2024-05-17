import { DetailedHTMLProps, HTMLAttributes } from "react";

const List = ({
  children,
  ...rest
}: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => (
  <ul
    className="flex"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x.5 0)"
    data-h2-list-style="base(none)"
    data-h2-margin="base(0 0 x.5 0)"
    data-h2-padding="base(0)"
    {...rest}
  >
    {children}
  </ul>
);

export default List;
