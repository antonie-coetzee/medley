import { CType } from "@medley-js/common";
import { category } from "../category";
import * as exports from "./exports";

export const CompositeType: CType = {
  name: "composite",
  version: "1.0.0",
  category: [category],
  import: () => Promise.resolve(exports),
};
