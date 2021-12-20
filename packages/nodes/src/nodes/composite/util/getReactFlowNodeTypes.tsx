import { memo, ReactNode, VFC } from "react";
import { BaseContext, NodeContext } from "@medley-js/core";
import {
  CLink,
  CNode,
  constants,
  CType,
  Host,
  TNodeComponent,
  TNodeComponentProps,
  TLinkComponentProps,
  LinkProps,
  TLinkComponent,
  CMedleyTypes,
} from "@medley-js/common";
import React from "react";
import { getNodes } from ".";
import { observable } from "mobx";
import { observer } from "mobx-react";

export async function getReactFlowTypes(
  context: BaseContext<CMedleyTypes>,
  host: Host
): Promise<{
  nodeTypes: { [index: string]: ReactNode };
  edgeTypes: { [index: string]: ReactNode };
}> {
  const typeNames = [
    ...new Set([
      ...getNodes(context).map((n) => n.type),
      ...["$input", "$output"],
    ]),
  ];
  const types = await Promise.all(
    typeNames.map(async (typeName) => {
      const nodeComponent = await context.medley.types.getExport<
        TNodeComponent<CNode>
      >(typeName, constants.NodeComponent);
      const linkComponent = await context.medley.types.getExport<
        TLinkComponent<CNode>
      >(typeName, constants.LinkComponent);
      return { typeName, nodeComponent, linkComponent };
    })
  );
  const wrappedTypes = types.reduce(
    (acc, crnt) => {
      if (crnt.nodeComponent) {
        acc.nodeTypes[crnt.typeName] = wrapNodeComponent(
          host,
          memo(observer(crnt.nodeComponent))
        );
      }
      if (crnt.linkComponent) {
        acc.edgeTypes[crnt.typeName] = wrapLinkComponent(
          host,
          memo(observer(crnt.linkComponent))
        );
      }
      return acc;
    },
    { nodeTypes: {}, edgeTypes: {} } as {
      nodeTypes: { [index: string]: ReactNode };
      edgeTypes: { [index: string]: ReactNode };
    }
  );

  return wrappedTypes;
}

function wrapNodeComponent(
  host: Host,
  NodeComponent: React.VFC<TNodeComponentProps>
) {
  const nodeWrapper: VFC<{
    id: string;
    data: NodeContext<CNode, CMedleyTypes>;
    selected: boolean;
    sourcePosition: string;
    targetPosition: string;
  }> = (props) => {
    const nodeContext = props.data;
    if (nodeContext) {
      return (
        <NodeComponent
          context={nodeContext}
          host={host}
          selected={props.selected}
        />
      );
    } else {
      return null;
    }
  };
  return nodeWrapper;
}

function wrapLinkComponent(
  host: Host,
  LinkComponent: React.VFC<TLinkComponentProps>
) {
  const linkWrapper: VFC<
    Omit<LinkProps, "data"> & {
      data: {
        context: NodeContext<CNode, CMedleyTypes>;
        link: CLink;
      };
    }
  > = (props) => {
    const context = props.data.context;
    const linkProps = { ...props, data: props.data.link };
    if (context) {
      return (
        <LinkComponent
          context={context}
          host={host}
          linkProps={linkProps}
        />
      );
    } else {
      return null;
    }
  };
  return linkWrapper;
}
