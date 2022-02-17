import { NF, Port } from "@medley-js/core";
import { IdentityNode } from "./node";

const PortOne: Port<string> = {
  id: "input1",
};

const PortTwo: Port<string> = {
  id: "input2",
};

export const nodeFunction: NF<IdentityNode> = async ({node, input}) => {
  const in1 = await input(PortOne);
  const in2 = await input(PortTwo);
  return (in1 || "") + (in2 || "")
};
