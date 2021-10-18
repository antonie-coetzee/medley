import { NF, UniPort } from "@medley-js/core";
import { IdentityNode } from "./node";

const PortOne: UniPort<string> = {
  name: "input1",
};

const PortTwo: UniPort<string> = {
  name: "input2",
};

export const nodeFunction: NF<{}, IdentityNode> = async ({node, input}) => {
  const in1 = await input(PortOne);
  const in2 = await input(PortTwo);
  console.log(node.id);
  return (in1 || "") + (node.value?.age || "") + (in2 || "")
};
