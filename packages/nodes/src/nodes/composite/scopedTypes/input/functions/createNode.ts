import { CreateNode } from "@medley-js/common";
import { InputNode } from "../InputNode";

export const createNode: CreateNode<InputNode> = async ({ nodePart }) => {
  nodePart.name = "Input";
  nodePart.value = { color: "black" };
  return true;
};
