import * as React from "react";

/**
 * Props that can be passed to an `<TreeView.Item />`
 *
 * @interface TreeViewItemProps
 * @member {boolean} noBranch controls wether item is connected to tree line.
 */
interface TreeViewItemProps {
  noBranch?: boolean;
  children: React.ReactNode;
}

const Item = ({ noBranch, children, ...rest }: TreeViewItemProps) => (
  <div
    className="tree-view-item"
    data-h2-margin-left="base(x1)"
    data-h2-padding-left="base(x1)"
    data-h2-padding-top="base(x.5)"
    data-h2-border-left="base:selectors[:not(:last-child)](1px solid gray) base:selectors[:last-child:before](1px solid gray)"
    data-h2-content="base:selectors[::before]('')"
    data-h2-display="base:selectors[::before](block)"
    data-h2-position="base(relative) base:selectors[::before](absolute)"
    data-h2-border-bottom="base:selectors[::before](1px solid gray)"
    data-h2-left="base:selectors[::before](0)"
    data-h2-top="base:selectors[::before](0)"
    data-h2-height="base:selectors[::before](calc(50% + x.25))"
    data-h2-z-index="base(0) base:selectors[:last-child:before](-1)"
    {...(noBranch ? {} : { "data-h2-width": "base:selectors[::before](x1)" })}
    {...rest}
  >
    {children}
  </div>
);

interface TreeViewHeadProps {
  children: React.ReactNode;
}

/**
 * Props that can be passed to an `<TreeView.Head />`
 *
 * @interface TreeViewHeadProps
 */
const Head = ({ children }: TreeViewHeadProps) => <div>{children}</div>;

interface TreeViewRootProps {
  children: React.ReactNode;
}

/**
 * Props that can be passed to an `<TreeView.Root />`
 *
 * @interface TreeViewRootProps
 */
const Root = ({ children, ...rest }: TreeViewRootProps) => (
  <div {...rest}>{children}</div>
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
   * @name Head
   * @desc Contains the head of the tree. All tree items will fall under this element.
   */
  Head,
  /**
   * @name Item
   * @desc Contains an item in the tree.
   */
  Item,
};

export default TreeView;
