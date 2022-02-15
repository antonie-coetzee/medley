import { CType } from "@medley-js/common";
import * as exports from "./exports";

export const OutputType: CType = {
  name: exports.outputTypeName,
  version: "1.0.0",
  volatile: true,
  primitive: true,
  import: () => Promise.resolve(exports),
};
