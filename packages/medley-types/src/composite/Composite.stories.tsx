import React from "react";
import { Meta } from "@storybook/react";
import { Medley } from "medley";
import { constants, GetNodeEditComponent } from "medley-common";

import { componentStory } from "../util/util.sb";

import { CompositeType } from "./type";

export default {
  title: "Nodes/Composite",
} as Meta;

export const Example = componentStory(async () => {
  const medley = new Medley();
  medley.types.addType(CompositeType);
  const getNodeEditComponent = await medley.types.getExportFunction(
    CompositeType.name,
    constants.getEditComponent
  );
  return getNodeEditComponent?.();
});
