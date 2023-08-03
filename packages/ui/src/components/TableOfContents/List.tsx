import * as React from "react";

export type ListItemProps = React.HTMLProps<HTMLLIElement>;

export const ListItem = ({ children, ...rest }: ListItemProps) => (
  <li data-h2-margin-bottom="base(x.25)" {...rest}>
    <span
      data-h2-display="base(inline-flex)"
      data-h2-align-items="base(flex-start)"
    >
      {children}
    </span>
  </li>
);

export interface ListProps extends React.HTMLProps<HTMLUListElement> {
  space?: "sm" | "lg";
}

const List = ({ children, space = "lg", ...rest }: ListProps) => {
  return (
    <ul
      data-h2-list-style-type="base(disc)"
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
