import { CType } from "@medley-js/common";
import { category } from "../category";
import * as exports from "./exports";

export const BooleanType: CType = {
  name: "boolean",
  version: "1.0.0",
  primitive: true,
  category: [category],
  import: () => Promise.resolve(exports),
};
