import { NodePart } from "@medley-js/core";
import { CNode } from "@medley-js/common";

const isObservableNode = Symbol("isObservableNode");
export const getObservableNode = Symbol("getObservableNode");

declare module "@medley-js/core" {
  interface NodeContext {
    [getObservableNode]?: () => void;
  }
}

NodeContext.prototype[newCompositeScope] = function (
