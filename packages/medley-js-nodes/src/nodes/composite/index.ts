import { CType } from "@medley-js/common";
import * as exports from "./exports";

export const NodeType: CType = {
  name: "composite",
  version: "1.0.0",
  import: () => Promise.resolve(exports),
};
