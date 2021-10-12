import { GetPorts } from "medley-common";
import { IdentityNode } from "./node";

export const getPorts: GetPorts<IdentityNode> = () => {
  return [{name:"input"}];
};
