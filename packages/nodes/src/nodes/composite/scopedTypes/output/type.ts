import { CType } from "@medley-js/common";
import * as exports from "./index";

export const OutputType: CType = {
  name: "$output",
  version: "1.0.0",
  volatile: true,
  import: () => Promise.resolve(exports),
};
