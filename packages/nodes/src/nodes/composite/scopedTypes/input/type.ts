import { Type } from "@medley-js/core";

import * as exports from "./index";

export const InputType: Type = {
  name: "$input",
  version: "1.0.0",
  volatile: true,
  module: { import: () => Promise.resolve(exports) },
};
