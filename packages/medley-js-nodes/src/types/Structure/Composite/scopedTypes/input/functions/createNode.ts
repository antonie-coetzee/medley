import { NodeConstructor } from "@medley-js/common";
import { InputNode } from "../InputNode";

export const nodeConstructor: NodeConstructor<InputNode> = async () => {
  return { value: { color: "black" } };
};
