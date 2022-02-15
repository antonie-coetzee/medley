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
import { StringType } from "..";

export default {
  title: "Nodes/String",
} as Meta;

export const Node = nodeStory(StringType);