import { LinkContext, NodeContext } from "@medley-js/core";
import { ComponentType, CSSProperties, ReactNode, VFC } from "react";
import { CLink, CMedleyTypes, CNode, Host, Location } from "../../types";

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
  sourceHandleId?: string | null;
  targetHandleId?: string | null;
};

export type TLinkComponentProps<TLink extends CLink = CLink> = {
  context: LinkContext<TLink, CMedleyTypes>;
  host: Host;
  linkProps: LinkProps;
  DefaultLinkComponent: ComponentType<LinkProps>;
};

export type TLinkComponent<TLink extends CLink = CLink> = VFC<
  TLinkComponentProps<TLink>
>;
