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
  TNodeEditComponent,
  Coordinates
} from "@medley-js/common";
import { observable } from "mobx";

export const addTypes = (medley: Medley<CNode>) => {
    medley.types.addType(CompositeType);
    medley.types.addType(IdentityType);
    medley.types.addType(InputType);
    medley.types.addType(OutputType);
}

export const createEmptyCompositeNode = (medley: Medley<CNode>) => {
    const compositeNode = medley.nodes.insertNode({
        name: "empty_composite",
        type: CompositeType.name,
      });
    const compositeScope = Medley.getChildInstance(
    medley.getRootInstance(),
    compositeNode.id
    );
    return [compositeScope, compositeNode] as const
}

export const createBasicCompositeNode = (medley: Medley<CNode>, position?:Coordinates) => {
  const compositeNode = medley.nodes.insertNode({
    name: "basic_composite",
    type: CompositeType.name,
    position:position
  });

  const compositeScope = Medley.getChildInstance(
    medley.getRootInstance(),
    compositeNode.id
  );

  const id_0 = compositeScope.nodes.insertNode(
    observable({
      name: "INPUT",
      position: [0, 50],
      type: InputType.name,
    })
  );

  const id_1 = compositeScope.nodes.insertNode(
    observable({
      name: "Test_1",
      cache: Cache.scope,
      position: [200, 50],
      type: IdentityType.name,
    })
  );
  const id_2 = compositeScope.nodes.insertNode(
    observable({
      name: "Test_2",
      cache: Cache.scope,
      position: [600, 50],
      type: IdentityType.name,
    })
  );
  const id_3 = compositeScope.nodes.insertNode(
    observable({
      name: "Test_3",
      cache: Cache.scope,
      position: [1000, 300],
      type: IdentityType.name,
    })
  );
  const id_4 = compositeScope.nodes.insertNode(
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
