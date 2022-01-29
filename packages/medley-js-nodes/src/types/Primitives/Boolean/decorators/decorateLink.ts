import { DecorateLink } from "@medley-js/common";
import { BooleanNode } from "../node";

export const decorateLink: DecorateLink<BooleanNode> = async ({observableNode}) => {
  return {
     animated: observableNode.value
  }
};
