import { CSSProperties, ReactNode, VFC } from "react";
import { NodeContext } from "@medley-js/core";
import { CLink, CNode, Location, Host, CBaseTypes } from "../../types";

export type LinkProps = {
    id: string;
    source: string;
    target: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    selected?: boolean;
    animated?: boolean;
    sourcePosition: Location;
    targetPosition: Location;
    label?: string | ReactNode;
    labelStyle?: CSSProperties;
    labelShowBg?: boolean;
    labelBgStyle?: CSSProperties;
    labelBgPadding?: [number, number];
    labelBgBorderRadius?: number;
    style?: CSSProperties;
    arrowHeadType?: "arrow" | "arrowclosed";
    markerEndId?: string;
    data?: CLink;
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
  };

export type TLinkComponentProps<
  TNode extends CNode = CNode
> = {
  context: NodeContext<TNode, CBaseTypes>;
  host: Host;
  linkProps: LinkProps;
};

export type TLinkComponent<TNode extends CNode = CNode> = VFC<
  TLinkComponentProps<TNode>
>;
