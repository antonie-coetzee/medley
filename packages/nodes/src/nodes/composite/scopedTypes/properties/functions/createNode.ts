import {
    CreateNode
  } from "@medley-js/common";
import { PropertiesNode } from "../PropertiesNode";

export const createNode: CreateNode<PropertiesNode> = async ({nodePart}) => {
  nodePart.value = {}
  return true;
}