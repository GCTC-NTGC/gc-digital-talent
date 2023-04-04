import React from "react";
import Card from "../Card";

import "./tree-view.css";

interface TreeViewItemProps {
  noBranch?: boolean;
  children: React.ReactNode;
}

const Item = ({ noBranch, children, ...rest }: TreeViewItemProps) => (
  <li className={noBranch ? "no-branch" : ""} {...rest}>
    <div data-h2-width="base(100%)">{children}</div>
  </li>
);

interface TreeViewRootProps {
  title: string;
  subtitle?: string;
  error?: string;
  children: React.ReactNode;
}

const Root = ({
  title,
  subtitle,
  error,
  children,
  ...rest
}: TreeViewRootProps) => (
  <ul className="tree" {...rest}>
    <Card title={title} color="white" bold>
      {subtitle && <p>{subtitle}</p>}
    </Card>
    {error && (
      <li className="error">
        <span
          role="alert"
          aria-live="polite"
          data-h2-display="base(inline-block)"
          data-h2-border="base(1px solid warning.darker)"
          data-h2-radius="base(input)"
          data-h2-background-color="base(warning.lightest)"
          data-h2-padding="base(x.75)"
          data-h2-color="base(warning.darker)"
          data-h2-font-size="base(caption)"
        >
          {error}
        </span>
      </li>
    )}
    {children}
  </ul>
);

const TreeView = {
  Root,
  Item,
};

export default TreeView;
