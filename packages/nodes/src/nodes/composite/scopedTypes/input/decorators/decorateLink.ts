import { DecorateLink } from "@medley-js/common";
import { InputNode } from "../InputNode";

export const decorateLink: DecorateLink<InputNode> = async ({node}) => {
  return {
      animated:true,
      style: {stroke: node.value?.color ? node.value.color : "#0288d1"}
  }
};
