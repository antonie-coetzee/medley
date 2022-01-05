import { DecorateLink } from "@medley-js/common";
import { CompositeNode } from "../node";

export const decorateLink: DecorateLink<CompositeNode> = async (node) => {
  return {
      animated:true,
      style:{
        animation: "dashdraw 0.8s linear infinite",
        stroke: "black",
        strokeWidth: "2px"
      }
  }
};
