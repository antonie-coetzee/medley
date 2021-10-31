import {
    NodeConstruct
  } from "@medley-js/common";
import { InputNode } from "../InputNode";

export const nodeConstruct: NodeConstruct<InputNode> = async ({node}) => {
    node.name = "Input"
    return true;
}