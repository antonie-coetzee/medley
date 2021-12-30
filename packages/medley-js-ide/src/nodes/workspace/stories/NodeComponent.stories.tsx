import React from "react";
import { Meta } from "@storybook/react";
import { Medley } from "@medley-js/core";
import { CLink, CNode, CType } from "@medley-js/common";
import { componentStory } from "@/util/util.sb";

export default {
  title: "Nodes/Workspace",
} as Meta;

export const Node = componentStory(async () => {
  const medley = new Medley<CNode, CType, CLink>();
  return () => (
    <div>asd</div>
  );
});