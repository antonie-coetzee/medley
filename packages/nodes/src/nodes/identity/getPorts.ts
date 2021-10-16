import { GetPorts } from "@medley-js/common";
import { IdentityNode } from "./node";

export const getPorts: GetPorts<IdentityNode> = async () => {
  return [{name:"input"},{name:"input2"}];
};
