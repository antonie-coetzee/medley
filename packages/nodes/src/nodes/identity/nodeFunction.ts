import { NF } from "@medley-js/core";
import { IdentityNode } from "./node";

export const nodeFunction: NF<{}, IdentityNode> = ({input}) => {
  return input({name:"input"});
};
