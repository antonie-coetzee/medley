import {
    CreateNode
  } from "@medley-js/common";
import { InputNode } from "../InputNode";

export const createNode: CreateNode<InputNode> = async ({node}) => {
    node.name = "Input"
    node.value = {color:"black"}
    return true;
}