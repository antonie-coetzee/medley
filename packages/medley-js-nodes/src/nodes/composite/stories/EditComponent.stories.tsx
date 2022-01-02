import {
  CLoader,
  CMedleyTypes,
  constants,
  TEditNodeComponent,
} from "@medley-js/common";
import { Medley } from "@medley-js/core";
import { Meta } from "@storybook/react";
import React from "react";
import { NodeType as CompositeType } from "..";
import { componentStory } from "../../../util/util.sb";
import { addTypes, createBasicCompositeNode } from "./utils";

export default {
  title: "Nodes/Composite",
} as Meta;

export const Edit = componentStory(async () => {
  const medley = new Medley<CMedleyTypes>({ loader: new CLoader() });
  addTypes(medley);
  const bcnContext = createBasicCompositeNode(medley, [200, 200]);

  const EditNodeComponent = await medley.types.getExport<TEditNodeComponent>(
    CompositeType.name,
    constants.EditNodeComponent
  );
  if (EditNodeComponent == null) {
    throw new Error("EditNodeComponent is undefined");
  }
  return () => (
    <EditNodeComponent
      context={bcnContext}
      host={{ executeCommand: (cmd) => cmd.execute() }}
      close={() => {}}
    />
  );
});
