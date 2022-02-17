import { nodeStory } from "@/util/util.sb";
import { Meta } from "@storybook/react";
import { NumberType } from "..";

export default {
  title: "Nodes/Number",
} as Meta;

export const Node = nodeStory(NumberType);
