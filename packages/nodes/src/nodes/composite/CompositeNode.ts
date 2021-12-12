import { CMedleyTypes, CNode, CPort } from "@medley-js/common";
import { Medley } from "@medley-js/core";

export const compositeScope = Symbol("compositeScope");

export type CompositeNode = CNode & {
  outputNode?: CNode;
  inputNodes?: (CNode & CPort)[];
  [compositeScope]?: Medley<CMedleyTypes>;
};