import React from "react";
import { Meta } from "@storybook/react";
import { Medley } from "medley";
import { constants, GetNodeEditComponent } from "medley-common";

import { CompositeType } from "../type";
import { componentStory } from "../../../util/util.sb";

export default {
  title: "Nodes/Composite",
} as Meta;

export const Edit = componentStory(
  async () => {
    const medley = new Medley();
    medley.types.addType(CompositeType);
    const getNodeEditComponent = await medley.types.getExportFunction(
      CompositeType.name,
      constants.getNodeEditComponent
    );
    return getNodeEditComponent?.();
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

