/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Attrs {
  readonly [attr: string]: any;
}

export interface Node {
  type: string;
  attrs?: Attrs;
  marks?: Attrs[];
  content?: Node[];
  readonly [attr: string]: any;
}

export interface NodeProps {
  children?: React.ReactNode;
  node: Node;
}

export type NodeRenderer = (props: NodeProps) => React.JSX.Element;

export interface RenderMap {
  readonly [attr: string]: NodeRenderer;
}
