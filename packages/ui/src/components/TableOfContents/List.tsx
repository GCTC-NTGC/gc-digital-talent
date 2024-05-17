import { HTMLProps } from "react";

export type ListItemProps = HTMLProps<HTMLLIElement>;

export const ListItem = ({ children, ...rest }: ListItemProps) => (
  <li data-h2-margin-bottom="base(x.25)" {...rest}>
    {children}
  </li>
);

export interface ListProps extends HTMLProps<HTMLUListElement> {
  space?: "sm" | "lg";
}

const List = ({ children, space = "lg", ...rest }: ListProps) => {
  return (
    <ul
      data-h2-padding-left="base(x1)"
      data-h2-list-style-type="base(disc)"
      data-h2-list-style-position="base(inside)"
      {...(space === "lg"
        ? {
            "data-h2-margin": "base(x1 0)",
          }
        : {
            "data-h2-margin": "base(x.25 0)",
          })}
      {...rest}
    >
      {children}
    </ul>
  );
};

export default List;
