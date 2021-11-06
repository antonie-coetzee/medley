import { IdentityType } from "../../index";
import { Cache, Medley } from "@medley-js/core";
import { InputType } from "../scopedTypes/input";
import { OutputType } from "../scopedTypes/output";
import { CompositeType } from "../type";
import {
  CLink,
  CNode,
  CNodePart,
  constants,
  CType,
  TEditNodeComponent,
  Coordinates
} from "@medley-js/common";
import { observable } from "mobx";
import { CompositeNode } from "..";
import { OutputNode } from "../scopedTypes/output/node";
import { InputNode } from "../scopedTypes/input/InputNode";
import { IdentityNode } from "@/nodes/identity";

export const addTypes = (medley: Medley<CNode>) => {
    medley.types.addType(CompositeType);
    medley.types.addType(IdentityType);
    medley.types.addType(InputType);
    medley.types.addType(OutputType);
}

export const createEmptyCompositeNode = (medley: Medley<CNode>) => {
    const compositeNode = medley.nodes.insertNode<CompositeNode>({
        name: "empty_composite",
        type: CompositeType.name,

      });
    const compositeScope = Medley.getChildInstance(
    medley.getRootInstance(),
    compositeNode.id
    );
    const id_4 = compositeScope.nodes.insertNode<OutputNode>(
      observable({
        name: "OUTPUT",
        position: [600, 200],
        type: OutputType.name,
      })
    );
    return [compositeScope, compositeNode] as const
}

export const createBasicCompositeNode = (medley: Medley<CNode>, position?:Coordinates) => {
  const compositeNode = medley.nodes.insertNode<CompositeNode>({
    name: "basic_composite",
    type: CompositeType.name,
    position:position
  });

  const compositeScope = Medley.getScopedInstance(
    medley.getRootInstance(),
    compositeNode.id
  );

  const id_0 = compositeScope.nodes.insertNode<InputNode>(
    observable({
      name: "INPUT1",
      position: [0, 50],
      type: InputType.name,
      value:{color:"green"}
    })
  );

  const id_00 = compositeScope.nodes.insertNode<InputNode>(
    observable({
      name: "abc",
      position: [0, 100],
      type: InputType.name,
      value:{color:"red"}
    })
  );

  const id_01 = compositeScope.nodes.insertNode<InputNode>(
    observable({
      name: "INPUT3",
      position: [0, 150],
      type: InputType.name,
      value:{color:"blue"}
    })
  );

  const id_1 = compositeScope.nodes.insertNode<IdentityNode>(
    observable({
      name: "Test_1",
      cache: Cache.scope,
      position: [200, 50],
      type: IdentityType.name,
      value: {}
    })
  );
  const id_2 = compositeScope.nodes.insertNode<IdentityNode>(
    observable({
      name: "Test_2",
      cache: Cache.scope,
      position: [600, 50],
      type: IdentityType.name,
      value: {}
    })
  );
  const id_3 = compositeScope.nodes.insertNode<IdentityNode>(
    observable({
      name: "Test_3",
      cache: Cache.scope,
      position: [1000, 300],
      type: IdentityType.name,
      value: {}
    })
  );
  const id_4 = compositeScope.nodes.insertNode<OutputNode>(
    observable({
      name: "OUTPUT",
      position: [1400, 50],
      type: OutputType.name,
    })
  );

  compositeScope.links.addLink({
    source: id_0.id,
    target: id_1.id,
    port: "input1",
    scope: compositeNode.id,
  });
  compositeScope.links.addLink({
    source: id_1.id,
    target: id_2.id,
    port: "input1",
    scope: compositeNode.id,
  });
  compositeScope.links.addLink({
    source: id_2.id,
    target: id_3.id,
    port: "input1",
    scope: compositeNode.id,
  });
  compositeScope.links.addLink({
    source: id_3.id,
    target: id_4.id,
    port: id_4.id,
    scope: compositeNode.id,
  });

  return [compositeScope, compositeNode] as const
};
