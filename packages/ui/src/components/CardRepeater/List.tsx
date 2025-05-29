import { DetailedHTMLProps, HTMLAttributes } from "react";

const List = ({
  children,
  ...rest
}: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => (
  <ul className="m-0 mb-3 flex list-none flex-col gap-y-3 p-0" {...rest}>
    {children}
  </ul>
);

export default List;
