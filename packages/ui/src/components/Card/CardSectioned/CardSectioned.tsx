import { ReactElement, ReactNode } from "react";

interface ItemProps {
  children?: ReactNode;
}

const Item = ({ children, ...rest }: ItemProps) => {
  return (
    <div
      data-h2-background-color="base(foreground)"
      data-h2-padding="base(x1.5)"
      data-h2-shadow="base(larger)"
      {...rest}
    >
      {children}
    </div>
  );
};

type ItemElement = ReactElement<ItemProps>;

interface RootProps {
  children: ItemElement | ItemElement[];
}

const Root = ({ children }: RootProps) => {
  return (
    <div
      // child properties
      data-h2-border-top-left-radius="base:selectors[>div:first-child](rounded)"
      data-h2-border-top-right-radius="base:selectors[>div:first-child](rounded)"
      data-h2-border-bottom-left-radius="base:selectors[>div:last-child](rounded)"
      data-h2-border-bottom-right-radius="base:selectors[>div:last-child](rounded)"
      data-h2-border-bottom="base:selectors[>div:not(:last-child)](1px solid gray.light)"
      // self properties
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(0)"
    >
      {children}
    </div>
  );
};

export default {
  Root,
  Item,
};
