import { CMedleyTypes, CNode, CPort } from "@medley-js/common";
import { Input, Medley } from "@medley-js/core";

export const compositeScope = Symbol("compositeScope");
export const input = Symbol("input");

export type CompositeNode = CNode & {
  [compositeScope]?: Medley<CMedleyTypes>;
  [input]?: Input;
};