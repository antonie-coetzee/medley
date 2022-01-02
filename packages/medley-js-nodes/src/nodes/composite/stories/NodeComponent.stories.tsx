import React from "react";
import { Meta } from "@storybook/react";
import { Medley, NodeContext } from "@medley-js/core";
import {
  CLoader,
  CMedleyTypes,
  constants,
  TEditNodeComponent,
} from "@medley-js/common";

import { NodeType as CompositeType } from "../";
import { componentStory } from "../../../util/util.sb";
import {
  addTypes,
  createBasicCompositeNode,
  createEmptyCompositeNode,
} from "./utils";

export default {
  title: "Nodes/Composite",
} as Meta;

export const Node = componentStory(async () => {
  const medley = new Medley<CMedleyTypes>({loader:new CLoader()});
  addTypes(medley);
  const ecnContext = createEmptyCompositeNode(medley);
  const bcnContext = createBasicCompositeNode(ecnContext.compositeScope, [200, 200]);

  const EditNodeComponent = await medley.types.getExport<TEditNodeComponent>(
    CompositeType.name,
    constants.EditNodeComponent
  );
  if(EditNodeComponent == null){
    throw new Error("EditNodeComponent is undefined")
  }
  return () => (
    <EditNodeComponent
      context={ecnContext}
      host={{executeCommand:(cmd)=>cmd.execute()}}
      close={()=>{}}
    />
  );
});
