import { nodeStory } from "@/util/util.sb";
import { Meta } from "@storybook/react";
import { TemplateType } from "..";

export default {
  title: "Nodes/Template",
} as Meta;

export const Node = nodeStory(TemplateType);
