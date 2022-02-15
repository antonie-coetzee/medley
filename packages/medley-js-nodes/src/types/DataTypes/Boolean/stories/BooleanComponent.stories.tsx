import React from "react";
import { Meta } from "@storybook/react";
import { Medley, NodeContext } from "@medley-js/core";
import {
  CLoader,
  CMedleyTypes,
  constants,
  TEditNodeComponent,
  TNodeComponent,
} from "@medley-js/common";

import { componentStory, nodeStory } from "@/util/util.sb";
import { BooleanType } from "..";
import { BooleanNode } from "../node";

export default {
  title: "Nodes/Boolean",
} as Meta;

// export const Node = componentStory(async () => {
//   const medley = new Medley<CMedleyTypes>({loader:new CLoader()});

//   medley.types.upsertType(BooleanType);
//   const node = medley.nodes.insertNodePart<BooleanNode>({value:false, type: BooleanType.name, name:"asd"});

//   const NodeComponent = await medley.types.getExport<TNodeComponent>(
//     BooleanType.name,
//     constants.NodeComponent
//   );
//   if(NodeComponent == null){
//     throw new Error("nodeComponent is undefined")
//   }
//   return () => (
//     <NodeComponent
//       context={new NodeContext(medley, node)}
//       selected={false}
//       host={{executeCommand:(cmd)=>cmd.execute()}}
//     />
//   );
// });

export const Node = nodeStory(BooleanType);