import React from "react";
import { Meta } from "@storybook/react";
import { Cache, Medley, NodeRepo } from "@medley-js/core";
import { CLink, CNode, constants, CType, TEditNodeComponent } from "@medley-js/common";

import { CompositeType } from "../type";
import { InputType } from "../scopedTypes/input/type";
import { OutputType } from "../scopedTypes/output/type";
import { IdentityType } from "../../index";
import { componentStory } from "../../../util/util.sb";
import { observable } from "mobx";

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
    name: "test_composite",
    type: CompositeType.name,
  });

  const childScope = Medley.getChildInstance(
    medley.getRootInstance(),
    compNode.id
  );

  const id_0 = childScope.nodes.insertNode(observable({
    name: "INPUT",
    position: [0,50],
    type: InputType.name,
  }));

  const id_1 = childScope.nodes.insertNode(observable({
    name: "Test_1",
    cache: Cache.scope,
    position: [200, 50 ],
    type: IdentityType.name,
  }));
  const id_2 = childScope.nodes.insertNode(observable({
    name: "Test_2",
    cache: Cache.scope,
    position: [600, 50 ],
    type: IdentityType.name,
  }));
  const id_3 = childScope.nodes.insertNode(observable({
    name: "Test_3",
    cache: Cache.scope,
    position: [1000, 300 ],
    type: IdentityType.name,
  }));
  const id_4 = childScope.nodes.insertNode(observable({
    name: "OUTPUT",
    position: [1400,50 ],
    type: OutputType.name,
  }));

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
    port: id_4.id,
    scope: compNode.id,
  });

  const EditNodeComponent = await medley.types.getExportFunction<TEditNodeComponent>(
    CompositeType.name,
    constants.EditNodeComponent
  );
  return () => (
    <EditNodeComponent
      context={{
        logger: null,
        medley: childScope,
        node: compNode,
      }}
      host={{}}
      close={null}
    />
  );
});