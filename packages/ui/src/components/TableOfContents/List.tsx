import { HTMLProps } from "react";
import { tv, VariantProps } from "tailwind-variants";

export type ListItemProps = HTMLProps<HTMLLIElement>;

export const ListItem = ({ children, ...rest }: ListItemProps) => (
  <li className="mb-1.5" {...rest}>
    {children}
  </li>
);

// TO DO: Create a base `List` component to avoid needing important
// This is because we use `ul` and apply styles in plain css
const list = tv({
  base: "list-inside list-disc pl-6!",
  variants: {
    space: {
      sm: "my-1.5",
      lg: "my-6",
    },
  },
});

type ListVariants = VariantProps<typeof list>;

export interface ListProps extends ListVariants, HTMLProps<HTMLUListElement> {}

const List = ({ children, space = "lg", className, ...rest }: ListProps) => {
  return (
    <ul className={list({ space, class: className })} {...rest}>
      {children}
    </ul>
  );
};

export default List;
