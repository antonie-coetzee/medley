import { Type } from "@medley-js/core";

import * as exports from "./index";

export const OutputType: Type = {
  name: "$output",
  version: "1.0.0",
  volatile: true,
  module: { import: () => Promise.resolve(exports) },
};
