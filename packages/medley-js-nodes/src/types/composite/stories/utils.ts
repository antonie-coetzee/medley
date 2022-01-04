
import { CMedleyTypes, Coordinates } from "@medley-js/common";
import { Medley, NodeContext } from "@medley-js/core";
import "../extensions/medley";
import { InputType } from "../scopedTypes/input";
import { InputNode } from "../scopedTypes/input/InputNode";
import { OutputType } from "../scopedTypes/output";
import { OutputNode } from "../scopedTypes/output/node";
import { CompositeType } from "..";
import { CompositeNode } from "../CompositeNode";
import { IdentityType } from "@/types/identity";
import { IdentityNode } from "@/types/identity/node";

export const addTypes = (medley: Medley<CMedleyTypes>) => {
  medley.types.upsertType(CompositeType);
  medley.types.upsertType(IdentityType);
  medley.types.upsertType(InputType);
  medley.types.upsertType(OutputType);
};

export const createEmptyCompositeNode = (medley: Medley<CMedleyTypes>) => {

  const compositeNode = medley.nodes.insertNodePart<CompositeNode>({
    name: "empty_composite",
    type: CompositeType.name,
  });
  
  const cNodeContext = new NodeContext<CompositeNode, CMedleyTypes>(medley, compositeNode);
  const cs = cNodeContext.compositeScope;

  const id_4 = cs.nodes.insertNodePart<OutputNode>({
    name: "OUTPUT",
    position: [600, 200],
    type: OutputType.name,
  });
  return cNodeContext;
};

export const createBasicCompositeNode = (
  medley: Medley<CMedleyTypes>,
  position?: Coordinates
) => {
  const compositeNode = medley.nodes.insertNodePart<CompositeNode>({
    name: "Basic Composite",
    type: CompositeType.name,
    position: position,
  });

  const cNodeContext = new NodeContext<CompositeNode, CMedleyTypes>(medley, compositeNode);
  const cs = cNodeContext.compositeScope;

  const id_0 = cs.nodes.insertNodePart<InputNode>({
    name: "INPUT1",
    position: [0, 50],
    type: InputType.name,
    value: { color: "green" },
  });

  const id_00 = cs.nodes.insertNodePart<InputNode>({
    name: "abc",
    position: [0, 100],
    type: InputType.name,
    value: { color: "red" },
  });

  const id_01 = cs.nodes.insertNodePart<InputNode>({
    name: "INPUT3",
    position: [0, 150],
    type: InputType.name,
    value: { color: "blue" },
  });

  const id_1 = cs.nodes.insertNodePart<IdentityNode>({
    name: "Test_1",
    position: [200, 50],
    type: IdentityType.name,
    value: {},
  });
  const id_2 = cs.nodes.insertNodePart<IdentityNode>({
    name: "Test_2",
    position: [600, 50],
    type: IdentityType.name,
    value: {},
  });
  const id_3 = cs.nodes.insertNodePart<IdentityNode>({
    name: "Test_3",
    position: [1000, 300],
    type: IdentityType.name,
    value: {},
  });
  const id_4 = cs.nodes.insertNodePart<OutputNode>({
    name: "OUTPUT",
    position: [1400, 50],
    type: OutputType.name,
  });

  cs.links.upsertLink({
    source: id_0.id,
    target: id_1.id,
    port: "input1",
    scope: compositeNode.id,
  });
  cs.links.upsertLink({
    source: id_1.id,
    target: id_2.id,
    port: "input1",
    scope: compositeNode.id,
  });
  cs.links.upsertLink({
    source: id_2.id,
    target: id_3.id,
    port: "input1",
    scope: compositeNode.id,
  });
  cs.links.upsertLink({
    source: id_3.id,
    target: id_4.id,
    port: id_4.id,
    scope: compositeNode.id,
  });

  return cNodeContext;
};
