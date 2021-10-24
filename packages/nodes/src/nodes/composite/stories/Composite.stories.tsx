import React from "react";
import { Meta } from "@storybook/react";
import { Cache, Medley } from "@medley-js/core";
import {
  CLink,
  CNode,
  constants,
  CType,
  GetNodeEditComponent,
} from "@medley-js/common";

import { CompositeType } from "../type";
import { InputType } from "../terminals/input/type";
import { OutputType } from "../terminals/output/type";
import { IdentityType } from "../../index";
import { componentStory } from "../../../util/util.sb";

export default {
  title: "Nodes/Composite",
} as Meta;

export const Edit = componentStory(async () => {
  const medley = new Medley<CNode, CType, CLink>();
  medley.types.addType(CompositeType);
  medley.types.addType(IdentityType);
  medley.types.addType(InputType);
  medley.types.addType(OutputType);

  const compNode = medley.nodes.insertNode({
    name: "test_composate",
    type: CompositeType.name,
  });

  const childScope = Medley.newChildInstance(
    medley.getRootInstance(),
    compNode.id
  );
  
  const id_0 = childScope.nodes.insertNode({
    name: "INPUT",
    position: { x: 0, y: 50 },
    type: InputType.name,
  });

  const id_1 = childScope.nodes.insertNode({
    name: "Test_1",
    cache: Cache.scope,
    position: { x: 200, y: 50 },
    type: IdentityType.name,
  });
  const id_2 = childScope.nodes.insertNode({
    name: "Test_2",
    cache: Cache.scope,
    position: { x: 600, y: 50 },
    type: IdentityType.name,
  });
  const id_3 = childScope.nodes.insertNode({
    name: "Test_3",
    cache: Cache.scope,
    position: { x: 1000, y: 300 },
    type: IdentityType.name,
  });
  const id_4 = childScope.nodes.insertNode({
    name: "OUTPUT",
    position: { x: 1400, y: 50 },
    type: OutputType.name,
  });

  childScope.links.addLink({
    source: id_0.id,
    target: id_1.id,
    port: "input1",
    scope: compNode.id,
  });
  childScope.links.addLink({
    source: id_1.id,
    target: id_2.id,
    port: "input1",
    scope: compNode.id,
  });
  childScope.links.addLink({
    source: id_2.id,
    target: id_3.id,
    port: "input1",
    scope: compNode.id,
  });
  childScope.links.addLink({
    source: id_3.id,
    target: id_4.id,
    port: "output",
    scope: compNode.id,
  });
  
  const getNodeEditComponent = (await medley.types.getExportFunction(
    CompositeType.name,
    constants.getNodeEditComponent
  )) as GetNodeEditComponent;
  return getNodeEditComponent({
    logger: null,
    medley: childScope,
    node: compNode,
  });
});

export const Node = componentStory(async () => {
  const medley = new Medley();
  medley.types.addType(CompositeType);
  const getNodeComponent = await medley.types.getExportFunction(
    CompositeType.name,
    constants.getNodeComponent
  );
  return getNodeComponent?.();
});
