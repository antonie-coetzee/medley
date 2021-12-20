import { IdentityType } from "../../index";
import { Medley } from "@medley-js/core";
import { InputType } from "../scopedTypes/input";
import { OutputType } from "../scopedTypes/output";
import { CompositeType } from "../type";
import {
  Coordinates,
  CMedleyTypes
} from "@medley-js/common";
import "../extensions/medley"
import { observable } from "mobx";
import { CompositeNode } from "..";
import { OutputNode } from "../scopedTypes/output/node";
import { InputNode } from "../scopedTypes/input/InputNode";
import { IdentityNode } from "@/nodes/identity";
import { newCompositeScope } from "../extensions/medley";
import { compositeScope } from "../CompositeNode";

export const addTypes = (medley: Medley<CMedleyTypes>) => {
    medley.types.addType(CompositeType);
    medley.types.addType(IdentityType);
    medley.types.addType(InputType);
    medley.types.addType(OutputType);
}

export const createEmptyCompositeNode = (medley: Medley<CMedleyTypes>) => {
    const compositeNode = medley.nodes.insertNode<CompositeNode>({
        name: "empty_composite",
        type: CompositeType.name,

      });
    const compositeScope = medley[newCompositeScope](compositeNode.id);
    const id_4 = compositeScope.nodes.insertNode<OutputNode>(
      observable({
        name: "OUTPUT",
        position: [600, 200],
        type: OutputType.name,
      })
    );
    return [compositeScope, compositeNode] as const
}

export const createBasicCompositeNode = (medley: Medley<CMedleyTypes>, position?:Coordinates) => {
  const compositeNode = medley.nodes.insertNode<CompositeNode>(observable({
    name: "Basic Composite",
    type: CompositeType.name,
    position:position
  }));

  const cs = medley[newCompositeScope](compositeNode.id);
  compositeNode[compositeScope] = cs;
  const id_0 = cs.nodes.insertNode<InputNode>(
    {
      name: "INPUT1",
      position: [0, 50],
      type: InputType.name,
      value:{color:"green"}
    }
  );

  const id_00 = cs.nodes.insertNode<InputNode>(
    {
      name: "abc",
      position: [0, 100],
      type: InputType.name,
      value:{color:"red"}
    }
  );

  const id_01 = cs.nodes.insertNode<InputNode>(
    {
      name: "INPUT3",
      position: [0, 150],
      type: InputType.name,
      value:{color:"blue"}
    }
  );

  const id_1 = cs.nodes.insertNode<IdentityNode>(
    {
      name: "Test_1",
      position: [200, 50],
      type: IdentityType.name,
      value: {}
    }
  );
  const id_2 = cs.nodes.insertNode<IdentityNode>(
    {
      name: "Test_2",
      position: [600, 50],
      type: IdentityType.name,
      value: {}
    }
  );
  const id_3 = cs.nodes.insertNode<IdentityNode>(
    {
      name: "Test_3",
      position: [1000, 300],
      type: IdentityType.name,
      value: {}
    }
  );
  const id_4 = cs.nodes.insertNode<OutputNode>(
    {
      name: "OUTPUT",
      position: [1400, 50],
      type: OutputType.name,
    }
  );

  cs.links.addLink({
    source: id_0.id,
    target: id_1.id,
    port: "input1",
    scope: compositeNode.id,
  });
  cs.links.addLink({
    source: id_1.id,
    target: id_2.id,
    port: "input1",
    scope: compositeNode.id,
  });
  cs.links.addLink({
    source: id_2.id,
    target: id_3.id,
    port: "input1",
    scope: compositeNode.id,
  });
  cs.links.addLink({
    source: id_3.id,
    target: id_4.id,
    port: id_4.id,
    scope: compositeNode.id,
  });

  return [cs, compositeNode] as const
};
