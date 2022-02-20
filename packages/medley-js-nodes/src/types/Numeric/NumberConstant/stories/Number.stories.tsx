import { nodeStory } from "@/util/util.sb";
import { Meta } from "@storybook/react";
import { numberConstantType } from "..";

export default {
  title: "Nodes/Number",
} as Meta;

export const Node = nodeStory(numberConstantType);
