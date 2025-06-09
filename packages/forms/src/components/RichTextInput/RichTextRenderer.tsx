import { AnchorHTMLAttributes, JSX } from "react";

import { Heading, Link, LinkProps, Ul } from "@gc-digital-talent/ui";

import { RenderMap, Node, NodeRenderer } from "./types";

const NoNode: NodeRenderer = ({ children }) => {
  return <>{children}</>;
};

const DocNode: NodeRenderer = ({ children }) => (
  <div className="text-black *:first:mt-0 dark:text-white [&>p,&>ul]:not-first:mt-3">
    {children}
  </div>
);

const TextNode: NodeRenderer = ({ node }) => {
  const content = String(node.text);

  let linkProps: LinkProps = {};
  const isLink = node?.marks?.find((mark) => {
    if (mark.type === "link") {
      const attrs = mark.attrs as AnchorHTMLAttributes<HTMLAnchorElement>;
      linkProps = {
        href: attrs?.href ? String(attrs.href) : undefined,
        newTab: attrs?.target === "_blank",
      };
      return true;
    }

    return false;
  });

  return isLink ? (
    <Link href={linkProps.href} newTab={linkProps.newTab}>
      {content}
    </Link>
  ) : (
    <>{content}</>
  );
};

const ParagraphNode: NodeRenderer = ({ children }) => {
  return <p>{children}</p>;
};

const BulletListNode: NodeRenderer = ({ children }) => {
  return <Ul>{children}</Ul>;
};

const ListItemNode: NodeRenderer = ({ children }) => {
  return <li>{children}</li>;
};

const HeadingNode: NodeRenderer = ({ children }) => {
  return (
    <Heading level="h3" size="h4">
      {children}
    </Heading>
  );
};

const nodeRenderMap: RenderMap = {
  doc: DocNode,
  text: TextNode,
  paragraph: ParagraphNode,
  bulletList: BulletListNode,
  listItem: ListItemNode,
  heading: HeadingNode,
};

interface RichTextRendererProps {
  /** The current node object */
  node: Node;
  /** A map of components to render for each node type */
  renderMap?: RenderMap;
}

const RichTextRenderer = ({
  node,
  renderMap = nodeRenderMap,
}: RichTextRendererProps) => {
  const children: JSX.Element[] = [];
  // Node has its own content so recursively append it.
  if (node.content) {
    node.content.forEach((childNode, index) => {
      children.push(
        <RichTextRenderer
          key={`${childNode.type}-${index}`}
          node={childNode}
          {...{ renderMap }}
        />,
      );
    });
  }

  // We do not have a renderer for this
  if (!(node.type in renderMap)) {
    return <NoNode node={node}>{children}</NoNode>;
  }

  const Component = renderMap[node.type];

  return <Component node={node}>{children}</Component>;
};

export default RichTextRenderer;
