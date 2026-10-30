import type { AnchorHTMLAttributes, JSX } from "react";

import type { HeadingRank, LinkProps } from "@gc-digital-talent/ui";
import { Heading, Link, Ul } from "@gc-digital-talent/ui";

import type { RenderMap, Node, NodeRenderer } from "./types";

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

  let linkProps: LinkProps = { href: "" };
  const isLink = node?.marks?.find((mark) => {
    if (mark.type === "link") {
      const attrs = mark.attrs as AnchorHTMLAttributes<HTMLAnchorElement>;
      linkProps = {
        href: attrs?.href ? String(attrs.href) : "",
        id: attrs?.id ? String(attrs.id) : undefined,
        newTab:
          attrs?.target === "_blank" &&
          !attrs?.href?.startsWith("#") &&
          !attrs?.href?.startsWith("/"),
      };
      return true;
    }

    return false;
  });

  return isLink ? (
    <Link href={linkProps.href} id={linkProps.id} newTab={linkProps.newTab}>
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

const DescriptionListNode: NodeRenderer = ({ children }) => {
  return <dl className="my-6">{children}</dl>;
};

const DescriptionTermNode: NodeRenderer = ({ children }) => {
  return <dt className="font-bold">{children}</dt>;
};

const DescriptionDetailsNode: NodeRenderer = ({ children }) => {
  return <dd className="mb-3 ml-6 block">{children}</dd>;
};

const rankMap: Record<number, HeadingRank> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

const HeadingNode: NodeRenderer = ({ node, children }) => {
  let level = 3;
  if (node.attrs && "level" in node.attrs) {
    level = Number(node.attrs.level);
  }
  let size = level + 1;
  if (level > 6) {
    size = 6;
  }

  return (
    <Heading
      id={node.attrs?.id ? String(node.attrs.id) : undefined}
      rank={rankMap[level] ?? "h6"}
      size={rankMap[size] ?? "h6"}
    >
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
  descriptionList: DescriptionListNode,
  descriptionTerm: DescriptionTermNode,
  descriptionDetails: DescriptionDetailsNode,
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
