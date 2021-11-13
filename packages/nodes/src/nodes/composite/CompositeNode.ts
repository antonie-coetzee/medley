import { CNode, CPort } from "@medley-js/common";

export type CompositeNode = CNode & {
  outputNode?: CNode;
  inputNodes?: (CNode & CPort)[];
  getStores?: <T>()=>T;
};