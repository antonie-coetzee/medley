import { CMedleyTypes, CNode } from "@medley-js/common";
import { NodeContext, Node, MedleyTypes } from "@medley-js/core";
import { isObservable, observable } from "mobx";

declare module "@medley-js/core" {
  interface Node {
    [key: symbol]: unknown;
  }
}
