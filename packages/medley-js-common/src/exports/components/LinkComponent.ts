import { LinkContext } from "@medley-js/core";
import { ComponentType, CSSProperties, ReactElement, ReactNode, VFC } from "react";
import { ArrowHeadType, CLink, CMedleyTypes, Host, Position } from "../../types";

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
  sourcePosition: Position;
  targetPosition: Position;
  label?: string | ReactNode;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  data?: unknown;
  style?: CSSProperties;
  arrowHeadType?: ArrowHeadType;
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
