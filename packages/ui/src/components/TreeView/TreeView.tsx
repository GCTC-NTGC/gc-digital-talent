import { ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

const item = tv({
  base: `relative z-0 ml-6 pt-3 pl-6 not-last:border-l not-last:border-l-gray before:absolute before:top-0 before:left-0 before:h-[calc(50%+0.375rem)] before:border-b before:border-b-gray last:before:-z-[1] last:before:block last:before:border-l last:before:border-l-gray`,
  variants: {
    noBranch: {
      false: "before:w-6",
    },
  },
});

type TreeViewItemVariants = VariantProps<typeof item>;

/**
 * Props that can be passed to an `<TreeView.Item />`
 *
 * @interface TreeViewItemProps
 * @member {boolean} noBranch controls whether item is connected to tree line.
 */
interface TreeViewItemProps extends TreeViewItemVariants {
  children: ReactNode;
}

const Item = ({ noBranch, children, ...rest }: TreeViewItemProps) => (
  <div className={item({ noBranch })} {...rest}>
    {children}
  </div>
);

interface TreeViewHeadProps {
  children: ReactNode;
}

/**
 * Props that can be passed to an `<TreeView.Head />`
 *
 * @interface TreeViewHeadProps
 */
const Head = ({ children }: TreeViewHeadProps) => <div>{children}</div>;

interface TreeViewRootProps {
  children: ReactNode;
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
