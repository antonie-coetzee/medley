import { CMedley, CNode } from "@medley-js/common";

export const compositeScopeKey = Symbol("compositeScopeKey");

export type CompositeNode = CNode & {
  [compositeScopeKey]: CMedley;
};
