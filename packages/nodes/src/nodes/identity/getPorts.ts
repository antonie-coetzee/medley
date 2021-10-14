import { GetPorts } from "@medley-js/common";
import { IdentityNode } from "./node";

export const getPorts: GetPorts<IdentityNode> = () => {
  return [{name:"input"}];
};
