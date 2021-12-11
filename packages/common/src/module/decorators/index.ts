import { CSSProperties, ReactNode, VFC } from "react";
import { NodeContext } from "@medley-js/core";
import { CBaseTypes, CLink, CNode, CType } from "../../types";

export type DecorateNode<TNode extends CNode = CNode> = (
  context: NodeContext<TNode, CBaseTypes>
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

export type DecorateLink<TNode extends CNode = CNode> = (
  context: NodeContext<TNode, CBaseTypes>
) => Promise<
  Partial<{
    label: string | ReactNode;
    labelStyle: CSSProperties;
    labelShowBg: boolean;
    labelBgStyle: CSSProperties;
    labelBgPadding: [number, number];
    labelBgBorderRadius: number;
    style: CSSProperties;
    animated: boolean;
    isHidden: boolean;
    className: string;
  }>
>;
