import { NF } from "medley";
import { IdentityNode } from "./node";

export const nodeFunction: NF<{}, IdentityNode> = ({input}) => {
  return input({name:"input"});
};
