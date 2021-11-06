import { Type } from "@medley-js/core";

import * as exports from "./index";

export const PropertiesType: Type = {
  name: "$properties",
  volatile: true,
  version: "1.0.0",
  module: { import: () => Promise.resolve(exports) },
};
