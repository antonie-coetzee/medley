import { CType } from "@medley-js/common";
import { category } from "../category";
import * as exports from "./exports";

export const StringType: CType = {
  name: "string",
  version: "1.0.0",
  primitive: true,
  category: [category],
  import: () => Promise.resolve(exports),
};

