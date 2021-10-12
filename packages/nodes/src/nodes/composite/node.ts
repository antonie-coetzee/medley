import { CNode, CPort } from "medley-common";

export type CompositeNode = CNode<{
  outputNode: CNode;
  inputNodes?: (CNode & CPort)[]
}>;