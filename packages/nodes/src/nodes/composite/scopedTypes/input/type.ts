import { Type } from "@medley-js/core";

import { inputTypeName } from "./typeName";
import * as exports from "./index";

export const InputType: Type = {
  name: inputTypeName,
  version: "1.0.0",
  volatile: true,
  module: { import: () => Promise.resolve(exports) },
};
