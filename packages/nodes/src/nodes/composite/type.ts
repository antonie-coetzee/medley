import { Type } from "@medley-js/core";

import * as exports from "./index";

export const CompositeType: Type = {
  name: "composite",
  version: "1.0.0",
  module: { import: () => Promise.resolve(exports) },
};
