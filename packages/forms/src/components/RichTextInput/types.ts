import { ReactNode, JSX } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Attrs = Readonly<Record<string, any>>;

export interface Node {
  type: string;
  attrs?: Attrs;
  marks?: Attrs[];
  content?: Node[];
  readonly [attr: string]: any;
}

interface NodeProps {
  children?: ReactNode;
  node: Node;
}

export type NodeRenderer = (props: NodeProps) => JSX.Element;

export type RenderMap = Readonly<Record<string, NodeRenderer>>;
