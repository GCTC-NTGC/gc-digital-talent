import React from "react";
import Card from "../Card";

import "./tree-view.css";

interface TreeViewItemProps {
  noBranch?: boolean;
  children: React.ReactNode;
}

const Item = ({ noBranch, children, ...rest }: TreeViewItemProps) => (
  <div
    className="leaf"
    data-h2-margin-left="base(x2)"
    data-h2-padding-left="base(x1)"
    data-h2-padding-top="base(x1)"
    data-h2-border-left="base:selectors[:not(:last-child)](1px solid gray.light)"
    data-h2-content="base:selectors[::before]('')"
    data-h2-display="base:selectors[::before](block)"
    data-h2-position="base:selectors[::before](absolute)"
    data-h2-width="base:selectors[::before](x1)"
    data-h2-border-bottom="base:selectors[::before](1px solid gray.light)"
    data-h2-left="base:selectors[::before](0)"
    data-h2-top="base:selectors[::before](0)"
    data-h2-height="base:selectors[::before](calc(50% + x.5))"
    {...rest}
  >
    {children}
  </div>
);

interface TreeViewRootProps {
  title: string;
  subtitle?: React.ReactNode;
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
  // <Card title={title} color="white" bold>
  //   {subtitle && <p>{subtitle}</p>}
  // </Card>
  <div {...rest}>
    <Card title={title} color="white" bold>
      {subtitle && <p>{subtitle}</p>}
    </Card>
    {children}
  </div>
);

/**
 * @name TreeView
 * @desc A tree view widget presents a hierarchical list.
 */
const TreeView = {
  /**
   * @name Root
   * @desc Contains all the parts of a TreeView.
   */
  Root,
  /**
   * @name Item
   * @desc Contains an item in the tree.
   */
  Item,
};

export default TreeView;
