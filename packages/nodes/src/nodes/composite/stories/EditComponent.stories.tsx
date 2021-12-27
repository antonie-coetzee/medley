import React from "react";
import { Meta } from "@storybook/react";
import { Medley, NodeContext } from "@medley-js/core";
import { CLoader, CMedleyTypes, constants, TEditNodeComponent } from "@medley-js/common";

import { CompositeType } from "../type";
import { componentStory } from "../../../util/util.sb";
import { addTypes, createBasicCompositeNode } from "./utils";

export default {
  title: "Nodes/Composite",
} as Meta;

export const Edit = componentStory(async () => {
  const medley = new Medley<CMedleyTypes>({loader:new CLoader()});
  addTypes(medley);
  const bcn = createBasicCompositeNode(medley, [200, 200]);

  const EditNodeComponent = await medley.types.getExport<TEditNodeComponent>(
    CompositeType.name,
    constants.EditNodeComponent
  );
  if(EditNodeComponent == null){
    throw new Error("EditNodeComponent is undefined")
  }
  return () => (
    <EditNodeComponent
      context={new NodeContext(medley, bcn)}
      host={{}}
      close={()=>{}}
    />
  );
});