import React from "react";
import { Meta } from "@storybook/react";
import { Medley } from "medley";
import { CLink, CNode, constants, CType, GetNodeEditComponent } from "medley-common";

import { CompositeType } from "../type";
import { IdentityType } from "../../index";
import { componentStory } from "../../../util/util.sb";

export default {
  title: "Nodes/Composite",
} as Meta;

export const Edit = componentStory(
  async () => {
    const medley = new Medley<CNode,CType,CLink>();
    medley.types.addType(CompositeType);
    medley.types.addType(IdentityType);

    const compNode = medley.nodes.upsertNode({name:"test_composate", type: CompositeType.name})

    const childScope = Medley.newChildInstance(medley.getRootInstance(), compNode.id);
    const id_1 = childScope.nodes.upsertNode({name:"IDENTITY_1", position:{x:50,y:50}, type: IdentityType.name})
    const id_2 = childScope.nodes.upsertNode({name:"IDENTITY_2", position:{x:200,y:50}, type: IdentityType.name})
    const id_3 = childScope.nodes.upsertNode({name:"IDENTITY_3", position:{x:350,y:50}, type: IdentityType.name})
    childScope.links.addLink({source:id_1.id, target:id_2.id, port:"input", scope: compNode.id})
    
    const getNodeEditComponent = await medley.types.getExportFunction(
      CompositeType.name,
      constants.getNodeEditComponent
    ) as GetNodeEditComponent;
    return getNodeEditComponent?.({logger:null, medley:childScope, node: compNode});
  },
  async () => {
    return ({ children }) => <div>{children}</div>;
  }
);

export const Node = componentStory(
  async () => {
    const medley = new Medley();
    medley.types.addType(CompositeType);
    const getNodeComponent = await medley.types.getExportFunction(
      CompositeType.name,
      constants.getNodeComponent
    );
    return getNodeComponent?.();
  }
);

