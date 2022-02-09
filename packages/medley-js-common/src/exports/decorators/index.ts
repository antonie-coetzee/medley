import { CSSProperties, ReactNode, VFC } from "react";
import { NodeContext } from "@medley-js/core";
import { CMedleyTypes, CLink, CNode, CType } from "../../types";

export type DecorateNode<TNode extends CNode = CNode> = (
  context: NodeContext<TNode, CMedleyTypes>
) => Promise<
  Partial<{
    selectable: boolean;
    draggable: boolean;
    connectable: boolean;
    sourcePosition: Location;
    targetPosition: Location;
    dragHandle: string;
  }>
>;