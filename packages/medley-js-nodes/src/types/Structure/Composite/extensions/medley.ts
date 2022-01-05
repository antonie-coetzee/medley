import { CMedley } from "@medley-js/common";
import { Medley, MedleyTypes } from "@medley-js/core";
import { createCompositeScope } from "./util/createCompositeScope";

declare module "@medley-js/core" {
  interface Medley<MT extends MedleyTypes> {
    compositeScope(compositeNodeId: string): Medley<MT>;
    executionCache: Map<string, unknown>;
  }
}

Medley.prototype.compositeScope = function (
  this: CMedley,
  compositeNodeId: string
) {
  return createCompositeScope(this, compositeNodeId);
};
